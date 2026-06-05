import { useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import Icon from '../Icon'

export default function NotesPanel() {
  const notes = useAppStore((s) => s.notes)
  const addNote = useAppStore((s) => s.addNote)
  const updateNote = useAppStore((s) => s.updateNote)
  const removeNote = useAppStore((s) => s.removeNote)
  const [openId, setOpenId] = useState(null)

  const open = notes.find((n) => n.id === openId)

  if (open) {
    return (
      <div className="panel">
        <button className="panel__back" onClick={() => setOpenId(null)}>
          <Icon name="chevLeft" size={18} /> ノート一覧
        </button>
        <input
          className="note-editor__title"
          value={open.title}
          placeholder="タイトル"
          onChange={(e) => updateNote(open.id, { title: e.target.value })}
        />
        <textarea
          className="note-editor__body scroll"
          value={open.body}
          placeholder="ここに好きなことを書こう…"
          onChange={(e) => updateNote(open.id, { body: e.target.value })}
          autoFocus
        />
      </div>
    )
  }

  return (
    <div className="panel">
      <h2 className="section-title">ノート</h2>
      <hr className="divider" />
      <button className="pill" onClick={addNote}>
        <span className="plus">＋</span> 新しいページ
      </button>
      <hr className="divider" />
      <div className="note-list">
        {notes.length === 0 && (
          <p className="empty">まだページがありません</p>
        )}
        {notes.map((n) => (
          <div className="note-row" key={n.id}>
            <button className="note-row__main" onClick={() => setOpenId(n.id)}>
              <span className="note-row__title">{n.title || '無題のページ'}</span>
              {n.body && <span className="note-row__preview">{n.body.slice(0, 40)}</span>}
            </button>
            <button
              className="icon-btn note-row__del"
              title="削除"
              onClick={() => removeNote(n.id)}
            >
              <Icon name="trash" size={18} />
            </button>
            <span className="note-row__drag">
              <Icon name="drag" size={18} />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
