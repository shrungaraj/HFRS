import { courseTables } from '../../course/data/dexTrades'
import './SchemaExplorer.css'

export function SchemaExplorer() {
  return (
    <div className="schema-explorer-stack">
      {courseTables.map((table) => (
        <div key={table.name} className="schema-explorer glass-card">
          <div className="schema-explorer-header">
            <span className="schema-table-name">{table.name}</span>
            <span className="schema-table-meta">{table.columns.length} columns</span>
          </div>
          {'partitionKeys' in table && (
            <p className="schema-partition-note">
              Partition keys:{' '}
              {table.partitionKeys.map((k) => (
                <code key={k}>{k}</code>
              ))}{' '}
              — always filter these on Dune
            </p>
          )}
          <div className="schema-columns">
            {table.columns.map((col) => (
              <button
                key={col}
                type="button"
                className={`schema-column ${
                  'partitionKeys' in table &&
                  (table.partitionKeys as readonly string[]).includes(col)
                    ? 'schema-column--partition'
                    : ''
                }`}
                title={`Column: ${col}`}
              >
                {col}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
