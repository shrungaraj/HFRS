import { useNavigate } from 'react-router-dom'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import './WalletButton.css'

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

export function WalletButton() {
  const navigate = useNavigate()
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect({
    mutation: {
      onSuccess: () => {
        navigate('/', { replace: true })
      },
    },
  })
  const { disconnect } = useDisconnect()

  if (isConnected && address) {
    return (
      <div className="wallet-actions">
        <span className="wallet-address glass-pill">{truncateAddress(address)}</span>
        <button type="button" className="btn-glass btn-disconnect" onClick={() => disconnect()}>
          Disconnect
        </button>
      </div>
    )
  }

  const connector = connectors[0]

  return (
    <button
      type="button"
      className="btn-glass btn-connect"
      disabled={!connector || isPending}
      onClick={() => connector && connect({ connector })}
    >
      <svg className="wallet-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M19 7H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        <path
          d="M17 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        <circle cx="17" cy="14" r="1.5" fill="currentColor" />
      </svg>
      {isPending ? 'Connecting…' : 'Login with Web3 Wallet'}
    </button>
  )
}
