import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { CoursePage } from './components/course/CoursePage'
import { LessonPlayer } from './components/course/LessonPlayer'
import { Dashboard } from './components/Dashboard'
import { Landing } from './components/Landing'

function AppRoutes() {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return <Landing />
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/course/:courseId" element={<CoursePage />} />
      <Route path="/course/:courseId/lesson/:lessonId" element={<LessonPlayer />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
