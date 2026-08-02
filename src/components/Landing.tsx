import { Logo } from './Logo'
import { WalletButton } from './WalletButton'
import './Landing.css'

export function Landing() {
  return (
    <div className="landing">
      <header className="landing-header">
        <Logo />
      </header>

      <main className="landing-main">
        <WalletButton />
      </main>
    </div>
  )
}
