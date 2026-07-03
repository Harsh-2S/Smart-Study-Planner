import { useState, useRef } from 'react'
import { useSubjectStore } from '../../store/useSubjectStore'
import { useResourceStore } from '../../store/useResourceStore'
import { uploadFile } from '../../lib/uploadApi'

const types = ['Article', 'Video', 'Document', 'Other']

export default function ResourceForm() {
  const subjects = useSubjectStore((s) => s.subjects)
  const addResource = useResourceStore((s) => s.addResource)
  
  const [mode, setMode] = useState('link') // 'link' | 'upload'
  const [subjectId, setSubjectId] = useState('')
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [file, setFile] = useState(null)
  const [type, setType] = useState('')
  
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)
  
  const fileInputRef = useRef(null)

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (!subjectId || !title.trim()) return
    if (mode === 'link' && !url.trim()) return
    if (mode === 'upload' && !file) return
    
    setError(null)

    try {
      let finalUrl = url.trim()
      let finalType = type
      
      if (mode === 'upload') {
        setIsUploading(true)
        finalUrl = await uploadFile(file)
        if (!finalType) {
           // Default to Document if uploading a file and type is auto
           finalType = 'Document'
        }
      }
      
      addResource({ subjectId, title: title.trim(), url: finalUrl, type: finalType })
      
      setTitle('')
      setUrl('')
      setFile(null)
      setType('')
      if (fileInputRef.current) fileInputRef.current.value = ''
      
    } catch (err) {
      console.error('Save failed:', err)
      setError(err.message || 'Failed to save resource')
    } finally {
      setIsUploading(false)
    }
  }

  if (subjects.length === 0) {
    return (
      <div className="rounded-card bg-surface dark:bg-surface-dark border border-rule dark:border-rule-dark p-5 transition-colors duration-300">
        <p className="text-sm text-ink-muted dark:text-ink-muted-dark">
          Add a subject first (on the Subjects page), then save resources here.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-card bg-surface dark:bg-surface-dark border border-rule dark:border-rule-dark p-5 transition-colors duration-300 relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg text-ink dark:text-ink-dark">Save a resource</h3>
        
        {/* Mode Toggle */}
        <div className="flex bg-rule/30 dark:bg-rule-dark/50 p-1 rounded-md">
          <button
            type="button"
            onClick={() => { setMode('link'); setError(null) }}
            className={`px-3 py-1 text-xs font-medium rounded ${mode === 'link' ? 'bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark shadow-sm' : 'text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark'}`}
          >
            Link
          </button>
          <button
            type="button"
            onClick={() => { setMode('upload'); setError(null) }}
            className={`px-3 py-1 text-xs font-medium rounded ${mode === 'upload' ? 'bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark shadow-sm' : 'text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark'}`}
          >
            Upload File
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mb-4 text-sm text-redpen bg-redpen-light dark:bg-redpen-light-dark p-2 rounded">
          {error}
        </div>
      )}

      <div className="flex gap-3 items-end flex-wrap">
        <div className="w-44">
          <label className="block text-xs text-ink-muted dark:text-ink-muted-dark mb-1">Subject</label>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            disabled={isUploading}
            className="w-full rounded-md border border-rule dark:border-rule-dark px-3 py-2 text-sm text-ink dark:text-ink-dark focus:outline-none focus:ring-2 focus:ring-forest dark:focus:ring-forest-dark bg-white dark:bg-paper-dark transition-colors"
          >
            <option value="">Select…</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs text-ink-muted dark:text-ink-muted-dark mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isUploading}
            placeholder="Chapter 4 Summary Notes"
            className="w-full rounded-md border border-rule dark:border-rule-dark bg-white dark:bg-paper-dark px-3 py-2 text-sm text-ink dark:text-ink-dark focus:outline-none focus:ring-2 focus:ring-forest dark:focus:ring-forest-dark transition-colors"
          />
        </div>
        
        {mode === 'link' ? (
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs text-ink-muted dark:text-ink-muted-dark mb-1">URL</label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isUploading}
              placeholder="https://..."
              type="url"
              className="w-full rounded-md border border-rule dark:border-rule-dark bg-white dark:bg-paper-dark px-3 py-2 text-sm text-ink dark:text-ink-dark focus:outline-none focus:ring-2 focus:ring-forest dark:focus:ring-forest-dark transition-colors"
            />
          </div>
        ) : (
          <div className="flex-1 min-w-[200px]">
             <label className="block text-xs text-ink-muted dark:text-ink-muted-dark mb-1">File (PDF, Doc)</label>
             <input
               type="file"
               ref={fileInputRef}
               onChange={(e) => setFile(e.target.files[0])}
               disabled={isUploading}
               className="w-full rounded-md border border-rule dark:border-rule-dark bg-white dark:bg-paper-dark px-3 py-1.5 text-sm text-ink dark:text-ink-dark focus:outline-none focus:ring-2 focus:ring-forest dark:focus:ring-forest-dark transition-colors file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-rule/30 file:text-ink hover:file:bg-rule/50 dark:file:bg-rule-dark/50 dark:file:text-ink-dark"
             />
          </div>
        )}
        
        <div className="w-28 shrink-0">
          <label className="block text-xs text-ink-muted dark:text-ink-muted-dark mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            disabled={isUploading}
            className="w-full rounded-md border border-rule dark:border-rule-dark px-3 py-2 text-sm text-ink dark:text-ink-dark focus:outline-none focus:ring-2 focus:ring-forest dark:focus:ring-forest-dark bg-white dark:bg-paper-dark transition-colors"
          >
            <option value="">Auto</option>
            {types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        
        <button
          type="submit"
          disabled={isUploading}
          className="rounded-md bg-forest dark:bg-forest-dark text-white text-sm font-medium px-4 py-2 hover:opacity-90 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isUploading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
}
