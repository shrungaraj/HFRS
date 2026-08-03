import alasql from 'alasql'
import { dexTrades } from './data/dexTrades'
import type { QueryResult } from './types'

const INTERNAL_TABLE = 'dex_trades'

let initialized = false

function ensureDatabase() {
  if (initialized) return
  alasql(`CREATE TABLE ${INTERNAL_TABLE}`)
  alasql.tables[INTERNAL_TABLE].data = dexTrades.map((t) => ({ ...t }))
  initialized = true
}

/** Adapt Dune-style SQL for the in-browser engine. */
export function preprocessSql(sql: string): string {
  return sql
    .replace(/\bdex\.trades\b/gi, INTERNAL_TABLE)
    .replace(/TIMESTAMP\s+'([^']+)'/gi, "'$1'")
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

  const executable = preprocessSql(trimmed)

  try {
    const raw = alasql(executable) as Record<string, unknown>[] | unknown
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
