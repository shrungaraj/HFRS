import { useAccount } from 'wagmi'
import { Landing } from './components/Landing'
import { Dashboard } from './components/Dashboard'

function App() {
  const { isConnected } = useAccount()

  return isConnected ? <Dashboard /> : <Landing />
}

export default App
