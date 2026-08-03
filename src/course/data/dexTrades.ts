/** Dune dex.trades schema — https://docs.dune.com/data-catalog/curated/dex-trades/evm/dex-trades */

export const DUNE_DEX_TRADES_COLUMNS = [
  'blockchain',
  'project',
  'version',
  'block_month',
  'block_date',
  'block_time',
  'block_number',
  'token_bought_symbol',
  'token_sold_symbol',
  'token_pair',
  'token_bought_amount',
  'token_sold_amount',
  'token_bought_amount_raw',
  'token_sold_amount_raw',
  'amount_usd',
  'token_bought_address',
  'token_sold_address',
  'taker',
  'maker',
  'project_contract_address',
  'tx_hash',
  'tx_from',
  'tx_to',
  'evt_index',
] as const

export type DuneDexTrade = {
  blockchain: string
  project: string
  version: string
  block_month: string
  block_date: string
  block_time: string
  block_number: number
  token_bought_symbol: string
  token_sold_symbol: string
  token_pair: string
  token_bought_amount: number
  token_sold_amount: number
  token_bought_amount_raw: number
  token_sold_amount_raw: number
  amount_usd: number
  token_bought_address: string
  token_sold_address: string
  taker: string
  maker: string
  project_contract_address: string
  tx_hash: string
  tx_from: string
  tx_to: string
  evt_index: number
}

export const TABLE_NAME = 'dex.trades'
export const BLOCKCHAIN = 'ethereum'
export const BLOCK_MONTH = '2026-01-01'
export const WINDOW_START = '2026-01-18 10:00:00'
export const WINDOW_END = '2026-01-18 14:00:00'

export const EXCLUDED_TOKENS = ['USDC', 'USDT', 'BTC', 'ETH', 'XRP', 'SOL'] as const
export const CAPSTONE_LIMIT = 10

function trade(
  partial: Pick<DuneDexTrade, 'token_bought_symbol' | 'token_sold_symbol' | 'amount_usd' | 'block_time' | 'evt_index'> &
    Partial<DuneDexTrade>,
): DuneDexTrade {
  const pair = [partial.token_bought_symbol, partial.token_sold_symbol].sort().join('-')
  return {
    blockchain: BLOCKCHAIN,
    project: partial.project ?? 'uniswap',
    version: partial.version ?? '3',
    block_month: BLOCK_MONTH,
    block_date: partial.block_time.slice(0, 10),
    block_number: partial.block_number ?? 19_240_000 + partial.evt_index,
    token_pair: partial.token_pair ?? pair,
    token_bought_amount: partial.token_bought_amount ?? partial.amount_usd / 3000,
    token_sold_amount: partial.token_sold_amount ?? partial.amount_usd / 3000,
    token_bought_amount_raw: partial.token_bought_amount_raw ?? Math.round(partial.amount_usd * 1e6),
    token_sold_amount_raw: partial.token_sold_amount_raw ?? Math.round(partial.amount_usd * 1e6),
    token_bought_address: partial.token_bought_address ?? '0x0000000000000000000000000000000000000001',
    token_sold_address: partial.token_sold_address ?? '0x0000000000000000000000000000000000000002',
    taker: partial.taker ?? '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
    maker: partial.maker ?? '0x28C6c06298bbf67bdc9b889CdfBc4a1581637c4',
    project_contract_address:
      partial.project_contract_address ?? '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    tx_hash: partial.tx_hash ?? `0xabc${String(partial.evt_index).padStart(58, '0')}`,
    tx_from: partial.tx_from ?? '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
    tx_to: partial.tx_to ?? '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    ...partial,
  }
}

