import type { QueryResult, ValidationResult } from '../types'
import {
  EXCLUDED_TOKENS,
  WINDOW_START,
  swapsInWindow,
  swapsInWindowExcludingMajors,
  topTokensByVolume,
} from '../data/volumeSwaps'

function fail(message: string): ValidationResult {
  return { passed: false, message }
}

function pass(message: string, insight?: string): ValidationResult {
  return { passed: true, message, insight }
}

function normalizeSql(sql: string) {
  return sql.trim().replace(/\s+/g, ' ').toLowerCase()
}

function hasError(result: QueryResult) {
  if (result.error) return fail(result.error)
  return null
}

function findVolumeColumn(result: QueryResult) {
  return result.columns.findIndex((c) => c.toLowerCase().includes('volume'))
}

function findTokenColumn(result: QueryResult) {
  return result.columns.findIndex((c) => c.toLowerCase() === 'token')
}

export function validateLastFourHours(sql: string, result: QueryResult): ValidationResult {
  const err = hasError(result)
  if (err) return err
  const normalized = normalizeSql(sql)
  if (!normalized.includes('swapped_at')) return fail('Filter on swapped_at for the time window.')
  if (!normalized.includes('where')) return fail('Use WHERE to limit to the last 4 hours.')

  const expected = swapsInWindow()
  if (result.rows.length !== expected.length) {
    return fail(`Expected ${expected.length} swaps since ${WINDOW_START}.`)
  }
  return pass(
    'Window set.',
    `${expected.length} swaps in the last 4 hours — majors like ETH and USDC dominate raw volume.`,
  )
}

export function validateExcludeMajors(sql: string, result: QueryResult): ValidationResult {
  const err = hasError(result)
  if (err) return err
  const normalized = normalizeSql(sql)
  if (!normalized.includes('not in') && !normalized.includes('!=')) {
    return fail('Exclude majors with NOT IN or similar filter.')
  }

  const tokenIdx = findTokenColumn(result)
  if (tokenIdx === -1) return fail('Return the token column.')

  const tokens = result.rows.map((row) => String(row[tokenIdx]).toUpperCase())
  for (const excluded of EXCLUDED_TOKENS) {
    if (tokens.includes(excluded)) {
      return fail(`${excluded} should be excluded — it's a stablecoin or blue chip.`)
    }
  }

  const expected = swapsInWindowExcludingMajors()
  if (result.rows.length !== expected.length) {
    return fail(`Expected ${expected.length} altcoin swaps after exclusions.`)
  }
  return pass(
    'Majors stripped out.',
    'USDC, USDT, BTC, ETH, XRP & SOL removed — now you can see what alts are actually moving.',
  )
}

export function validateRankByVolume(sql: string, result: QueryResult): ValidationResult {
  const err = hasError(result)
  if (err) return err
  const normalized = normalizeSql(sql)
  if (!normalized.includes('group by')) return fail('GROUP BY token to aggregate volume.')
  if (!normalized.includes('sum')) return fail('SUM(volume_usd) to total each coin\'s volume.')
  if (!normalized.includes('order by')) return fail('ORDER BY total volume descending.')

  const tokenIdx = findTokenColumn(result)
  const volIdx = findVolumeColumn(result)
  if (tokenIdx === -1 || volIdx === -1) return fail('Return token and total volume columns.')

  const expected = topTokensByVolume(10)
  if (result.rows.length !== expected.length) {
    return fail(`Expected ${expected.length} tokens ranked by volume.`)
  }

  const topToken = String(result.rows[0][tokenIdx]).toUpperCase()
  if (topToken !== expected[0].token.toUpperCase()) {
    return fail(`${expected[0].token} should be #1 by volume right now.`)
  }

  return pass(
    'Volume ranked.',
    `${expected[0].token} leads with $${(expected[0].total_volume_usd / 1_000_000).toFixed(2)}M — that's the heat.`,
  )
}

export function validateTopCoinsCapstone(sql: string, result: QueryResult): ValidationResult {
  const err = hasError(result)
  if (err) return err
  const normalized = normalizeSql(sql)
  if (!normalized.includes('swapped_at')) return fail('Filter to the last 4 hours with swapped_at.')
  if (!normalized.includes('not in')) return fail('Exclude USDC, USDT, BTC, ETH, XRP, SOL.')
  if (!normalized.includes('group by')) return fail('GROUP BY token.')
  if (!normalized.includes('order by')) return fail('ORDER BY volume DESC.')
  if (!normalized.includes('limit')) return fail('LIMIT your results — try top 5.')

  const expected = topTokensByVolume(5)
  const tokenIdx = findTokenColumn(result)
  const volIdx = findVolumeColumn(result)
  if (tokenIdx === -1 || volIdx === -1) return fail('Return token and total_volume_usd.')

  if (result.rows.length !== expected.length) {
    return fail(`Return the top ${expected.length} coins.`)
  }

  for (let i = 0; i < expected.length; i++) {
    const token = String(result.rows[i][tokenIdx]).toUpperCase()
    const vol = Number(result.rows[i][volIdx])
    if (token !== expected[i].token.toUpperCase()) {
      return fail(`#${i + 1} should be ${expected[i].token}.`)
    }
    if (Math.abs(vol - expected[i].total_volume_usd) > 1) {
      return fail(`Volume for ${expected[i].token} doesn't match.`)
    }
  }

  const leader = expected[0]
  return pass(
    'Top coins found!',
    `${leader.token} is #1 at $${(leader.total_volume_usd / 1_000_000).toFixed(2)}M in 4h — this is how traders spot rotation early.`,
  )
}
