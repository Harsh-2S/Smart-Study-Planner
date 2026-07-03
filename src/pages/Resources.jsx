// pages/Resources.jsx
import Header from '../components/layout/Header'
import ResourceForm from '../components/resources/ResourceForm'
import ResourceList from '../components/resources/ResourceList'

export default function Resources() {
  return (
    <div>
      <Header title="Resources" subtitle="Links, docs, and videos organized by subject" />
      <ResourceForm />
      <ResourceList />
    </div>
  )
}
