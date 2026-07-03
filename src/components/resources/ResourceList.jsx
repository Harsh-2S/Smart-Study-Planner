// components/resources/ResourceList.jsx
import { useState } from 'react'
import { useSubjectStore } from '../../store/useSubjectStore'
import { useResourceStore } from '../../store/useResourceStore'

const typeIcons = {
  Article: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  Video: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
  Document: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Other: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
}

const typeBadgeStyles = {
  Article: 'text-forest dark:text-forest-dark bg-forest-light dark:bg-forest-light-dark',
  Video: 'text-redpen bg-redpen-light dark:bg-redpen-light-dark',
  Document: 'text-amber bg-amber-light dark:bg-amber-light-dark',
  Other: 'text-ink-muted dark:text-ink-muted-dark bg-rule/30 dark:bg-rule-dark/30',
}

export default function ResourceList() {
  const subjects = useSubjectStore((s) => s.subjects)
  const resources = useResourceStore((s) => s.resources)
  const removeResource = useResourceStore((s) => s.removeResource)
  const [filter, setFilter] = useState('all')

  const subjectName = (id) => subjects.find((s) => s.id === id)?.name || 'Unknown'

  const filtered = filter === 'all' ? resources : resources.filter((r) => r.subjectId === filter)

  // Group by subject
  const grouped = {}
  for (const r of filtered) {
    const name = subjectName(r.subjectId)
    if (!grouped[name]) grouped[name] = []
    grouped[name].push(r)
  }

  return (
    <div className="mt-6">
      {/* Filter */}
      {subjects.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-ink-muted dark:text-ink-muted-dark font-medium">Filter:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-md border border-rule dark:border-rule-dark px-3 py-1.5 text-sm text-ink dark:text-ink-dark bg-white dark:bg-paper-dark focus:outline-none focus:ring-2 focus:ring-forest dark:focus:ring-forest-dark transition-colors"
          >
            <option value="all">All subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="rounded-card bg-surface dark:bg-surface-dark border border-rule dark:border-rule-dark p-8 text-center transition-colors duration-300">
          <svg className="mx-auto mb-3 text-ink-muted dark:text-ink-muted-dark" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <p className="text-sm text-ink-muted dark:text-ink-muted-dark">
            No resources saved yet. Use the form above to save links, documents, and videos.
          </p>
        </div>
      )}

      {/* Resource groups */}
      {Object.entries(grouped).map(([subjectName, items]) => (
        <div key={subjectName} className="mb-6">
          <h3 className="font-display text-base text-ink dark:text-ink-dark mb-3 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-forest dark:bg-forest-dark" />
            {subjectName}
            <span className="text-xs font-mono text-ink-muted dark:text-ink-muted-dark font-normal">({items.length})</span>
          </h3>
          <div className="space-y-2">
            {items.map((r) => (
              <div
                key={r.id}
                className="rounded-card bg-surface dark:bg-surface-dark border border-rule dark:border-rule-dark p-4 flex items-center gap-3 group hover:border-forest dark:hover:border-forest-dark transition-colors duration-200"
              >
                {/* Type icon */}
                <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${typeBadgeStyles[r.type] || typeBadgeStyles.Other}`}>
                  {typeIcons[r.type] || typeIcons.Other}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-ink dark:text-ink-dark hover:text-forest dark:hover:text-forest-dark transition-colors"
                  >
                    {r.title}
                  </a>
                  <p className="text-xs text-ink-muted dark:text-ink-muted-dark truncate mt-0.5">{r.url}</p>
                </div>

                {/* Type badge */}
                <span className={`text-[10px] font-mono uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0 ${typeBadgeStyles[r.type] || typeBadgeStyles.Other}`}>
                  {r.type}
                </span>

                {/* Delete */}
                <button
                  onClick={() => removeResource(r.id)}
                  className="opacity-0 group-hover:opacity-100 text-ink-muted dark:text-ink-muted-dark hover:text-redpen transition-all text-xs shrink-0"
                  aria-label={`Remove ${r.title}`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
