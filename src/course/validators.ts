import type { QueryResult, ValidationResult } from './types'
import { busiestDay, busiestDayCount, transactions } from './data/transactions'

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

function columnSet(result: QueryResult) {
  return new Set(result.columns.map((c) => c.toLowerCase()))
}

export function validateLimitThree(_sql: string, result: QueryResult): ValidationResult {
  const err = hasError(result)
  if (err) return err
  if (result.rows.length !== 3) return fail('Return exactly 3 rows using LIMIT 3.')
  if (!columnSet(result).has('tx_hash')) return fail('Select from the transactions table.')
  return pass(
    'Correct! You can read the on-chain export.',
    'Each row is one transfer — tx_hash is the unique on-chain identifier.',
  )
}

export function validateSelectColumns(_sql: string, result: QueryResult): ValidationResult {
  const err = hasError(result)
  if (err) return err
  const cols = columnSet(result)
  if (!cols.has('sender') || !cols.has('amount_eth')) {
    return fail('Select only sender and amount_eth.')
  }
  if (cols.size !== 2) return fail('Your query should return exactly two columns.')
  return pass(
    'Correct! Compliance view ready.',
    'Analysts often strip noisy columns and focus on who moved how much ETH.',
  )
}

export function validateFilterAmount(sql: string, result: QueryResult): ValidationResult {
  const err = hasError(result)
  if (err) return err
  const normalized = normalizeSql(sql)
  if (!normalized.includes('where')) return fail('Use a WHERE clause to filter rows.')
  if (!normalized.includes('amount_eth')) return fail('Filter on the amount_eth column.')
  const expected = transactions.filter((tx) => tx.amount_eth > 1)
  if (result.rows.length !== expected.length) {
    return fail(`Expected ${expected.length} rows where amount_eth > 1.`)
  }
  return pass(
    'Correct! Whale transfers flagged.',
    `You found ${expected.length} transfers over 1 ETH — the usual starting point for risk review.`,
  )
}

export function validateCountAll(_sql: string, result: QueryResult): ValidationResult {
  const err = hasError(result)
  if (err) return err
  if (result.rows.length !== 1) return fail('COUNT returns a single row.')
  const value = Number(result.rows[0]?.[0])
  if (value !== transactions.length) {
    return fail(`Expected a count of ${transactions.length} transactions.`)
  }
  return pass(
    'Correct! Dataset size confirmed.',
    `This chain snapshot contains ${transactions.length} transfers — your baseline before any breakdown.`,
  )
}

export function validateGroupByDate(sql: string, result: QueryResult): ValidationResult {
  const err = hasError(result)
  if (err) return err
  const normalized = normalizeSql(sql)
  if (!normalized.includes('group by')) return fail('Use GROUP BY to aggregate per day.')
  if (!normalized.includes('tx_date') && !normalized.includes('date')) {
    return fail('Group by the tx_date column.')
  }
  if (!normalized.includes('count')) return fail('Use COUNT to tally transactions.')

  const expectedDays = new Set(transactions.map((tx) => tx.tx_date))
  if (result.rows.length !== expectedDays.size) {
    return fail(`Expected one row per day (${expectedDays.size} days).`)
  }
  return pass(
    'Correct! Daily activity mapped.',
    'Network load shifts day to day — this is how analysts spot spikes before digging deeper.',
  )
}

export function validateBusiestDay(sql: string, result: QueryResult): ValidationResult {
  const err = hasError(result)
  if (err) return err
  const normalized = normalizeSql(sql)
  if (!normalized.includes('group by')) return fail('Aggregate by day first with GROUP BY.')
  if (!normalized.includes('order by')) return fail('Use ORDER BY to rank days by activity.')
  if (!normalized.includes('limit')) return fail('Return only the top row with LIMIT 1.')
  if (result.rows.length !== 1) return fail('Return exactly 1 row — the busiest day.')

  const dateCol = result.columns.findIndex((c) => c.toLowerCase().includes('date'))
  const countCol = result.columns.findIndex((c) => c.toLowerCase().includes('count'))
  if (dateCol === -1 || countCol === -1) {
    return fail('Return tx_date and a count column.')
  }

  const date = String(result.rows[0][dateCol])
  const count = Number(result.rows[0][countCol])
  if (date !== busiestDay || count !== busiestDayCount) {
    return fail(`Expected ${busiestDay} with ${busiestDayCount} transactions.`)
  }

  return pass(
    'Lesson complete! You analysed on-chain activity with SQL.',
    `${busiestDay} was the busiest day with ${busiestDayCount} transfers — a real analyst workflow end to end.`,
  )
}
