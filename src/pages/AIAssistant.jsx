// pages/AIAssistant.jsx
import Header from '../components/layout/Header'
import StudyPlanGenerator from '../components/ai/StudyPlanGenerator'
import QuizGenerator from '../components/ai/QuizGenerator'

export default function AIAssistant() {
  return (
    <div>
      <Header title="AI Assistant" subtitle="Powered by Gemini" />
      <StudyPlanGenerator />
      <QuizGenerator />
    </div>
  )
}
