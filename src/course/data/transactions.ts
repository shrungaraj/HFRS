export type Transaction = {
  tx_hash: string
  sender: string
  receiver: string
  amount: number
  date: string
}

export const transactions: Transaction[] = [
  {
    tx_hash: '0xa1b2c3',
    sender: '0xAlice',
    receiver: '0xBob',
    amount: 0.45,
    date: '2026-01-14',
  },
  {
    tx_hash: '0xd4e5f6',
    sender: '0xCarol',
    receiver: '0xDave',
    amount: 1.2,
    date: '2026-01-14',
  },
  {
    tx_hash: '0x789abc',
    sender: '0xEve',
    receiver: '0xFrank',
    amount: 2.5,
    date: '2026-01-15',
  },
  {
    tx_hash: '0xdef012',
    sender: '0xGrace',
    receiver: '0xHeidi',
    amount: 0.8,
    date: '2026-01-15',
  },
  {
    tx_hash: '0x345678',
    sender: '0xIvan',
    receiver: '0xJudy',
    amount: 3.1,
    date: '2026-01-15',
  },
  {
    tx_hash: '0x9abcde',
    sender: '0xAlice',
    receiver: '0xCarol',
    amount: 1.75,
    date: '2026-01-16',
  },
  {
    tx_hash: '0xfedcba',
    sender: '0xBob',
    receiver: '0xEve',
    amount: 0.25,
    date: '2026-01-16',
  },
  {
    tx_hash: '0x112233',
    sender: '0xDave',
    receiver: '0xGrace',
    amount: 4.0,
    date: '2026-01-16',
  },
  {
    tx_hash: '0x445566',
    sender: '0xFrank',
    receiver: '0xIvan',
    amount: 1.1,
    date: '2026-01-17',
  },
  {
    tx_hash: '0x778899',
    sender: '0xHeidi',
    receiver: '0xJudy',
    amount: 0.6,
    date: '2026-01-17',
  },
  {
    tx_hash: '0xaabbcc',
    sender: '0xCarol',
    receiver: '0xAlice',
    amount: 2.2,
    date: '2026-01-17',
  },
  {
    tx_hash: '0xddeeff',
    sender: '0xEve',
    receiver: '0xBob',
    amount: 1.5,
    date: '2026-01-18',
  },
]

export const transactionColumns = ['tx_hash', 'sender', 'receiver', 'amount', 'date'] as const
