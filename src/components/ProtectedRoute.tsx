import { Navigate } from 'react-router-dom'
import { useAccount } from 'wagmi'

type ProtectedRouteProps = {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isConnected, status } = useAccount()

  if (status === 'connecting' || status === 'reconnecting') {
    return (
      <div className="route-loading">
        <p>Connecting wallet…</p>
      </div>
    )
  }

  if (!isConnected) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

type PublicOnlyRouteProps = {
  children: React.ReactNode
}

export function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { isConnected, status } = useAccount()

  if (status === 'connecting' || status === 'reconnecting') {
    return (
      <div className="route-loading">
        <p>Connecting wallet…</p>
      </div>
    )
  }

  if (isConnected) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
