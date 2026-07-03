// components/notes/NoteEditor.jsx
import { useState, useEffect, useRef } from 'react'

// Simple Markdown renderer (handles headers, bold, italic, code, lists, links)
function renderMarkdown(md) {
  if (!md) return ''
  let html = md
    // Code blocks (```)
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="note-code-block"><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="note-inline-code">$1</code>')
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="note-h3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="note-h2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="note-h1">$1</h1>')
    // Bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Strikethrough
    .replace(/~~(.+?)~~/g, '<del>$1</del>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="note-link">$1</a>')
    // Unordered lists
    .replace(/^[-*] (.+)$/gm, '<li class="note-li">$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li class="note-li note-li-ordered">$1</li>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="note-hr" />')
    // Blockquote
    .replace(/^> (.+)$/gm, '<blockquote class="note-blockquote">$1</blockquote>')
    // Paragraphs (double newline)
    .replace(/\n\n/g, '</p><p class="note-p">')
    // Single newlines → <br>
    .replace(/\n/g, '<br />')

  return '<p class="note-p">' + html + '</p>'
}

// Toolbar button helper
function ToolbarBtn({ label, icon, onClick, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title || label}
      className="px-2 py-1.5 rounded text-xs font-medium text-ink-muted dark:text-ink-muted-dark hover:bg-rule/40 dark:hover:bg-rule-dark/40 hover:text-ink dark:hover:text-ink-dark transition-colors"
    >
      {icon || label}
    </button>
  )
}

export default function NoteEditor({ note, onSave, onCancel, onDelete }) {
  const [title, setTitle] = useState(note?.title || '')
  const [content, setContent] = useState(note?.content || '')
  const [preview, setPreview] = useState(false)
  const [saved, setSaved] = useState(false)
  const textareaRef = useRef(null)

  // Auto-save indicator reset
  useEffect(() => {
    if (saved) {
      const timer = setTimeout(() => setSaved(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [saved])

  function insertAtCursor(before, after = '') {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = content.substring(start, end)
    const newText = content.substring(0, start) + before + selected + after + content.substring(end)
    setContent(newText)
    // Restore cursor position after state update
    setTimeout(() => {
      ta.focus()
      ta.selectionStart = start + before.length
      ta.selectionEnd = start + before.length + selected.length
    }, 0)
  }

  function handleSave() {
    if (!title.trim()) return
    onSave({ title: title.trim(), content })
    setSaved(true)
  }

  function handleKeyDown(e) {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      handleSave()
    }
    // Tab inserts 2 spaces
    if (e.key === 'Tab') {
      e.preventDefault()
      insertAtCursor('  ')
    }
  }

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
  const charCount = content.length

  return (
    <div className="rounded-card bg-surface dark:bg-surface-dark border border-rule dark:border-rule-dark transition-colors duration-300 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-rule dark:border-rule-dark bg-paper/50 dark:bg-paper-dark/50">
        <ToolbarBtn label="B" onClick={() => insertAtCursor('**', '**')} title="Bold (Ctrl+B)" />
        <ToolbarBtn label="I" onClick={() => insertAtCursor('*', '*')} title="Italic" />
        <ToolbarBtn label="S̶" onClick={() => insertAtCursor('~~', '~~')} title="Strikethrough" />
        <span className="w-px h-4 bg-rule dark:bg-rule-dark mx-1" />
        <ToolbarBtn label="H1" onClick={() => insertAtCursor('# ')} title="Heading 1" />
        <ToolbarBtn label="H2" onClick={() => insertAtCursor('## ')} title="Heading 2" />
        <ToolbarBtn label="H3" onClick={() => insertAtCursor('### ')} title="Heading 3" />
        <span className="w-px h-4 bg-rule dark:bg-rule-dark mx-1" />
        <ToolbarBtn label="•" onClick={() => insertAtCursor('- ')} title="Bullet list" />
        <ToolbarBtn label="1." onClick={() => insertAtCursor('1. ')} title="Numbered list" />
        <ToolbarBtn label="<>" onClick={() => insertAtCursor('`', '`')} title="Inline code" />
        <ToolbarBtn label="{}" onClick={() => insertAtCursor('```\n', '\n```')} title="Code block" />
        <ToolbarBtn label=">" onClick={() => insertAtCursor('> ')} title="Blockquote" />
        <ToolbarBtn label="—" onClick={() => insertAtCursor('\n---\n')} title="Horizontal rule" />

        <div className="flex-1" />

        {/* Preview toggle */}
        <button
          type="button"
          onClick={() => setPreview(!preview)}
          className={[
            'px-3 py-1.5 rounded text-xs font-medium transition-colors',
            preview
              ? 'bg-forest text-white'
              : 'text-ink-muted dark:text-ink-muted-dark hover:bg-rule/40 dark:hover:bg-rule-dark/40',
          ].join(' ')}
        >
          {preview ? '✎ Edit' : '👁 Preview'}
        </button>
      </div>

      {/* Title input */}
      <div className="px-4 pt-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title…"
          className="w-full text-xl font-display font-semibold text-ink dark:text-ink-dark bg-transparent border-none outline-none placeholder:text-ink-muted/50 dark:placeholder:text-ink-muted-dark/50"
        />
      </div>

      {/* Editor / Preview */}
      <div className="px-4 pb-4 mt-2">
        {preview ? (
          <div
            className="note-preview min-h-[300px] max-h-[500px] overflow-y-auto prose-sm text-ink dark:text-ink-dark"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Start writing your notes in Markdown…

# Heading
**bold** and *italic*
- Bullet list
`inline code`

Tip: Ctrl+S to save"
            rows={14}
            className="w-full min-h-[300px] max-h-[500px] rounded-md border border-rule dark:border-rule-dark bg-white dark:bg-paper-dark px-4 py-3 text-sm text-ink dark:text-ink-dark font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-forest dark:focus:ring-forest-dark transition-colors resize-y"
          />
        )}
      </div>

      {/* Footer: word count + actions */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-rule dark:border-rule-dark bg-paper/30 dark:bg-paper-dark/30">
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-ink-muted dark:text-ink-muted-dark font-mono">
            {wordCount} words · {charCount} chars
          </span>
          {saved && (
            <span className="text-[11px] text-forest dark:text-forest-dark font-medium animate-fade-in">
              ✓ Saved
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="px-3 py-1.5 rounded-md text-xs font-medium text-redpen hover:bg-redpen-light dark:hover:bg-redpen-light-dark transition-colors"
            >
              Delete
            </button>
          )}
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 rounded-md text-xs font-medium text-ink-muted dark:text-ink-muted-dark hover:bg-rule/40 dark:hover:bg-rule-dark/40 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={!title.trim()}
            className="px-4 py-1.5 rounded-md bg-forest text-white text-xs font-medium hover:bg-forest/90 transition-colors disabled:opacity-50"
          >
            Save note
          </button>
        </div>
      </div>
    </div>
  )
}
