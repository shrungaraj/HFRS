export type Transaction = {
  tx_hash: string
  block_number: number
  sender: string
  receiver: string
  amount_eth: number
  tx_date: string
}

export const transactions: Transaction[] = [
  {
    tx_hash: '0x8f3a91c4e2b706d1a8c3f912ab44e01c77d9a3f5',
    block_number: 19238401,
    sender: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
    receiver: '0x28C6c06298bbf67bdc9b889CdfBc4a1581637c4',
    amount_eth: 0.45,
    tx_date: '2026-01-14',
  },
  {
    tx_hash: '0x2c19f8a03d51e774b906c2a18f4d9038e1b72c4a',
    block_number: 19238412,
    sender: '0xAb5801a7D398351b8bE11C439e07EE5e622aEd6',
    receiver: '0x47ac0Fb4F2D84898e4D9E7fE4c4030C0f5d2cB1',
    amount_eth: 1.2,
    tx_date: '2026-01-14',
  },
  {
    tx_hash: '0x5e71b409f2d9a8c14b6037d91e0f82a6c3b948d2',
    block_number: 19240155,
    sender: '0x1f9840a85d8a58b31c67ea9ccddbf63a50c6c66',
    receiver: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    amount_eth: 2.5,
    tx_date: '2026-01-15',
  },
  {
    tx_hash: '0x9a4e2f1c8b7036d5a0e91f4c2b8d7e6f3a1c905',
    block_number: 19240168,
    sender: '0xBE0eB53F46cd790Cd13851d2EF745b8E1a702b10',
    receiver: '0x3DdfA8e07822dC6a8225F2732Fb934C397dd5bEc',
    amount_eth: 0.8,
    tx_date: '2026-01-15',
  },
  {
    tx_hash: '0xb3c8d7e6f5a4928173645a0b9c8d7e6f5a49382',
    block_number: 19240190,
    sender: '0x220866B1A3aF3b8d0b4cF4E7C4fD4F4E7C4fD4F',
    receiver: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
    amount_eth: 3.1,
    tx_date: '2026-01-15',
  },
  {
    tx_hash: '0xc4d9e8f7a6b5939284756b1a0c9d8e7f6a59493',
    block_number: 19241822,
    sender: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
    receiver: '0xAb5801a7D398351b8bE11C439e07EE5e622aEd6',
    amount_eth: 1.75,
    tx_date: '2026-01-16',
  },
  {
    tx_hash: '0xd5e0f9a8b7c6040395867c2b1d0e9f8a7b60504',
    block_number: 19241830,
    sender: '0x28C6c06298bbf67bdc9b889CdfBc4a1581637c4',
    receiver: '0x1f9840a85d8a58b31c67ea9ccddbf63a50c6c66',
    amount_eth: 0.25,
    tx_date: '2026-01-16',
  },
  {
    tx_hash: '0xe6f1a0b9c8d7151406978d3c2e1f0a9b8c71615',
    block_number: 19241844,
    sender: '0x47ac0Fb4F2D84898e4D9E7fE4c4030C0f5d2cB1',
    receiver: '0xBE0eB53F46cd790Cd13851d2EF745b8E1a702b10',
    amount_eth: 4.0,
    tx_date: '2026-01-16',
  },
  {
    tx_hash: '0xf7a2b1c0d9e8262517089e4d3f2a1b0c9d82726',
    block_number: 19241851,
    sender: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    receiver: '0x3DdfA8e07822dC6a8225F2732Fb934C397dd5bEc',
    amount_eth: 2.8,
    tx_date: '2026-01-16',
  },
  {
    tx_hash: '0xa8b3c2d1e0f9373628190f5e4a3b2c1d0e94837',
    block_number: 19243501,
    sender: '0x3DdfA8e07822dC6a8225F2732Fb934C397dd5bEc',
    receiver: '0x220866B1A3aF3b8d0b4cF4E7C4fD4F4E7C4fD4F',
    amount_eth: 1.1,
    tx_date: '2026-01-17',
  },
  {
    tx_hash: '0xb9c4d3e2f1a04847392a1a6f5b4c3d2e1f05948',
    block_number: 19243518,
    sender: '0xBE0eB53F46cd790Cd13851d2EF745b8E1a702b10',
    receiver: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
    amount_eth: 0.6,
    tx_date: '2026-01-17',
  },
  {
    tx_hash: '0xc0d5e4f3a2b15958403b2a7a6c5d4e3f2a16059',
    block_number: 19245200,
    sender: '0x1f9840a85d8a58b31c67ea9ccddbf63a50c6c66',
    receiver: '0x28C6c06298bbf67bdc9b889CdfBc4a1581637c4',
    amount_eth: 1.5,
    tx_date: '2026-01-18',
  },
]

export const transactionColumns = [
  'tx_hash',
  'block_number',
  'sender',
  'receiver',
  'amount_eth',
  'tx_date',
] as const

export const busiestDay = '2026-01-16'
export const busiestDayCount = 4
