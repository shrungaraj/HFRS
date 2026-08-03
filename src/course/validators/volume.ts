import type { QueryResult, ValidationResult } from '../types'
import {
  CAPSTONE_LIMIT,
  EXCLUDED_TOKENS,
  WINDOW_START,
  topTokensByVolume,
  tradesInWindow,
  tradesInWindowExcludingMajors,
} from '../data/dexTrades'

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
  return result.columns.findIndex((c) => {
    const col = c.toLowerCase()
    return col === 'token' || col === 'token_bought_symbol'
  })
}

export function validateLastFourHours(sql: string, result: QueryResult): ValidationResult {
  const err = hasError(result)
  if (err) return err
  const normalized = normalizeSql(sql)
  if (!normalized.includes('block_time')) return fail('Filter on block_time for the 4-hour window.')
  if (!normalized.includes('dex.trades') && !normalized.includes('dex_trades')) {
    return fail('Query dex.trades — the DEX trades table.')
  }
  if (!normalized.includes('where')) return fail('Use WHERE block_time >= TIMESTAMP …')

  const expected = tradesInWindow()
  if (result.rows.length !== expected.length) {
    return fail(`Expected ${expected.length} trades since ${WINDOW_START}.`)
  }
  return pass(
    'Window set.',
    `${expected.length} DEX trades in the last 4 hours — stables and blue chips dominate raw volume.`,
  )
}

export function validateExcludeMajors(sql: string, result: QueryResult): ValidationResult {
  const err = hasError(result)
  if (err) return err
  const normalized = normalizeSql(sql)
  if (!normalized.includes('token_bought_symbol')) {
    return fail('Filter on token_bought_symbol.')
  }
  if (!normalized.includes('not in')) return fail('Exclude majors with NOT IN (…).')

  const tokenIdx = findTokenColumn(result)
  if (tokenIdx === -1) return fail('Return token_bought_symbol (or alias token).')

  const tokens = result.rows.map((row) => String(row[tokenIdx]).toUpperCase())
  for (const excluded of EXCLUDED_TOKENS) {
    if (tokens.includes(excluded)) {
      return fail(`${excluded} should be excluded.`)
    }
  }

  const expected = tradesInWindowExcludingMajors()
  if (result.rows.length !== expected.length) {
    return fail(`Expected ${expected.length} altcoin trades after exclusions.`)
  }
  return pass(
    'Majors stripped out.',
    'USDC, USDT, BTC, ETH, XRP & SOL removed — now alt volume is visible.',
  )
}

export function validateRankByVolume(sql: string, result: QueryResult): ValidationResult {
  const err = hasError(result)
  if (err) return err
  const normalized = normalizeSql(sql)
  if (!normalized.includes('group by')) return fail('GROUP BY token_bought_symbol.')
  if (!normalized.includes('sum')) return fail('SUM(amount_usd) as total_volume_usd.')
  if (!normalized.includes('order by')) return fail('ORDER BY total_volume_usd DESC.')

  const tokenIdx = findTokenColumn(result)
  const volIdx = findVolumeColumn(result)
  if (tokenIdx === -1 || volIdx === -1) return fail('Return token and total_volume_usd.')

  const expected = topTokensByVolume(10)
  if (result.rows.length !== expected.length) {
    return fail(`Expected ${expected.length} tokens ranked by volume.`)
  }

  const topToken = String(result.rows[0][tokenIdx]).toUpperCase()
  if (topToken !== expected[0].token.toUpperCase()) {
    return fail(`${expected[0].token} should be #1 by volume.`)
  }

  return pass(
    'Volume ranked.',
    `${expected[0].token} leads at $${(expected[0].total_volume_usd / 1_000_000).toFixed(2)}M — that's the rotation.`,
  )
}

export function validateTopCoinsCapstone(sql: string, result: QueryResult): ValidationResult {
  const err = hasError(result)
  if (err) return err
  const normalized = normalizeSql(sql)
  if (!normalized.includes('dex.trades') && !normalized.includes('dex_trades')) {
    return fail('Query from dex.trades.')
  }
  if (!normalized.includes('block_time')) return fail('Filter block_time >= TIMESTAMP …')
  if (!normalized.includes('token_bought_symbol')) return fail('Use token_bought_symbol.')
  if (!normalized.includes('not in')) return fail('Exclude USDC, USDT, BTC, ETH, XRP, SOL.')
  if (!normalized.includes('group by')) return fail('GROUP BY token_bought_symbol.')
  if (!normalized.includes('order by')) return fail('ORDER BY total_volume_usd DESC.')
  if (!/limit\s+10\b/i.test(normalized)) return fail('LIMIT 10 for the top 10 coins.')

  const expected = topTokensByVolume(CAPSTONE_LIMIT)
  const tokenIdx = findTokenColumn(result)
  const volIdx = findVolumeColumn(result)
  if (tokenIdx === -1 || volIdx === -1) return fail('Return token and total_volume_usd.')

  if (result.rows.length !== expected.length) {
    return fail(`Return the top ${CAPSTONE_LIMIT} coins.`)
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
    'Top 10 altcoins found!',
    `${leader.token} is #1 at $${(leader.total_volume_usd / 1_000_000).toFixed(2)}M in 4h — production Dune query, same logic.`,
  )
}
