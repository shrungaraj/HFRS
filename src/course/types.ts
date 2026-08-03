export type QueryResult = {
  columns: string[]
  rows: unknown[][]
  error?: string
}

export type ValidationResult = {
  passed: boolean
  message: string
  insight?: string
}

export type CourseStep = {
  id: string
  concept: string
  prompt: string
  hint: string
  starterSql: string
  editorNote?: string
  validate: (sql: string, result: QueryResult) => ValidationResult
}

export type CourseLesson = {
  id: string
  title: string
  objective: string
  concepts: string[]
  steps: CourseStep[]
  available: boolean
}

export type Course = {
  id: string
  title: string
  lessons: CourseLesson[]
}
