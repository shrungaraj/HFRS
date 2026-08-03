import { transactionColumns } from '../../course/data/transactions'
import './SchemaExplorer.css'

export function SchemaExplorer() {
  return (
    <div className="schema-explorer glass-card">
      <div className="schema-explorer-header">
        <span className="schema-table-name">transactions</span>
        <span className="schema-table-meta">{transactionColumns.length} columns</span>
      </div>
      <div className="schema-columns">
        {transactionColumns.map((col) => (
          <button key={col} type="button" className="schema-column" title={`Column: ${col}`}>
            {col}
          </button>
        ))}
      </div>
    </div>
  )
}
