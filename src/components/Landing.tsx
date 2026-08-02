import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { Logo } from './Logo'
import { WalletButton } from './WalletButton'
import './Landing.css'

export function Landing() {
  const navigate = useNavigate()
  const { isConnected } = useAccount()

  useEffect(() => {
    if (isConnected) {
      navigate('/dashboard', { replace: true })
    }
  }, [isConnected, navigate])

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
