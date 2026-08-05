import type { Course } from '../types'
import {
  validateDunePartitions,
  validateExcludeMajors,
  validateRankByVolume,
  validateTopCoinsCapstone,
} from '../validators/volume'
import {
  BLOCKCHAIN,
  BLOCK_MONTH,
  DUNE_REFERENCE_QUERY,
  EXCLUDED_TOKENS,
} from './dexTrades'

const excludedList = EXCLUDED_TOKENS.map((t) => `'${t}'`).join(', ')

export const onChainDataCourse: Course = {
  id: 'on-chain-data-analysis',
  title: 'On chain Data analysis',
  description: 'Learn production Dune SQL on dex.trades — top altcoins by 4h volume.',
  lessons: [
    {
      id: 'lesson-1',
      title: 'Top Coins by 4h Volume',
      objective:
        'Write production Dune SQL on dex.trades to find top altcoins by buy volume in the last 4 hours.',
      concepts: ['dex.trades', 'blockchain', 'block_month', 'token_bought_symbol', 'sum(amount_usd)'],
      available: true,
      steps: [
        {
          id: 'dune-partitions',
          concept: 'Dune partitions',
          prompt:
            'On Dune, always filter partition keys first. Pull token_bought_symbol and amount_usd from dex.trades for ethereum, January 2026, last 4 hours.',
          hint: `select token_bought_symbol, amount_usd from dex.trades where blockchain = '${BLOCKCHAIN}' and block_month >= date '${BLOCK_MONTH}' and block_time >= now() - interval '4' hour`,
          starterSql: `select
    token_bought_symbol
    , amount_usd
from dex.trades
where blockchain = '${BLOCKCHAIN}'
    and block_month >= date '${BLOCK_MONTH}'
    and block_time >= now() - interval '4' hour`,
          editorNote: "Dune requires blockchain + block_month on every dex.trades query.",
          validate: validateDunePartitions,
        },
        {
          id: 'exclude-majors',
          concept: 'Exclude majors',
          prompt:
            'Same Dune filters — now exclude USDC, USDT, BTC, ETH, XRP, and SOL from token_bought_symbol.',
          hint: `… and token_bought_symbol not in (${excludedList})`,
          starterSql: `select
    token_bought_symbol
    , amount_usd
from dex.trades
where blockchain = '${BLOCKCHAIN}'
    and block_month >= date '${BLOCK_MONTH}'
    and block_time >= now() - interval '4' hour
    and token_bought_symbol not in (`,
          editorNote: `${excludedList})`,
          validate: validateExcludeMajors,
        },
        {
          id: 'rank-volume',
          concept: 'Rank by volume',
          prompt:
            'Rank altcoins by total buy volume. Use Dune-style lowercase SQL with leading commas.',
          hint: 'select token_bought_symbol as token, sum(amount_usd) as total_volume_usd … group by token_bought_symbol order by total_volume_usd desc',
          starterSql: `select
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
    total_volume_usd desc`,
          editorNote: 'Run — this is the shape of a real Dune dashboard query.',
          validate: validateRankByVolume,
        },
        {
          id: 'top-coins-capstone',
          concept: 'Top 10 on Dune',
          prompt:
            'Final query: top 10 coins by 4h buy volume on dex.trades. Exclude stables and blue chips. Paste-ready for dune.com.',
          hint: DUNE_REFERENCE_QUERY,
          starterSql: DUNE_REFERENCE_QUERY.replace(/limit\s+10\s*$/i, 'limit '),
          editorNote: 'Type 10 after limit.',
          validate: validateTopCoinsCapstone,
        },
      ],
    },
    {
      id: 'lesson-2',
      title: 'Find Smart Money',
      objective: 'Use Dune wallet tables to find wallets that trade frequently with size.',
      concepts: ['labels', 'taker', 'tx_from', 'HAVING'],
      available: false,
      steps: [],
    },
    {
      id: 'lesson-3',
      title: 'Early Token Discovery',
      objective: 'Spot tokens gaining DEX volume before they trend.',
      concepts: ['dex.trades', 'token_pair', 'Volume momentum'],
      available: false,
      steps: [],
    },
  ],
}
