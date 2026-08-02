import type { Course } from '../types'
import {
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
      objective: 'Learn how blockchain transactions are stored and how to query daily activity.',
      concepts: [
        'What is on-chain data',
        'Understanding tables',
        'Reading blockchain transactions',
        'Aggregation',
        'GROUP BY',
        'COUNT',
      ],
      available: true,
      steps: [
        {
          id: 'on-chain-data',
          concept: 'On-chain data',
          prompt: 'Every transaction is a row in a table. Pull the first 3 rows.',
          hint: 'Use SELECT * with LIMIT 3.',
          starterSql: 'SELECT * FROM transactions\nLIMIT ',
          validate: validateLimitThree,
        },
        {
          id: 'tables',
          concept: 'Tables',
          prompt: 'Tables have named columns. Return only sender and amount.',
          hint: 'List column names after SELECT.',
          starterSql: 'SELECT \nFROM transactions',
          validate: validateSelectColumns,
        },
        {
          id: 'reading-tx',
          concept: 'Reading transactions',
          prompt: 'Filter to transactions where amount is greater than 1.',
          hint: 'Add WHERE amount > 1.',
          starterSql: 'SELECT *\nFROM transactions\n',
          validate: validateFilterAmount,
        },
        {
          id: 'count',
          concept: 'COUNT',
          prompt: 'How many transactions are in the table?',
          hint: 'COUNT(*) returns the total number of rows.',
          starterSql: 'SELECT \nFROM transactions',
          validate: validateCountAll,
        },
        {
          id: 'group-by',
          concept: 'GROUP BY',
          prompt: 'Count how many transactions happened on each day.',
          hint: 'SELECT date, COUNT(*) … GROUP BY date',
          starterSql: 'SELECT date,\nFROM transactions\n',
          validate: validateGroupByDate,
        },
      ],
    },
    {
      id: 'lesson-2',
      title: 'Wallet Behaviour Patterns',
      objective: 'Analyse sender and receiver flows across the chain.',
      concepts: ['JOIN', 'DISTINCT', 'ORDER BY'],
      available: false,
      steps: [],
    },
    {
      id: 'lesson-3',
      title: 'Daily Network Metrics',
      objective: 'Build dashboards from aggregated on-chain activity.',
      concepts: ['SUM', 'AVG', 'HAVING'],
      available: false,
      steps: [],
    },
  ],
}
