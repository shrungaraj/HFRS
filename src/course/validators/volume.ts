import type { QueryResult, ValidationResult } from '../types'
import {
  CAPSTONE_LIMIT,
  EXCLUDED_TOKENS,
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

function hasDuneTable(sql: string) {
  const n = normalizeSql(sql)
  return n.includes('dex.trades') || n.includes('dex_trades')
}

function hasPartitionFilters(sql: string) {
  const n = normalizeSql(sql)
  return n.includes('blockchain') && n.includes('block_month')
}

export function validateDunePartitions(sql: string, result: QueryResult): ValidationResult {
  const err = hasError(result)
  if (err) return err
  if (!hasDuneTable(sql)) return fail('Query dex.trades on Dune.')
  if (!hasPartitionFilters(sql)) {
    return fail("Always filter blockchain and block_month — Dune's partition keys.")
  }
  if (!normalizeSql(sql).includes('block_time')) return fail('Add a block_time filter for the 4h window.')

  const expected = tradesInWindow()
  if (result.rows.length !== expected.length) {
    return fail(`Expected ${expected.length} trades in the 4-hour window.`)
  }
  return pass(
    'Dune filters set.',
    'On Dune, always lead with blockchain + block_month — it keeps queries fast and cheap.',
  )
}

export function validateExcludeMajors(sql: string, result: QueryResult): ValidationResult {
  const err = hasError(result)
  if (err) return err
  const normalized = normalizeSql(sql)
  if (!hasPartitionFilters(sql)) return fail('Keep blockchain and block_month filters.')
  if (!normalized.includes('token_bought_symbol')) return fail('Filter token_bought_symbol.')
  if (!normalized.includes('not in')) return fail("Exclude majors: NOT IN ('USDC', 'USDT', …).")

  const tokenIdx = findTokenColumn(result)
  if (tokenIdx === -1) return fail('Return token_bought_symbol.')

  const tokens = result.rows.map((row) => String(row[tokenIdx]).toUpperCase())
  for (const excluded of EXCLUDED_TOKENS) {
    if (tokens.includes(excluded)) return fail(`${excluded} should be excluded.`)
  }

  const expected = tradesInWindowExcludingMajors()
  if (result.rows.length !== expected.length) {
    return fail(`Expected ${expected.length} altcoin trades after exclusions.`)
  }
  return pass(
    'Majors excluded.',
    'USDC, USDT, BTC, ETH, XRP & SOL stripped — alt volume is now visible.',
  )
}

export function validateRankByVolume(sql: string, result: QueryResult): ValidationResult {
  const err = hasError(result)
  if (err) return err
  const normalized = normalizeSql(sql)
  if (!normalized.includes('group by')) return fail('GROUP BY token_bought_symbol.')
  if (!normalized.includes('sum(amount_usd)')) return fail('Use sum(amount_usd) as total_volume_usd.')
  if (!normalized.includes('order by')) return fail('ORDER BY total_volume_usd desc.')

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
    `${expected[0].token} leads — this is the query structure you'd paste into Dune.`,
  )
}

export function validateTopCoinsCapstone(sql: string, result: QueryResult): ValidationResult {
  const err = hasError(result)
  if (err) return err
  const normalized = normalizeSql(sql)
  if (!hasDuneTable(sql)) return fail('Query from dex.trades.')
  if (!hasPartitionFilters(sql)) return fail('Include blockchain and block_month filters.')
  if (!normalized.includes('block_time')) return fail('Filter block_time for the last 4 hours.')
  if (!normalized.includes('interval')) return fail("Use now() - interval '4' hour for the time window.")
  if (!normalized.includes('token_bought_symbol')) return fail('Use token_bought_symbol.')
  if (!normalized.includes('not in')) return fail('Exclude USDC, USDT, BTC, ETH, XRP, SOL.')
  if (!normalized.includes('group by')) return fail('GROUP BY token_bought_symbol.')
  if (!normalized.includes('order by')) return fail('ORDER BY total_volume_usd desc.')
  if (!/limit\s+10\b/i.test(normalized)) return fail('LIMIT 10.')

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
    'Ready for Dune!',
    `${leader.token} is #1 at $${(leader.total_volume_usd / 1_000_000).toFixed(2)}M — copy this query straight to dune.com.`,
  )
}
