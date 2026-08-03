import type { Course } from '../types'
import {
  validateExcludeBotsExchanges,
  validateFrequentTraders,
  validateMeaningfulSize,
  validateSmartMoneyCapstone,
} from '../validators/smartMoney'
import { SMART_MONEY_MIN_SIZE_ETH, SMART_MONEY_MIN_TRADES } from './smartMoney'

export const onChainDataCourse: Course = {
  id: 'on-chain-data-analysis',
  title: 'On chain Data analysis',
  lessons: [
    {
      id: 'lesson-1',
      title: 'Find Smart Money',
      objective:
        'Identify wallets that trade frequently, trade meaningful size, and are not bots or exchanges.',
      concepts: [
        'Size filtering',
        'Trade frequency',
        'HAVING',
        'JOIN labels',
        'Smart money',
      ],
      available: true,
      steps: [
        {
          id: 'explore-trades',
          concept: 'On-chain trades',
          prompt:
            'You have a DEX trades table. Pull wallet_address, amount_eth, and token for every trade ≥ 1.5 ETH.',
          hint: `SELECT wallet_address, amount_eth, token FROM trades WHERE amount_eth >= ${SMART_MONEY_MIN_SIZE_ETH}`,
          starterSql: 'SELECT wallet_address, amount_eth, token\nFROM trades\nWHERE ',
          editorNote: `Filter amount_eth >= ${SMART_MONEY_MIN_SIZE_ETH}`,
          validate: validateMeaningfulSize,
        },
        {
          id: 'frequent-traders',
          concept: 'Trade frequency',
          prompt: `Smart money trades often. Which wallets have at least ${SMART_MONEY_MIN_TRADES} trades? Return wallet_address and trade_count.`,
          hint: `SELECT wallet_address, COUNT(*) AS trade_count FROM trades GROUP BY wallet_address HAVING COUNT(*) >= ${SMART_MONEY_MIN_TRADES}`,
          starterSql: 'SELECT wallet_address, COUNT(*) AS trade_count\nFROM trades\nGROUP BY wallet_address\n',
          editorNote: `Add HAVING COUNT(*) >= ${SMART_MONEY_MIN_TRADES}`,
          validate: validateFrequentTraders,
        },
        {
          id: 'exclude-noise',
          concept: 'Exclude bots & exchanges',
          prompt:
            'Remove noise. JOIN wallet_labels and return only wallets that are NOT tagged exchange or bot.',
          hint: "SELECT DISTINCT t.wallet_address, w.label FROM trades t LEFT JOIN wallet_labels w ON t.wallet_address = w.wallet_address WHERE w.label IS NULL OR w.label NOT IN ('exchange', 'bot')",
          starterSql:
            'SELECT DISTINCT t.wallet_address, w.label\nFROM trades t\nLEFT JOIN wallet_labels w ON t.wallet_address = w.wallet_address\nWHERE ',
          editorNote: "Filter: label IS NULL OR label NOT IN ('exchange', 'bot')",
          validate: validateExcludeBotsExchanges,
        },
        {
          id: 'smart-money-capstone',
          concept: 'Smart Money',
          prompt:
            'Combine everything: find smart money wallets — ≥ 1.5 ETH per trade, ≥ 5 trades total, not an exchange or bot.',
          hint: 'JOIN wallet_labels, filter size in WHERE, use GROUP BY + HAVING for frequency, exclude exchange/bot labels',
          starterSql:
            'SELECT t.wallet_address, COUNT(*) AS trade_count\nFROM trades t\nLEFT JOIN wallet_labels w ON t.wallet_address = w.wallet_address\nWHERE ',
          editorNote:
            'Add amount_eth filter, exclude exchange/bot, GROUP BY wallet_address, HAVING COUNT(*) >= 5',
          validate: validateSmartMoneyCapstone,
        },
      ],
    },
    {
      id: 'lesson-2',
      title: 'Track Smart Money Flows',
      objective: 'Follow where smart money wallets send capital after they accumulate.',
      concepts: ['Window functions', 'Flow analysis', 'Net inflows'],
      available: false,
      steps: [],
    },
    {
      id: 'lesson-3',
      title: 'Early Token Discovery',
      objective: 'Spot tokens smart money buys before they trend on social.',
      concepts: ['First buyers', 'Token age', 'Concentration'],
      available: false,
      steps: [],
    },
  ],
}
