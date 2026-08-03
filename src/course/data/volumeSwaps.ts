export type Swap = {
  swap_id: string
  token: string
  volume_usd: number
  swapped_at: string
}

/** Dataset anchor — all "last 4 hours" filters use this window. */
export const WINDOW_START = '2026-01-18 10:00:00'
export const WINDOW_END = '2026-01-18 14:00:00'

export const EXCLUDED_TOKENS = ['USDC', 'USDT', 'BTC', 'ETH', 'XRP', 'SOL'] as const

export const swaps: Swap[] = [
  // Outside window — should not appear in 4h queries
  { swap_id: 'S001', token: 'PEPE', volume_usd: 9_000_000, swapped_at: '2026-01-18 08:30:00' },
  { swap_id: 'S002', token: 'ETH', volume_usd: 8_000_000, swapped_at: '2026-01-18 09:15:00' },

  // Inside window — majors (high volume, must be excluded)
  { swap_id: 'S003', token: 'USDC', volume_usd: 5_200_000, swapped_at: '2026-01-18 10:15:00' },
  { swap_id: 'S004', token: 'USDT', volume_usd: 4_800_000, swapped_at: '2026-01-18 11:00:00' },
  { swap_id: 'S005', token: 'ETH', volume_usd: 3_400_000, swapped_at: '2026-01-18 12:30:00' },
  { swap_id: 'S006', token: 'BTC', volume_usd: 2_900_000, swapped_at: '2026-01-18 11:45:00' },
  { swap_id: 'S007', token: 'SOL', volume_usd: 1_750_000, swapped_at: '2026-01-18 13:00:00' },
  { swap_id: 'S008', token: 'XRP', volume_usd: 1_300_000, swapped_at: '2026-01-18 13:30:00' },

  // Inside window — altcoins (the signal)
  { swap_id: 'S009', token: 'PEPE', volume_usd: 920_000, swapped_at: '2026-01-18 13:15:00' },
  { swap_id: 'S010', token: 'PEPE', volume_usd: 480_000, swapped_at: '2026-01-18 10:45:00' },
  { swap_id: 'S011', token: 'WIF', volume_usd: 710_000, swapped_at: '2026-01-18 12:00:00' },
  { swap_id: 'S012', token: 'WIF', volume_usd: 340_000, swapped_at: '2026-01-18 10:30:00' },
  { swap_id: 'S013', token: 'ARB', volume_usd: 310_000, swapped_at: '2026-01-18 11:30:00' },
  { swap_id: 'S014', token: 'ARB', volume_usd: 165_000, swapped_at: '2026-01-18 13:45:00' },
  { swap_id: 'S015', token: 'LINK', volume_usd: 210_000, swapped_at: '2026-01-18 12:15:00' },
  { swap_id: 'S016', token: 'LINK', volume_usd: 98_000, swapped_at: '2026-01-18 10:20:00' },
  { swap_id: 'S017', token: 'OP', volume_usd: 82_000, swapped_at: '2026-01-18 11:10:00' },
  { swap_id: 'S018', token: 'ONDO', volume_usd: 76_000, swapped_at: '2026-01-18 12:50:00' },
]

export const swapColumns = ['swap_id', 'token', 'volume_usd', 'swapped_at'] as const

export const courseTables = [{ name: 'swaps', columns: [...swapColumns] }] as const

export function swapsInWindow() {
  return swaps.filter((s) => s.swapped_at >= WINDOW_START && s.swapped_at <= WINDOW_END)
}

export function swapsInWindowExcludingMajors() {
  const excluded = new Set(EXCLUDED_TOKENS.map((t) => t.toUpperCase()))
  return swapsInWindow().filter((s) => !excluded.has(s.token.toUpperCase()))
}

export function topTokensByVolume(limit = 5) {
  const totals = new Map<string, number>()
  for (const s of swapsInWindowExcludingMajors()) {
    totals.set(s.token, (totals.get(s.token) ?? 0) + s.volume_usd)
  }
  return [...totals.entries()]
    .map(([token, total_volume_usd]) => ({ token, total_volume_usd }))
    .sort((a, b) => b.total_volume_usd - a.total_volume_usd)
    .slice(0, limit)
}

export const TOP_TOKEN = topTokensByVolume(1)[0]?.token ?? 'PEPE'
