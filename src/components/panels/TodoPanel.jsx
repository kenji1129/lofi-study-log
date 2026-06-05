import { useState } from 'react'
import { useAppStore, useActiveList } from '../../store/useAppStore'
import Icon from '../Icon'

export default function TodoPanel() {
  const lists = useAppStore((s) => s.todoLists)
  const list = useActiveList()
  const setActiveList = useAppStore((s) => s.setActiveList)
  const addList = useAppStore((s) => s.addList)
  const removeList = useAppStore((s) => s.removeList)
  const renameList = useAppStore((s) => s.renameList)
  const addTask = useAppStore((s) => s.addTask)
  const toggleTask = useAppStore((s) => s.toggleTask)
  const removeTask = useAppStore((s) => s.removeTask)

  const [draft, setDraft] = useState('')
  const [showDone, setShowDone] = useState(true)
  const [showOpen, setShowOpen] = useState(true)
  const [pickList, setPickList] = useState(false)

  if (!list) {
    return (
      <div className="panel">
        <h2 className="section-title">ToDoリスト</h2>
        <hr className="divider" />
        <button className="pill" onClick={addList}>
          <span className="plus">＋</span> リストを作る
        </button>
      </div>
    )
  }

  const tasks = list.tasks
  const openTasks = tasks.filter((t) => !t.done)
  const doneTasks = tasks.filter((t) => t.done)

  const submit = (e) => {
    e.preventDefault()
    const v = draft.trim()
    if (!v) return
    addTask(list.id, v)
    setDraft('')
  }

  return (
    <div className="panel">
      <h2 className="section-title">ToDoリスト</h2>
      <hr className="divider" />

      {/* list selector */}
      <div className="list-select">
        <button className="list-select__btn" onClick={() => setPickList((v) => !v)}>
          <span>{list.name}</span>
          <Icon name="chevDown" size={18} />
        </button>
        {pickList && (
          <div className="list-select__menu glass">
            {lists.map((l) => (
              <button
                key={l.id}
                className={`list-select__opt${l.id === list.id ? ' is-active' : ''}`}
                onClick={() => {
                  setActiveList(l.id)
                  setPickList(false)
                }}
              >
                {l.name}
              </button>
            ))}
            <hr className="divider" />
            <button
              className="list-select__opt"
              onClick={() => {
                addList()
                setPickList(false)
              }}
            >
              <Icon name="plus" size={16} /> 新しいリスト
            </button>
            {lists.length > 1 && (
              <button
                className="list-select__opt is-danger"
                onClick={() => {
                  removeList(list.id)
                  setPickList(false)
                }}
              >
                <Icon name="trash" size={16} /> このリストを削除
              </button>
            )}
          </div>
        )}
      </div>

      {/* add */}
      <form className="todo-add" onSubmit={submit}>
        <button type="submit" className="pill">
          <span className="plus">＋</span> 新しいタスク
        </button>
        <input
          className="todo-add__input"
          value={draft}
          placeholder="タスクを入力…"
          onChange={(e) => setDraft(e.target.value)}
        />
        <span className="todo-count">
          {doneTasks.length}/{tasks.length}
        </span>
      </form>

      <hr className="divider" />

      {/* open */}
      <button className="todo-group" onClick={() => setShowOpen((v) => !v)}>
        未完了タスク
        <Icon name={showOpen ? 'chevUp' : 'chevDown'} size={20} />
      </button>
      {showOpen && (
        <div className="todo-items">
          {openTasks.length === 0 && <p className="empty">タスクはありません</p>}
          {openTasks.map((t) => (
            <TaskRow
              key={t.id}
              task={t}
              onToggle={() => toggleTask(list.id, t.id)}
              onRemove={() => removeTask(list.id, t.id)}
            />
          ))}
        </div>
      )}

      <hr className="divider" />

      {/* done */}
      <button className="todo-group" onClick={() => setShowDone((v) => !v)}>
        完了タスク
        <Icon name={showDone ? 'chevUp' : 'chevDown'} size={20} />
      </button>
      {showDone && (
        <div className="todo-items">
          {doneTasks.length === 0 && <p className="empty">まだありません</p>}
          {doneTasks.map((t) => (
            <TaskRow
              key={t.id}
              task={t}
              onToggle={() => toggleTask(list.id, t.id)}
              onRemove={() => removeTask(list.id, t.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function TaskRow({ task, onToggle, onRemove }) {
  return (
    <div className={`task${task.done ? ' is-done' : ''}`}>
      <button className="task__check" onClick={onToggle} aria-label="切り替え">
        {task.done && <Icon name="check" size={16} />}
      </button>
      <span className="task__text">{task.text}</span>
      <button className="icon-btn task__del" onClick={onRemove} title="削除">
        <Icon name="trash" size={16} />
      </button>
    </div>
  )
}
