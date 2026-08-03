import type { QueryResult, ValidationResult } from '../types'
import {
  SMART_MONEY_MIN_SIZE_ETH,
  SMART_MONEY_MIN_TRADES,
  smartMoneyWallets,
  trades,
  walletLabels,
} from '../data/smartMoney'

function fail(message: string): ValidationResult {
  return { passed: false, message }
}

function pass(message: string, insight?: string): ValidationResult {
  return { passed: true, message, insight }
}

function normalizeSql(sql: string) {
  return sql.trim().replace(/\s+/g, ' ').toLowerCase()
}

function hasError(result: QueryResult) {
  if (result.error) return fail(result.error)
  return null
}

function walletColumnIndex(result: QueryResult) {
  return result.columns.findIndex((c) => c.toLowerCase().includes('wallet'))
}

function extractWallets(result: QueryResult): string[] {
  const idx = walletColumnIndex(result)
  if (idx === -1) return []
  return result.rows.map((row) => String(row[idx]))
}

const excludedWallets = walletLabels
  .filter((w) => w.label === 'exchange' || w.label === 'bot')
  .map((w) => w.wallet_address)

export function validateMeaningfulSize(sql: string, result: QueryResult): ValidationResult {
  const err = hasError(result)
  if (err) return err
  const normalized = normalizeSql(sql)
  if (!normalized.includes('where')) return fail('Filter meaningful size with a WHERE clause.')
  if (!normalized.includes('amount_eth')) return fail('Filter on amount_eth.')

  const expected = trades.filter((t) => t.amount_eth >= SMART_MONEY_MIN_SIZE_ETH)
  if (result.rows.length !== expected.length) {
    return fail(`Expected ${expected.length} trades with amount_eth >= ${SMART_MONEY_MIN_SIZE_ETH}.`)
  }
  return pass(
    'Size filter applied.',
    `Kept ${expected.length} trades ≥ ${SMART_MONEY_MIN_SIZE_ETH} ETH — size separates conviction from dust.`,
  )
}

export function validateFrequentTraders(sql: string, result: QueryResult): ValidationResult {
  const err = hasError(result)
  if (err) return err
  const normalized = normalizeSql(sql)
  if (!normalized.includes('group by')) return fail('Group by wallet_address to count trades per wallet.')
  if (!normalized.includes('having')) {
    return fail('Use HAVING to filter wallets with enough trades.')
  }

  const freqWallets = new Map<string, number>()
  for (const t of trades) {
    freqWallets.set(t.wallet_address, (freqWallets.get(t.wallet_address) ?? 0) + 1)
  }
  const expectedCount = [...freqWallets.entries()].filter(([, c]) => c >= SMART_MONEY_MIN_TRADES).length

  if (result.rows.length !== expectedCount) {
    return fail(`Expected ${expectedCount} wallets with at least ${SMART_MONEY_MIN_TRADES} trades.`)
  }
  return pass(
    'Frequent traders isolated.',
    `Wallets with ≥ ${SMART_MONEY_MIN_TRADES} trades are your frequency signal — smart money stays active.`,
  )
}

export function validateExcludeBotsExchanges(sql: string, result: QueryResult): ValidationResult {
  const err = hasError(result)
  if (err) return err
  const normalized = normalizeSql(sql)
  if (!normalized.includes('join')) return fail('JOIN wallet_labels to check wallet type.')
  if (!normalized.includes('wallet_labels')) return fail('Join the wallet_labels table.')

  const wallets = [...new Set(extractWallets(result))]
  for (const wallet of wallets) {
    if (excludedWallets.includes(wallet)) {
      return fail('Your results still include an exchange or bot wallet.')
    }
  }

  for (const wallet of smartMoneyWallets) {
    if (!wallets.includes(wallet)) {
      return fail('Unlabeled smart money wallets should still appear in your results.')
    }
  }

  return pass(
    'Noise removed.',
    'Exchanges and bots are out — smart money wallets are usually unlabeled in public data.',
  )
}

export function validateSmartMoneyCapstone(sql: string, result: QueryResult): ValidationResult {
  const err = hasError(result)
  if (err) return err
  const normalized = normalizeSql(sql)
  if (!normalized.includes('join')) return fail('JOIN trades with wallet_labels.')
  if (!normalized.includes('group by')) return fail('Aggregate per wallet with GROUP BY.')
  if (!normalized.includes('having')) return fail('Use HAVING for minimum trade count.')
  if (!normalized.includes('amount_eth')) return fail('Filter trade size with amount_eth in WHERE.')

  const wallets = [...new Set(extractWallets(result))]

  for (const wallet of wallets) {
    if (excludedWallets.includes(wallet)) {
      return fail('Smart money list should not include exchanges or bots.')
    }
  }

  for (const expected of smartMoneyWallets) {
    if (!wallets.includes(expected)) {
      return fail('Missing a smart money wallet from your results.')
    }
  }

  if (wallets.length !== smartMoneyWallets.length) {
    return fail(`Expected exactly ${smartMoneyWallets.length} smart money wallets.`)
  }

  return pass(
    'Smart money found!',
    '2 wallets trade often, trade size, and are not exchanges or bots — your on-chain edge.',
  )
}
