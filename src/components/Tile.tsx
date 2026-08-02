import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import './Tile.css'

type TileProps = {
  title: string
  description?: string
  comingSoon?: boolean
  icon?: ReactNode
  to?: string
}

function TileContent({
  title,
  description,
  comingSoon,
  icon,
}: Pick<TileProps, 'title' | 'description' | 'comingSoon' | 'icon'>) {
  return (
    <>
      {comingSoon && <span className="tile-badge">Coming Soon</span>}

      <div className="tile-icon">{icon}</div>

      <h2 className="tile-title">{title}</h2>

      {description && <p className="tile-description">{description}</p>}

      {!comingSoon && (
        <span className="tile-action">
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
        </span>
      )}
    </>
  )
}

export function Tile({ title, description, comingSoon = false, icon, to }: TileProps) {
  if (comingSoon || !to) {
    return (
      <article className="tile glass-card tile--soon">
        <TileContent
          title={title}
          description={description}
          comingSoon={comingSoon}
          icon={icon}
        />
      </article>
    )
  }

  return (
    <Link to={to} className="tile glass-card tile--active tile-link">
      <TileContent title={title} description={description} icon={icon} />
    </Link>
  )
}
