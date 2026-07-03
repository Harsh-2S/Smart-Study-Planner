// pages/Sessions.jsx
import Header from '../components/layout/Header'
import SessionLogger from '../components/sessions/SessionLogger'
import SessionHistory from '../components/sessions/SessionHistory'

export default function Sessions() {
  return (
    <div>
      <Header title="Sessions" subtitle="Log study time as you go" />
      <SessionLogger />
      <SessionHistory />
    </div>
  )
}
