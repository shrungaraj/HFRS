import { useAccount } from 'wagmi'
import { Dashboard } from './Dashboard'
import { Landing } from './Landing'

export function Home() {
  const { isConnected, status } = useAccount()

  if (status === 'connecting' || status === 'reconnecting') {
    return (
      <div className="route-loading">
        <p>Connecting wallet…</p>
      </div>
    )
  }

  return isConnected ? <Dashboard /> : <Landing />
}
