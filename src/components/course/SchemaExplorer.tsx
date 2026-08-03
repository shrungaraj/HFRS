import { courseTables } from '../../course/data/smartMoney'
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
          <div className="schema-columns">
            {table.columns.map((col) => (
              <button key={col} type="button" className="schema-column" title={`Column: ${col}`}>
                {col}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
