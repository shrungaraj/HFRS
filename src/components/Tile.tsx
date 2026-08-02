import type { ReactNode } from 'react'
import './Tile.css'

type TileProps = {
  title: string
  description?: string
  comingSoon?: boolean
  icon?: ReactNode
}

export function Tile({ title, description, comingSoon = false, icon }: TileProps) {
  return (
    <article className={`tile glass-card ${comingSoon ? 'tile--soon' : 'tile--active'}`}>
      {comingSoon && <span className="tile-badge">Coming Soon</span>}

      <div className="tile-icon">{icon}</div>

      <h2 className="tile-title">{title}</h2>

      {description && <p className="tile-description">{description}</p>}

      {!comingSoon && (
        <button type="button" className="tile-action">
          Open module
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M7 4l6 6-6 6"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </article>
  )
}
