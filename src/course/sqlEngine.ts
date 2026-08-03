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

function friendlySqlError(sql: string, message: string): string {
  const trimmed = sql.trim()

  if (/limit\s*$/i.test(trimmed) || /expecting 'NUMBER'/i.test(message)) {
    return 'Add a number after LIMIT — for this step, type 3.'
  }

  if (/select\s*$/i.test(trimmed) || /select\s+\n\s*from/i.test(trimmed)) {
    return 'Add column names after SELECT, or use * to select all columns.'
  }

  if (/where\s*$/i.test(trimmed)) {
    return 'Add a condition after WHERE — e.g. amount > 1'
  }

  if (/,\s*$/m.test(trimmed) || message.includes('Parse error')) {
    return 'Your query looks incomplete. Finish each line, then Run again.'
  }

  return message
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
    return { columns: [], rows: [], error: friendlySqlError(trimmed, message) }
  }
}

export function resetDatabase() {
  initialized = false
  ensureDatabase()
}
