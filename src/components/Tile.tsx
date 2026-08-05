import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import './Tile.css'

type TileProps = {
  title: string
  description?: string
  comingSoon?: boolean
  icon?: ReactNode
  to?: string
  actionLabel?: string
}

export function Tile({
  title,
  description,
  comingSoon = false,
  icon,
  to,
  actionLabel = 'Open module',
}: TileProps) {
  const navigate = useNavigate()

  function openModule() {
    if (to) navigate(to)
  }

  if (comingSoon || !to) {
    return (
      <article className="tile glass-card tile--soon">
        {comingSoon && <span className="tile-badge">Coming Soon</span>}
        <div className="tile-icon">{icon}</div>
        <h2 className="tile-title">{title}</h2>
        {description && <p className="tile-description">{description}</p>}
      </article>
    )
  }

  return (
    <article
      className="tile glass-card tile--active"
      onClick={openModule}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          openModule()
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Open ${title}`}
    >
      <div className="tile-icon">{icon}</div>
      <h2 className="tile-title">{title}</h2>
      {description && <p className="tile-description">{description}</p>}
      <span className="tile-action">
        {actionLabel}
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M7 4l6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </article>
  )
}
