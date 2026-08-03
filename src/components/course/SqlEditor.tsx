import { useEffect, useRef } from 'react'
import './SqlEditor.css'

type SqlEditorProps = {
  value: string
  onChange: (value: string) => void
  onRun: () => void
  onCheck: () => void
  note?: string
  disabled?: boolean
}

export function SqlEditor({ value, onChange, onRun, onCheck, note, disabled }: SqlEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault()
      onRun()
    }
  }

  return (
    <div className="sql-editor glass-card">
      <div className="sql-editor-toolbar">
        <span className="sql-editor-label">SQL</span>
        <div className="sql-editor-actions">
          <button type="button" className="btn-secondary" onClick={onRun} disabled={disabled}>
            Run
          </button>
          <button type="button" className="btn-primary" onClick={onCheck} disabled={disabled}>
            Check
          </button>
        </div>
      </div>
      <textarea
        ref={textareaRef}
        className="sql-editor-input"
        value={value}
        spellCheck={false}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="SQL query editor"
      />
      <p className="sql-editor-shortcut">
        {note ? note : 'Ctrl + Enter to run'}
      </p>
    </div>
  )
}