export const dexTrades: DuneDexTrade[] = [
  trade({ token_bought_symbol: 'PEPE', token_sold_symbol: 'WETH', amount_usd: 9_000_000, block_time: '2026-01-18 08:30:00', evt_index: 1 }),
  trade({ token_bought_symbol: 'ETH', token_sold_symbol: 'USDC', amount_usd: 8_000_000, block_time: '2026-01-18 09:15:00', evt_index: 2 }),

  trade({ token_bought_symbol: 'USDC', token_sold_symbol: 'WETH', amount_usd: 5_200_000, block_time: '2026-01-18 10:15:00', evt_index: 3 }),
  trade({ token_bought_symbol: 'USDT', token_sold_symbol: 'WETH', amount_usd: 4_800_000, block_time: '2026-01-18 11:00:00', evt_index: 4 }),
  trade({ token_bought_symbol: 'ETH', token_sold_symbol: 'USDC', amount_usd: 3_400_000, block_time: '2026-01-18 12:30:00', evt_index: 5 }),
  trade({ token_bought_symbol: 'BTC', token_sold_symbol: 'WETH', amount_usd: 2_900_000, block_time: '2026-01-18 11:45:00', evt_index: 6, project: 'curve' }),
  trade({ token_bought_symbol: 'SOL', token_sold_symbol: 'USDC', amount_usd: 1_750_000, block_time: '2026-01-18 13:00:00', evt_index: 7 }),
  trade({ token_bought_symbol: 'XRP', token_sold_symbol: 'USDC', amount_usd: 1_300_000, block_time: '2026-01-18 13:30:00', evt_index: 8 }),

  trade({ token_bought_symbol: 'PEPE', token_sold_symbol: 'WETH', amount_usd: 920_000, block_time: '2026-01-18 13:15:00', evt_index: 9 }),
  trade({ token_bought_symbol: 'PEPE', token_sold_symbol: 'USDC', amount_usd: 480_000, block_time: '2026-01-18 10:45:00', evt_index: 10 }),
  trade({ token_bought_symbol: 'WIF', token_sold_symbol: 'SOL', amount_usd: 710_000, block_time: '2026-01-18 12:00:00', evt_index: 11 }),
  trade({ token_bought_symbol: 'WIF', token_sold_symbol: 'WETH', amount_usd: 340_000, block_time: '2026-01-18 10:30:00', evt_index: 12 }),
  trade({ token_bought_symbol: 'ARB', token_sold_symbol: 'ETH', amount_usd: 310_000, block_time: '2026-01-18 11:30:00', evt_index: 13 }),
  trade({ token_bought_symbol: 'ARB', token_sold_symbol: 'USDC', amount_usd: 165_000, block_time: '2026-01-18 13:45:00', evt_index: 14 }),
  trade({ token_bought_symbol: 'LINK', token_sold_symbol: 'WETH', amount_usd: 210_000, block_time: '2026-01-18 12:15:00', evt_index: 15 }),
  trade({ token_bought_symbol: 'LINK', token_sold_symbol: 'USDC', amount_usd: 98_000, block_time: '2026-01-18 10:20:00', evt_index: 16 }),
  trade({ token_bought_symbol: 'OP', token_sold_symbol: 'ETH', amount_usd: 82_000, block_time: '2026-01-18 11:10:00', evt_index: 17 }),
  trade({ token_bought_symbol: 'ONDO', token_sold_symbol: 'USDC', amount_usd: 76_000, block_time: '2026-01-18 12:50:00', evt_index: 18 }),
  trade({ token_bought_symbol: 'INJ', token_sold_symbol: 'WETH', amount_usd: 72_000, block_time: '2026-01-18 11:20:00', evt_index: 19 }),
  trade({ token_bought_symbol: 'FET', token_sold_symbol: 'USDC', amount_usd: 68_000, block_time: '2026-01-18 12:40:00', evt_index: 20 }),
  trade({ token_bought_symbol: 'RENDER', token_sold_symbol: 'WETH', amount_usd: 61_000, block_time: '2026-01-18 13:10:00', evt_index: 21 }),
  trade({ token_bought_symbol: 'TIA', token_sold_symbol: 'USDC', amount_usd: 55_000, block_time: '2026-01-18 10:55:00', evt_index: 22 }),
  trade({ token_bought_symbol: 'PENDLE', token_sold_symbol: 'ETH', amount_usd: 48_000, block_time: '2026-01-18 11:35:00', evt_index: 23 }),
]

export const courseTables = [
  {
    name: TABLE_NAME,
    columns: [...DUNE_DEX_TRADES_COLUMNS],
    partitionKeys: ['blockchain', 'project', 'block_month'],
  },
] as const

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
    totals.set(t.token_bought_symbol, (totals.get(t.token_bought_symbol) ?? 0) + t.amount_usd)
  }
  return [...totals.entries()]
    .map(([token, total_volume_usd]) => ({ token, total_volume_usd }))
    .sort((a, b) => b.total_volume_usd - a.total_volume_usd)
    .slice(0, limit)
}

export const DUNE_REFERENCE_QUERY = `select
    token_bought_symbol as token
    , sum(amount_usd) as total_volume_usd
from dex.trades
where blockchain = '${BLOCKCHAIN}'
    and block_month >= date '${BLOCK_MONTH}'
    and block_time >= now() - interval '4' hour
    and token_bought_symbol not in ('USDC', 'USDT', 'BTC', 'ETH', 'XRP', 'SOL')
group by
    token_bought_symbol
order by
    total_volume_usd desc
limit ${CAPSTONE_LIMIT}`
