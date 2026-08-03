import type { Course } from '../types'
import {
  validateBusiestDay,
  validateCountAll,
  validateFilterAmount,
  validateGroupByDate,
  validateLimitThree,
  validateSelectColumns,
} from '../validators'

export const onChainDataCourse: Course = {
  id: 'on-chain-data-analysis',
  title: 'On chain Data analysis',
  lessons: [
    {
      id: 'lesson-1',
      title: 'Understanding Blockchain Activity',
      objective:
        'Query a real-style transactions table to explore volume, large transfers, and daily on-chain activity.',
      concepts: [
        'On-chain data',
        'Schema exploration',
        'Filtering transfers',
        'COUNT',
        'GROUP BY',
        'ORDER BY',
      ],
      available: true,
      steps: [
        {
          id: 'schema-preview',
          concept: 'On-chain data',
          prompt:
            'A fresh chain export just landed. Preview 3 rows so you can see what an on-chain transaction looks like.',
          hint: 'SELECT * FROM transactions LIMIT 3',
          starterSql: 'SELECT * FROM transactions\nLIMIT ',
          editorNote: 'Type 3 after LIMIT, then press Run.',
          validate: validateLimitThree,
        },
        {
          id: 'compliance-columns',
          concept: 'Schema',
          prompt:
            'Compliance only needs who sent how much. Return sender and amount_eth — nothing else.',
          hint: 'SELECT sender, amount_eth FROM transactions',
          starterSql: 'SELECT \nFROM transactions',
          editorNote: 'Add sender, amount_eth after SELECT.',
          validate: validateSelectColumns,
        },
        {
          id: 'whale-filter',
          concept: 'Filtering',
          prompt: 'Flag whale transfers: show every transaction where amount_eth is greater than 1.',
          hint: 'Add WHERE amount_eth > 1',
          starterSql: 'SELECT *\nFROM transactions\n',
          editorNote: 'Add WHERE amount_eth > 1 on the last line.',
          validate: validateFilterAmount,
        },
        {
          id: 'dataset-size',
          concept: 'COUNT',
          prompt: 'How many on-chain transfers exist in this dataset?',
          hint: 'SELECT COUNT(*) FROM transactions',
          starterSql: 'SELECT \nFROM transactions',
          editorNote: 'Try COUNT(*) between SELECT and FROM.',
          validate: validateCountAll,
        },
        {
          id: 'daily-activity',
          concept: 'GROUP BY',
          prompt: 'Measure daily network activity — count how many transfers happened on each tx_date.',
          hint: 'SELECT tx_date, COUNT(*) FROM transactions GROUP BY tx_date',
          starterSql: 'SELECT tx_date,\nFROM transactions\n',
          editorNote: 'Add COUNT(*) after the comma, then GROUP BY tx_date.',
          validate: validateGroupByDate,
        },
        {
          id: 'busiest-day-capstone',
          concept: 'Capstone',
          prompt:
            'Which day was busiest? Return tx_date and the transfer count, highest first — limit to 1 row.',
          hint: 'GROUP BY tx_date, ORDER BY count DESC, LIMIT 1',
          starterSql: 'SELECT tx_date,\nFROM transactions\n',
          editorNote: 'Add COUNT(*), GROUP BY tx_date, ORDER BY … DESC, LIMIT 1.',
          validate: validateBusiestDay,
        },
      ],
    },
    {
      id: 'lesson-2',
      title: 'Wallet Behaviour Patterns',
      objective:
        'Trace flows between wallets, find repeat actors, and rank the largest movers on-chain.',
      concepts: ['DISTINCT', 'ORDER BY', 'JOIN', 'Subqueries'],
      available: false,
      steps: [],
    },
    {
      id: 'lesson-3',
      title: 'Daily Network Metrics',
      objective:
        'Build volume and gas metrics, filter high-activity days, and summarise chain health.',
      concepts: ['SUM', 'AVG', 'HAVING', 'Metric dashboards'],
      available: false,
      steps: [],
    },
  ],
}
