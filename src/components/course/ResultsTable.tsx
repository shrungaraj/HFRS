import type { QueryResult } from '../../course/types'
import './ResultsTable.css'

type ResultsTableProps = {
  result: QueryResult | null
}

export function ResultsTable({ result }: ResultsTableProps) {
  if (!result) {
    return (
      <div className="results-table glass-card results-table--empty">
        <p>Run your query to see results here.</p>
      </div>
    )
  }

  if (result.error) {
    return (
      <div className="results-table glass-card results-table--error">
        <p>{result.error}</p>
      </div>
    )
  }

  if (result.rows.length === 0) {
    return (
      <div className="results-table glass-card results-table--empty">
        <p>Query returned 0 rows.</p>
      </div>
    )
  }

  return (
    <div className="results-table glass-card">
      <div className="results-table-header">
        <span>{result.rows.length} row{result.rows.length === 1 ? '' : 's'}</span>
      </div>
      <div className="results-table-scroll">
        <table>
          <thead>
            <tr>
              {result.columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{String(cell ?? '')}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
