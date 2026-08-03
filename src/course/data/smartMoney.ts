export type Trade = {
  trade_id: string
  wallet_address: string
  amount_eth: number
  token: string
  trade_date: string
}

export type WalletLabel = {
  wallet_address: string
  label: string
}

export const trades: Trade[] = [
  // Smart money candidate A — frequent, meaningful size, unlabeled
  { trade_id: 'T001', wallet_address: '0x7a3f8c2e1b9045d6a8c3f21e9b7d4a2c1f8e903', amount_eth: 2.4, token: 'ETH', trade_date: '2026-01-10' },
  { trade_id: 'T002', wallet_address: '0x7a3f8c2e1b9045d6a8c3f21e9b7d4a2c1f8e903', amount_eth: 3.1, token: 'ARB', trade_date: '2026-01-11' },
  { trade_id: 'T003', wallet_address: '0x7a3f8c2e1b9045d6a8c3f21e9b7d4a2c1f8e903', amount_eth: 1.8, token: 'OP', trade_date: '2026-01-12' },
  { trade_id: 'T004', wallet_address: '0x7a3f8c2e1b9045d6a8c3f21e9b7d4a2c1f8e903', amount_eth: 2.9, token: 'ETH', trade_date: '2026-01-13' },
  { trade_id: 'T005', wallet_address: '0x7a3f8c2e1b9045d6a8c3f21e9b7d4a2c1f8e903', amount_eth: 4.2, token: 'LINK', trade_date: '2026-01-14' },
  { trade_id: 'T006', wallet_address: '0x7a3f8c2e1b9045d6a8c3f21e9b7d4a2c1f8e903', amount_eth: 2.1, token: 'ETH', trade_date: '2026-01-15' },

  // Smart money candidate B — frequent, meaningful size, unlabeled
  { trade_id: 'T007', wallet_address: '0x4b9e2d1c8f7036a5b2e9d4c7f1a8b3e6d2c9041', amount_eth: 1.9, token: 'ETH', trade_date: '2026-01-10' },
  { trade_id: 'T008', wallet_address: '0x4b9e2d1c8f7036a5b2e9d4c7f1a8b3e6d2c9041', amount_eth: 2.6, token: 'UNI', trade_date: '2026-01-11' },
  { trade_id: 'T009', wallet_address: '0x4b9e2d1c8f7036a5b2e9d4c7f1a8b3e6d2c9041', amount_eth: 3.4, token: 'ETH', trade_date: '2026-01-12' },
  { trade_id: 'T010', wallet_address: '0x4b9e2d1c8f7036a5b2e9d4c7f1a8b3e6d2c9041', amount_eth: 2.2, token: 'AAVE', trade_date: '2026-01-13' },
  { trade_id: 'T011', wallet_address: '0x4b9e2d1c8f7036a5b2e9d4c7f1a8b3e6d2c9041', amount_eth: 1.7, token: 'ETH', trade_date: '2026-01-14' },

  // Exchange — high frequency + size but labeled exchange
  { trade_id: 'T012', wallet_address: '0x28C6c06298bbf67bdc9b889CdfBc4a1581637c4', amount_eth: 12.0, token: 'ETH', trade_date: '2026-01-10' },
  { trade_id: 'T013', wallet_address: '0x28C6c06298bbf67bdc9b889CdfBc4a1581637c4', amount_eth: 8.5, token: 'ETH', trade_date: '2026-01-10' },
  { trade_id: 'T014', wallet_address: '0x28C6c06298bbf67bdc9b889CdfBc4a1581637c4', amount_eth: 15.2, token: 'ETH', trade_date: '2026-01-11' },
  { trade_id: 'T015', wallet_address: '0x28C6c06298bbf67bdc9b889CdfBc4a1581637c4', amount_eth: 9.8, token: 'ETH', trade_date: '2026-01-11' },
  { trade_id: 'T016', wallet_address: '0x28C6c06298bbf67bdc9b889CdfBc4a1581637c4', amount_eth: 11.1, token: 'ETH', trade_date: '2026-01-12' },
  { trade_id: 'T017', wallet_address: '0x28C6c06298bbf67bdc9b889CdfBc4a1581637c4', amount_eth: 7.4, token: 'ETH', trade_date: '2026-01-12' },
  { trade_id: 'T018', wallet_address: '0x28C6c06298bbf67bdc9b889CdfBc4a1581637c4', amount_eth: 13.6, token: 'ETH', trade_date: '2026-01-13' },

  // Bot — frequent but tiny size
  { trade_id: 'T019', wallet_address: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12', amount_eth: 0.02, token: 'ETH', trade_date: '2026-01-10' },
  { trade_id: 'T020', wallet_address: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12', amount_eth: 0.03, token: 'ETH', trade_date: '2026-01-10' },
  { trade_id: 'T021', wallet_address: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12', amount_eth: 0.01, token: 'ETH', trade_date: '2026-01-11' },
  { trade_id: 'T022', wallet_address: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12', amount_eth: 0.04, token: 'ETH', trade_date: '2026-01-11' },
  { trade_id: 'T023', wallet_address: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12', amount_eth: 0.02, token: 'ETH', trade_date: '2026-01-12' },
  { trade_id: 'T024', wallet_address: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12', amount_eth: 0.03, token: 'ETH', trade_date: '2026-01-12' },
  { trade_id: 'T025', wallet_address: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12', amount_eth: 0.01, token: 'ETH', trade_date: '2026-01-13' },
  { trade_id: 'T026', wallet_address: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12', amount_eth: 0.02, token: 'ETH', trade_date: '2026-01-13' },

  // Retail — meaningful size but infrequent (only 2 trades)
  { trade_id: 'T027', wallet_address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0', amount_eth: 2.5, token: 'ETH', trade_date: '2026-01-14' },
  { trade_id: 'T028', wallet_address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0', amount_eth: 3.0, token: 'ETH', trade_date: '2026-01-15' },

  // Another exchange
  { trade_id: 'T029', wallet_address: '0xBE0eB53F46cd790Cd13851d2EF745b8E1a702b10', amount_eth: 20.0, token: 'ETH', trade_date: '2026-01-10' },
  { trade_id: 'T030', wallet_address: '0xBE0eB53F46cd790Cd13851d2EF745b8E1a702b10', amount_eth: 18.5, token: 'ETH', trade_date: '2026-01-11' },
  { trade_id: 'T031', wallet_address: '0xBE0eB53F46cd790Cd13851d2EF745b8E1a702b10', amount_eth: 22.1, token: 'ETH', trade_date: '2026-01-12' },
  { trade_id: 'T032', wallet_address: '0xBE0eB53F46cd790Cd13851d2EF745b8E1a702b10', amount_eth: 16.8, token: 'ETH', trade_date: '2026-01-13' },
  { trade_id: 'T033', wallet_address: '0xBE0eB53F46cd790Cd13851d2EF745b8E1a702b10', amount_eth: 19.4, token: 'ETH', trade_date: '2026-01-14' },
]

export const walletLabels: WalletLabel[] = [
  { wallet_address: '0x28C6c06298bbf67bdc9b889CdfBc4a1581637c4', label: 'exchange' },
  { wallet_address: '0xBE0eB53F46cd790Cd13851d2EF745b8E1a702b10', label: 'exchange' },
  { wallet_address: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12', label: 'bot' },
]

export const tradeColumns = ['trade_id', 'wallet_address', 'amount_eth', 'token', 'trade_date'] as const
export const walletLabelColumns = ['wallet_address', 'label'] as const

export const SMART_MONEY_MIN_TRADES = 5
export const SMART_MONEY_MIN_SIZE_ETH = 1.5

export const smartMoneyWallets = [
  '0x7a3f8c2e1b9045d6a8c3f21e9b7d4a2c1f8e903',
  '0x4b9e2d1c8f7036a5b2e9d4c7f1a8b3e6d2c9041',
]

export const courseTables = [
  { name: 'trades', columns: [...tradeColumns] },
  { name: 'wallet_labels', columns: [...walletLabelColumns] },
] as const
