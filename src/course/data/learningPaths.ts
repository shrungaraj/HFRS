import type { LearningPath } from '../types'

export const learningPaths: LearningPath[] = [
  {
    id: 'become-onchain-analyst',
    title: 'Become an Onchain Analyst',
    description:
      'Master on-chain data analysis with production Dune SQL — from DEX volume to smart money and early token discovery.',
    courses: [
      { courseId: 'on-chain-data-analysis', available: true },
      { courseId: 'wallet-labeling', available: false },
      { courseId: 'token-momentum', available: false },
    ],
  },
]

export function getPathById(pathId: string): LearningPath | undefined {
  return learningPaths.find((path) => path.id === pathId)
}

export function getPathForCourse(courseId: string): LearningPath | undefined {
  return learningPaths.find((path) =>
    path.courses.some((entry) => entry.courseId === courseId),
  )
}
