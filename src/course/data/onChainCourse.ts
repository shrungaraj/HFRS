import type { Course } from '../types'
import {
  validateExcludeMajors,
  validateLastFourHours,
  validateRankByVolume,
  validateTopCoinsCapstone,
} from '../validators/volume'
import { EXCLUDED_TOKENS, REFERENCE_QUERY, WINDOW_START } from './dexTrades'

const excludedList = EXCLUDED_TOKENS.map((t) => `'${t}'`).join(', ')

export const onChainDataCourse: Course = {
  id: 'on-chain-data-analysis',
  title: 'On chain Data analysis',
  lessons: [
    {
      id: 'lesson-1',
      title: 'Top Coins by 4h Volume',
      objective:
        'Query dex.trades to find the highest-volume altcoins in the last 4 hours on Dune-style SQL.',
      concepts: ['dex.trades', 'block_time', 'token_bought_symbol', 'SUM', 'GROUP BY'],
      available: true,
      steps: [
        {
          id: 'four-hour-window',
          concept: '4h window',
          prompt:
            'Volume is spiking on-chain. Pull token_bought_symbol, amount_usd, and block_time from dex.trades for the last 4 hours.',
          hint: `SELECT token_bought_symbol, amount_usd, block_time FROM dex.trades WHERE block_time >= TIMESTAMP '${WINDOW_START}'`,
          starterSql:
            'SELECT token_bought_symbol, amount_usd, block_time\nFROM dex.trades\nWHERE block_time >= TIMESTAMP ',
          editorNote: `'${WINDOW_START}'`,
          validate: validateLastFourHours,
        },
        {
          id: 'exclude-majors',
          concept: 'Exclude majors',
          prompt:
            'Strip stables and blue chips. Same 4h window, but exclude USDC, USDT, BTC, ETH, XRP, and SOL from token_bought_symbol.',
          hint: `… AND token_bought_symbol NOT IN (${excludedList})`,
          starterSql:
            'SELECT token_bought_symbol, amount_usd, block_time\nFROM dex.trades\nWHERE block_time >= TIMESTAMP \'2026-01-18 10:00:00\'\n  AND token_bought_symbol NOT IN (',
          editorNote: `${excludedList})`,
          validate: validateExcludeMajors,
        },
        {
          id: 'rank-volume',
          concept: 'Rank by volume',
          prompt:
            'Rank altcoins by total amount_usd bought in the last 4 hours. Alias token_bought_symbol as token.',
          hint: 'SELECT token_bought_symbol AS token, SUM(amount_usd) AS total_volume_usd … GROUP BY token_bought_symbol ORDER BY total_volume_usd DESC',
          starterSql:
            'SELECT token_bought_symbol AS token\n    , SUM(amount_usd) AS total_volume_usd\nFROM dex.trades\nWHERE block_time >= TIMESTAMP \'2026-01-18 10:00:00\'\n  AND token_bought_symbol NOT IN (\'USDC\', \'USDT\', \'BTC\', \'ETH\', \'XRP\', \'SOL\')\nGROUP BY token_bought_symbol\nORDER BY total_volume_usd DESC',
          editorNote: 'Run to see ranked altcoins.',
          validate: validateRankByVolume,
        },
        {
          id: 'top-coins-capstone',
          concept: 'Top 10 coins',
          prompt: 'Find the top 10 coins by 4h buy volume. Exclude USDC, USDT, BTC, ETH, XRP & SOL.',
          hint: REFERENCE_QUERY,
          starterSql: `SELECT token_bought_symbol AS token
    , SUM(amount_usd) AS total_volume_usd
FROM dex.trades
WHERE block_time >= TIMESTAMP '${WINDOW_START}'
  AND token_bought_symbol NOT IN ('USDC', 'USDT', 'BTC', 'ETH', 'XRP', 'SOL')
GROUP BY token_bought_symbol
ORDER BY total_volume_usd DESC
LIMIT `,
          editorNote: 'Type 10 after LIMIT.',
          validate: validateTopCoinsCapstone,
        },
      ],
    },
    {
      id: 'lesson-2',
      title: 'Find Smart Money',
      objective: 'Identify wallets that trade frequently, with size, and are not bots or exchanges.',
      concepts: ['HAVING', 'JOIN labels', 'Wallet filtering'],
      available: false,
      steps: [],
    },
    {
      id: 'lesson-3',
      title: 'Early Token Discovery',
      objective: 'Spot tokens gaining volume before they trend on social.',
      concepts: ['Volume spikes', 'Token age', 'Momentum'],
      available: false,
      steps: [],
    },
  ],
}
