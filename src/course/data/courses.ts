import type { Course } from '../types'
import { onChainDataCourse } from './onChainCourse'

const coursesById: Record<string, Course> = {
  [onChainDataCourse.id]: onChainDataCourse,
}

export function getCourseById(courseId: string): Course | undefined {
  return coursesById[courseId]
}
