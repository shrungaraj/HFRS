import alasql from 'alasql'
import { transactions } from './data/transactions'
import type { QueryResult } from './types'

let initialized = false

function ensureDatabase() {
  if (initialized) return
  alasql('CREATE TABLE transactions')
  alasql.tables.transactions.data = transactions.map((tx) => ({ ...tx }))
  initialized = true
}

export function runQuery(sql: string): QueryResult {
  ensureDatabase()

  const trimmed = sql.trim()
  if (!trimmed) {
    return { columns: [], rows: [], error: 'Write a SQL query first.' }
  }

  try {
    const raw = alasql(trimmed) as Record<string, unknown>[] | unknown
    if (!Array.isArray(raw)) {
      return { columns: ['result'], rows: [[raw]] }
    }

    if (raw.length === 0) {
      return { columns: [], rows: [] }
    }

    const columns = Object.keys(raw[0] as Record<string, unknown>)
    const rows = raw.map((row) => columns.map((col) => (row as Record<string, unknown>)[col]))
    return { columns, rows }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Query failed.'
    return { columns: [], rows: [], error: message }
  }
}

export function resetDatabase() {
  initialized = false
  ensureDatabase()
}
