import { Link, useParams } from 'react-router-dom'
import { onChainDataCourse } from '../../course/data/onChainCourse'
import { Logo } from '../Logo'
import { WalletButton } from '../WalletButton'
import './CoursePage.css'

function lessonProgress(lessonId: string, totalSteps: number) {
  const saved = Number(localStorage.getItem(`chaincert-progress-${lessonId}`) ?? 0)
  if (totalSteps === 0) return 0
  return Math.min(100, Math.round((saved / totalSteps) * 100))
}

export function CoursePage() {
  const { courseId } = useParams()
  const course = courseId === onChainDataCourse.id ? onChainDataCourse : null

  if (!course) {
    return (
      <div className="course-page">
        <p>Course not found.</p>
        <Link to="/">Back to dashboard</Link>
      </div>
    )
  }

  return (
    <div className="course-page">
      <header className="course-header glass-bar">
        <div className="course-header-left">
          <Logo />
          <Link className="course-back" to="/">
            ← Dashboard
          </Link>
        </div>
        <WalletButton />
      </header>

      <main className="course-main">
        <div className="course-hero">
          <h1>{course.title}</h1>
          <p>Dune SQL on dex.trades — same queries you'd run on dune.com</p>
        </div>

        <div className="lesson-list">
          {course.lessons.map((lesson, index) => {
            const progress = lessonProgress(lesson.id, lesson.steps.length)
            const isComplete = lesson.available && progress === 100

            return (
              <article
                key={lesson.id}
                className={`lesson-card glass-card ${!lesson.available ? 'lesson-card--locked' : ''}`}
              >
                <div className="lesson-card-top">
                  <span className="lesson-number">Lesson {index + 1}</span>
                  {!lesson.available && <span className="lesson-lock">Coming Soon</span>}
                  {isComplete && <span className="lesson-complete">Complete</span>}
                </div>

                <h2>{lesson.title}</h2>
                <p className="lesson-objective">{lesson.objective}</p>

                <div className="lesson-concepts">
                  {lesson.concepts.map((concept) => (
                    <span key={concept} className="concept-chip">
                      {concept}
                    </span>
                  ))}
                </div>

                {lesson.available ? (
                  <>
                    <div className="lesson-progress-bar">
                      <div className="lesson-progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <Link className="lesson-start" to={`/course/${course.id}/lesson/${lesson.id}`}>
                      {progress > 0 && progress < 100 ? 'Continue' : 'Start lesson'} →
                    </Link>
                  </>
                ) : (
                  <span className="lesson-locked-label">Unlocks in a future release</span>
                )}
              </article>
            )
          })}
        </div>
      </main>
    </div>
  )
}
