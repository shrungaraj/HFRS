import { Link, useParams } from 'react-router-dom'
import { getCourseById } from '../../course/data/courses'
import { getPathById } from '../../course/data/learningPaths'
import { Logo } from '../Logo'
import { WalletButton } from '../WalletButton'
import './PathPage.css'

function courseProgress(courseId: string) {
  let completedSteps = 0
  let totalSteps = 0

  const course = getCourseById(courseId)
  if (!course) return 0

  for (const lesson of course.lessons) {
    if (!lesson.available) continue
    totalSteps += lesson.steps.length
    const saved = Number(localStorage.getItem(`chaincert-progress-${lesson.id}`) ?? 0)
    completedSteps += Math.min(saved, lesson.steps.length)
  }

  if (totalSteps === 0) return 0
  return Math.min(100, Math.round((completedSteps / totalSteps) * 100))
}

export function PathPage() {
  const { pathId } = useParams()
  const path = pathId ? getPathById(pathId) : undefined

  if (!path) {
    return (
      <div className="path-page">
        <p>Learning path not found.</p>
        <Link to="/">Back to dashboard</Link>
      </div>
    )
  }

  return (
    <div className="path-page">
      <header className="path-header glass-bar">
        <div className="path-header-left">
          <Logo />
          <Link className="path-back" to="/">
            ← Dashboard
          </Link>
        </div>
        <WalletButton />
      </header>

      <main className="path-main">
        <div className="path-hero">
          <span className="path-label">Learning Path</span>
          <h1>{path.title}</h1>
          <p>{path.description}</p>
        </div>

        <div className="path-course-list">
          {path.courses.map((entry, index) => {
            const course = getCourseById(entry.courseId)
            const available = entry.available !== false && Boolean(course)
            const progress = course ? courseProgress(course.id) : 0
            const isComplete = available && progress === 100

            return (
              <article
                key={entry.courseId}
                className={`path-course-card glass-card ${!available ? 'path-course-card--locked' : ''}`}
              >
                <div className="path-course-top">
                  <span className="path-course-number">Module {index + 1}</span>
                  {!available && <span className="path-course-lock">Coming Soon</span>}
                  {isComplete && <span className="path-course-complete">Complete</span>}
                </div>

                <h2>{course?.title ?? `Module ${index + 1}`}</h2>
                <p className="path-course-description">
                  {course?.description ?? 'Unlocks in a future release.'}
                </p>

                {available && course ? (
                  <>
                    <div className="path-course-progress-bar">
                      <div className="path-course-progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <Link className="path-course-start" to={`/course/${course.id}`}>
                      {progress > 0 && progress < 100 ? 'Continue module' : 'Start module'} →
                    </Link>
                  </>
                ) : (
                  <span className="path-course-locked-label">Unlocks in a future release</span>
                )}
              </article>
            )
          })}
        </div>
      </main>
    </div>
  )
}
