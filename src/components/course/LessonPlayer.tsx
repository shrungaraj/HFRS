import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { onChainDataCourse } from '../../course/data/onChainCourse'
import { runQuery } from '../../course/sqlEngine'
import type { QueryResult } from '../../course/types'
import { Logo } from '../Logo'
import { WalletButton } from '../WalletButton'
import { ResultsTable } from './ResultsTable'
import { SchemaExplorer } from './SchemaExplorer'
import { SqlEditor } from './SqlEditor'
import './LessonPlayer.css'

const progressKey = (lessonId: string) => `chaincert-progress-${lessonId}`

function loadProgress(lessonId: string) {
  const raw = localStorage.getItem(progressKey(lessonId))
  return raw ? Number(raw) : 0
}

function saveProgress(lessonId: string, step: number) {
  localStorage.setItem(progressKey(lessonId), String(step))
}

export function LessonPlayer() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const lesson = onChainDataCourse.lessons.find((item) => item.id === lessonId)

  const initialStep = useMemo(() => {
    if (!lessonId || !lesson) return 0
    const saved = loadProgress(lessonId)
    return Math.min(saved, lesson.steps.length - 1)
  }, [lessonId, lesson])

  const [stepIndex, setStepIndex] = useState(initialStep)
  const [sql, setSql] = useState('')
  const [result, setResult] = useState<QueryResult | null>(null)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'hint'; text: string } | null>(
    null,
  )
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (!lesson?.available) return
    setSql(lesson.steps[stepIndex]?.starterSql ?? '')
    setResult(null)
    setFeedback(null)
    setCompleted(false)
  }, [lesson, stepIndex])

  if (!lesson || !lesson.available) {
    return (
      <div className="lesson-player">
        <p>Lesson not available.</p>
        <Link to={`/course/${onChainDataCourse.id}`}>Back to course</Link>
      </div>
    )
  }

  const activeLesson = lesson
  const step = activeLesson.steps[stepIndex]
  const isLastStep = stepIndex === activeLesson.steps.length - 1

  function resetStepState(nextSql: string) {
    setSql(nextSql)
    setResult(null)
    setFeedback(null)
    setCompleted(false)
  }

  function handleRun() {
    const queryResult = runQuery(sql)
    setResult(queryResult)
    setFeedback(null)
  }

  function handleCheck() {
    const queryResult = result ?? runQuery(sql)
    setResult(queryResult)

    const validation = step.validate(sql, queryResult)
    if (validation.passed) {
      setFeedback({ type: 'success', text: validation.message })
      setCompleted(true)
      if (lessonId) saveProgress(lessonId, stepIndex + 1)
    } else {
      setFeedback({ type: 'error', text: validation.message })
      setCompleted(false)
    }
  }

  function handleHint() {
    setFeedback({ type: 'hint', text: step.hint })
  }

  function handleNext() {
    if (isLastStep) {
      navigate(`/course/${onChainDataCourse.id}`)
      return
    }

    const nextStep = activeLesson.steps[stepIndex + 1]
    setStepIndex(stepIndex + 1)
    resetStepState(nextStep.starterSql)
  }

  function handleStepSelect(index: number) {
    if (index > stepIndex && !completed && index !== stepIndex) return
    const target = activeLesson.steps[index]
    setStepIndex(index)
    resetStepState(target.starterSql)
  }

  return (
    <div className="lesson-player">
      <header className="lesson-header glass-bar">
        <div className="lesson-header-left">
          <Logo />
          <Link className="lesson-back" to={`/course/${onChainDataCourse.id}`}>
            ← Course
          </Link>
        </div>
        <WalletButton />
      </header>

      <div className="lesson-progress">
        {activeLesson.steps.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`progress-dot ${index === stepIndex ? 'progress-dot--active' : ''} ${index < stepIndex ? 'progress-dot--done' : ''}`}
            onClick={() => handleStepSelect(index)}
            aria-label={`Step ${index + 1}: ${item.concept}`}
          />
        ))}
      </div>

      <main className="lesson-main">
        <section className="lesson-prompt glass-card">
          <span className="lesson-concept">{step.concept}</span>
          <h1>{step.prompt}</h1>
          <div className="lesson-prompt-actions">
            <button type="button" className="btn-hint" onClick={handleHint}>
              Hint
            </button>
          </div>
          {feedback && (
            <p className={`lesson-feedback lesson-feedback--${feedback.type}`}>{feedback.text}</p>
          )}
          {completed && (
            <button type="button" className="btn-next" onClick={handleNext}>
              {isLastStep ? 'Finish lesson' : 'Next step →'}
            </button>
          )}
        </section>

        <section className="lesson-workspace">
          <SchemaExplorer />
          <SqlEditor
            value={sql}
            onChange={setSql}
            onRun={handleRun}
            onCheck={handleCheck}
            note={step.editorNote}
          />
          <ResultsTable result={result} />
        </section>
      </main>
    </div>
  )
}
