declare module 'alasql' {
  const alasql: {
    (sql: string, params?: unknown[]): unknown
    tables: Record<string, { data: unknown[] }>
  }
  export default alasql
}
