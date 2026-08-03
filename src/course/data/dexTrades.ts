export type DexTrade = {
  trade_id: string
  token_bought_symbol: string
  amount_usd: number
  block_time: string
}

export const TABLE_NAME = 'dex.trades'

/** Dataset anchor — all "last 4 hours" filters use this window. */
export const WINDOW_START = '2026-01-18 10:00:00'
export const WINDOW_END = '2026-01-18 14:00:00'

export const EXCLUDED_TOKENS = ['USDC', 'USDT', 'BTC', 'ETH', 'XRP', 'SOL'] as const

export const CAPSTONE_LIMIT = 10

export const dexTrades: DexTrade[] = [
  // Outside window
  { trade_id: 'T001', token_bought_symbol: 'PEPE', amount_usd: 9_000_000, block_time: '2026-01-18 08:30:00' },
  { trade_id: 'T002', token_bought_symbol: 'ETH', amount_usd: 8_000_000, block_time: '2026-01-18 09:15:00' },

  // Inside window — majors (excluded)
  { trade_id: 'T003', token_bought_symbol: 'USDC', amount_usd: 5_200_000, block_time: '2026-01-18 10:15:00' },
  { trade_id: 'T004', token_bought_symbol: 'USDT', amount_usd: 4_800_000, block_time: '2026-01-18 11:00:00' },
  { trade_id: 'T005', token_bought_symbol: 'ETH', amount_usd: 3_400_000, block_time: '2026-01-18 12:30:00' },
  { trade_id: 'T006', token_bought_symbol: 'BTC', amount_usd: 2_900_000, block_time: '2026-01-18 11:45:00' },
  { trade_id: 'T007', token_bought_symbol: 'SOL', amount_usd: 1_750_000, block_time: '2026-01-18 13:00:00' },
  { trade_id: 'T008', token_bought_symbol: 'XRP', amount_usd: 1_300_000, block_time: '2026-01-18 13:30:00' },

  // Inside window — altcoins
  { trade_id: 'T009', token_bought_symbol: 'PEPE', amount_usd: 920_000, block_time: '2026-01-18 13:15:00' },
  { trade_id: 'T010', token_bought_symbol: 'PEPE', amount_usd: 480_000, block_time: '2026-01-18 10:45:00' },
  { trade_id: 'T011', token_bought_symbol: 'WIF', amount_usd: 710_000, block_time: '2026-01-18 12:00:00' },
  { trade_id: 'T012', token_bought_symbol: 'WIF', amount_usd: 340_000, block_time: '2026-01-18 10:30:00' },
  { trade_id: 'T013', token_bought_symbol: 'ARB', amount_usd: 310_000, block_time: '2026-01-18 11:30:00' },
  { trade_id: 'T014', token_bought_symbol: 'ARB', amount_usd: 165_000, block_time: '2026-01-18 13:45:00' },
  { trade_id: 'T015', token_bought_symbol: 'LINK', amount_usd: 210_000, block_time: '2026-01-18 12:15:00' },
  { trade_id: 'T016', token_bought_symbol: 'LINK', amount_usd: 98_000, block_time: '2026-01-18 10:20:00' },
  { trade_id: 'T017', token_bought_symbol: 'OP', amount_usd: 82_000, block_time: '2026-01-18 11:10:00' },
  { trade_id: 'T018', token_bought_symbol: 'ONDO', amount_usd: 76_000, block_time: '2026-01-18 12:50:00' },
  { trade_id: 'T019', token_bought_symbol: 'INJ', amount_usd: 72_000, block_time: '2026-01-18 11:20:00' },
  { trade_id: 'T020', token_bought_symbol: 'FET', amount_usd: 68_000, block_time: '2026-01-18 12:40:00' },
  { trade_id: 'T021', token_bought_symbol: 'RENDER', amount_usd: 61_000, block_time: '2026-01-18 13:10:00' },
  { trade_id: 'T022', token_bought_symbol: 'TIA', amount_usd: 55_000, block_time: '2026-01-18 10:55:00' },
  { trade_id: 'T023', token_bought_symbol: 'PENDLE', amount_usd: 48_000, block_time: '2026-01-18 11:35:00' },
]

export const dexTradeColumns = [
  'trade_id',
  'token_bought_symbol',
  'amount_usd',
  'block_time',
] as const

export const courseTables = [{ name: TABLE_NAME, columns: [...dexTradeColumns] }] as const

export function tradesInWindow() {
  return dexTrades.filter((t) => t.block_time >= WINDOW_START && t.block_time <= WINDOW_END)
}

export function tradesInWindowExcludingMajors() {
  const excluded = new Set(EXCLUDED_TOKENS.map((t) => t.toUpperCase()))
  return tradesInWindow().filter((t) => !excluded.has(t.token_bought_symbol.toUpperCase()))
}

export function topTokensByVolume(limit = CAPSTONE_LIMIT) {
  const totals = new Map<string, number>()
  for (const t of tradesInWindowExcludingMajors()) {
    totals.set(
      t.token_bought_symbol,
      (totals.get(t.token_bought_symbol) ?? 0) + t.amount_usd,
    )
  }
  return [...totals.entries()]
    .map(([token, total_volume_usd]) => ({ token, total_volume_usd }))
    .sort((a, b) => b.total_volume_usd - a.total_volume_usd)
    .slice(0, limit)
}

export const REFERENCE_QUERY = `select
    token_bought_symbol as token
    , SUM(amount_usd) as total_volume_usd
from dex.trades
where block_time >= TIMESTAMP '${WINDOW_START}'
   and token_bought_symbol not in ('USDC', 'USDT', 'BTC', 'ETH', 'XRP', 'SOL')
group by
    token_bought_symbol
order by
    total_volume_usd desc
limit ${CAPSTONE_LIMIT}`
