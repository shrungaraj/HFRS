import type { Course } from '../types'
import {
  validateExcludeMajors,
  validateLastFourHours,
  validateRankByVolume,
  validateTopCoinsCapstone,
} from '../validators/volume'
import { EXCLUDED_TOKENS, WINDOW_START } from './volumeSwaps'

const excludedList = EXCLUDED_TOKENS.map((t) => `'${t}'`).join(', ')

export const onChainDataCourse: Course = {
  id: 'on-chain-data-analysis',
  title: 'On chain Data analysis',
  lessons: [
    {
      id: 'lesson-1',
      title: 'Top Coins by 4h Volume',
      objective:
        'Find the highest-volume altcoins in the last 4 hours, excluding stables and blue chips.',
      concepts: ['Time filters', 'Exclusions', 'SUM', 'GROUP BY', 'ORDER BY'],
      available: true,
      steps: [
        {
          id: 'four-hour-window',
          concept: '4h window',
          prompt:
            'DEX volume just spiked. Pull every swap from the last 4 hours — use swapped_at >= the window start.',
          hint: `SELECT token, volume_usd, swapped_at FROM swaps WHERE swapped_at >= '${WINDOW_START}'`,
          starterSql: 'SELECT token, volume_usd, swapped_at\nFROM swaps\nWHERE swapped_at >= ',
          editorNote: `'${WINDOW_START}'`,
          validate: validateLastFourHours,
        },
        {
          id: 'exclude-majors',
          concept: 'Exclude majors',
          prompt:
            'Strip the noise. Keep only swaps from the last 4 hours that are NOT USDC, USDT, BTC, ETH, XRP, or SOL.',
          hint: `WHERE swapped_at >= '${WINDOW_START}' AND token NOT IN (${excludedList})`,
          starterSql:
            "SELECT token, volume_usd, swapped_at\nFROM swaps\nWHERE swapped_at >= '2026-01-18 10:00:00'\n  AND token NOT IN (",
          editorNote: `${excludedList})`,
          validate: validateExcludeMajors,
        },
        {
          id: 'rank-volume',
          concept: 'Rank by volume',
          prompt:
            'Which alts are moving? Rank tokens by total volume_usd in the last 4 hours (majors already excluded).',
          hint: 'SELECT token, SUM(volume_usd) AS total_volume_usd … GROUP BY token ORDER BY total_volume_usd DESC',
          starterSql:
            "SELECT token, SUM(volume_usd) AS total_volume_usd\nFROM swaps\nWHERE swapped_at >= '2026-01-18 10:00:00'\n  AND token NOT IN ('USDC', 'USDT', 'BTC', 'ETH', 'XRP', 'SOL')\nGROUP BY token\nORDER BY total_volume_usd DESC",
          editorNote: 'Run to see ranked altcoins by 4h volume.',
          validate: validateRankByVolume,
        },
        {
          id: 'top-coins-capstone',
          concept: 'Top coins',
          prompt:
            'Give me the top 5 coins by 4h volume. Exclude USDC, USDT, BTC, ETH, XRP & SOL. Highest volume first.',
          hint: 'Combine time filter + NOT IN + GROUP BY + ORDER BY DESC + LIMIT 5',
          starterSql:
            "SELECT token, SUM(volume_usd) AS total_volume_usd\nFROM swaps\nWHERE swapped_at >= '2026-01-18 10:00:00'\n  AND token NOT IN ('USDC', 'USDT', 'BTC', 'ETH', 'XRP', 'SOL')\nGROUP BY token\nORDER BY total_volume_usd DESC\nLIMIT ",
          editorNote: 'Type 5 after LIMIT.',
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
