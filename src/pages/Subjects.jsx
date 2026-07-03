// pages/Subjects.jsx
import Header from '../components/layout/Header'
import SubjectForm from '../components/subjects/SubjectForm'
import SubjectList from '../components/subjects/SubjectList'
import GradeForm from '../components/subjects/GradeForm'

export default function Subjects() {
  return (
    <div>
      <Header title="Subjects" subtitle="Courses, targets, and weekly goals" />
      <SubjectForm />
      <SubjectList />

      <h2 className="font-display text-xl text-ink dark:text-ink-dark mt-10 mb-3">Log a grade</h2>
      <GradeForm />
    </div>
  )
}
