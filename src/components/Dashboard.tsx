import { onChainDataCourse } from '../course/data/onChainCourse'
import { Logo } from './Logo'
import { WalletButton } from './WalletButton'
import { Tile } from './Tile'
import './Dashboard.css'

const DataAnalysisIcon = () => (
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
          <h1>Learning Modules</h1>
          <p>Select a module to begin your on-chain certification journey.</p>
        </div>

        <div className="tile-grid">
          <Tile
            title="On chain Data analysis"
            description="Find top altcoins by 4h volume — exclude stables and blue chips."
            icon={<DataAnalysisIcon />}
            to={`/course/${onChainDataCourse.id}`}
          />
          <Tile title="Module 2" comingSoon icon={<PlaceholderIcon />} />
          <Tile title="Module 3" comingSoon icon={<PlaceholderIcon />} />
          <Tile title="Module 4" comingSoon icon={<PlaceholderIcon />} />
        </div>
      </main>
    </div>
  )
}
