import { learningPaths } from '../course/data/learningPaths'
import { Logo } from './Logo'
import { WalletButton } from './WalletButton'
import { Tile } from './Tile'
import './Dashboard.css'

const AnalystPathIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4 18V8M9 18V5M14 18v-7M19 18v-4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M3 18h18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

const PlaceholderIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect
      x="5"
      y="5"
      width="14"
      height="14"
      rx="3"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path d="M9 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export function Dashboard() {
  return (
    <div className="dashboard">
      <header className="dashboard-header glass-bar">
        <Logo />
        <WalletButton />
      </header>

      <main className="dashboard-main">
        <div className="dashboard-intro">
          <h1>Learning Paths</h1>
          <p>Choose a path to begin your on-chain certification journey.</p>
        </div>

        <div className="tile-grid">
          {learningPaths.map((path) => (
            <Tile
              key={path.id}
              title={path.title}
              description={path.description}
              icon={<AnalystPathIcon />}
              to={`/path/${path.id}`}
              actionLabel="Start path"
            />
          ))}
          <Tile title="Path 2" comingSoon icon={<PlaceholderIcon />} />
          <Tile title="Path 3" comingSoon icon={<PlaceholderIcon />} />
          <Tile title="Path 4" comingSoon icon={<PlaceholderIcon />} />
        </div>
      </main>
    </div>
  )
}
