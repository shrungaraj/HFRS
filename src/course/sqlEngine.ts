import alasql from 'alasql'
import { swaps } from './data/volumeSwaps'
import type { QueryResult } from './types'

let initialized = false

function ensureDatabase() {
  if (initialized) return
  alasql('CREATE TABLE swaps')
  alasql.tables.swaps.data = swaps.map((s) => ({ ...s }))
  initialized = true
}

function friendlySqlError(sql: string, message: string): string {
  const trimmed = sql.trim()

  if (/limit\s*$/i.test(trimmed) || /expecting 'NUMBER'/i.test(message)) {
    return 'Add a number after LIMIT.'
  }

  if (/where\s*$/i.test(trimmed)) {
    return 'Add a condition after WHERE.'
  }

  if (/not in\s*\(\s*\)/i.test(trimmed) || /not in\s*$/i.test(trimmed)) {
    return 'List tokens to exclude inside NOT IN (…).'
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
