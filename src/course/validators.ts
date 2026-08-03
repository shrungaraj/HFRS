import type { QueryResult, ValidationResult } from './types'
import { transactions } from './data/transactions'

function fail(message: string): ValidationResult {
  return { passed: false, message }
}

function pass(message = 'Correct! Nice work.') {
  return { passed: true, message }
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
  return pass()
}

export function validateSelectColumns(_sql: string, result: QueryResult): ValidationResult {
  const err = hasError(result)
  if (err) return err
  const cols = columnSet(result)
  if (!cols.has('sender') || !cols.has('amount')) {
    return fail('Select only the sender and amount columns.')
  }
  if (cols.size !== 2) return fail('Your query should return exactly two columns.')
  return pass()
}

export function validateFilterAmount(sql: string, result: QueryResult): ValidationResult {
  const err = hasError(result)
  if (err) return err
  const normalized = normalizeSql(sql)
  if (!normalized.includes('where')) return fail('Use a WHERE clause to filter rows.')
  if (!normalized.includes('amount')) return fail('Filter on the amount column.')
  const expected = transactions.filter((tx) => tx.amount > 1)
  if (result.rows.length !== expected.length) {
    return fail(`Expected ${expected.length} rows where amount > 1.`)
  }
  return pass()
}

export function validateCountAll(_sql: string, result: QueryResult): ValidationResult {
  const err = hasError(result)
  if (err) return err
  if (result.rows.length !== 1) return fail('COUNT returns a single row.')
  const value = Number(result.rows[0]?.[0])
  if (value !== transactions.length) {
    return fail(`Expected a count of ${transactions.length} transactions.`)
  }
  return pass()
}

export function validateGroupByDate(sql: string, result: QueryResult): ValidationResult {
  const err = hasError(result)
  if (err) return err
  const normalized = normalizeSql(sql)
  if (!normalized.includes('group by')) return fail('Use GROUP BY to aggregate per day.')
  if (!normalized.includes('date')) return fail('Group by the date column.')
  if (!normalized.includes('count')) return fail('Use COUNT to tally transactions.')

  const expectedDays = new Set(transactions.map((tx) => tx.date))
  if (result.rows.length !== expectedDays.size) {
    return fail(`Expected one row per day (${expectedDays.size} days).`)
  }
  return pass()
}
