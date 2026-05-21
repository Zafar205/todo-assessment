'use client'

import { useState } from 'react'
import { Plus, Trash2, Check, Clock } from 'lucide-react'

type Todo = {
  id: string
  title: string
  description: string | null
  is_complete: boolean
  reminder_at: string | null
  created_at: string
}

export default function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [reminderHours, setReminderHours] = useState<number | ''>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          description, 
          reminderHours: reminderHours ? Number(reminderHours) : null 
        }),
      })

      if (res.ok) {
        const newTodo = await res.json()
        setTodos([newTodo, ...todos])
        setTitle('')
        setDescription('')
        setReminderHours('')
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to add todo')
      }
    } catch (error) {
      console.error(error)
      alert('An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleTodo = async (id: string, currentStatus: boolean) => {
    // Optimistic update
    setTodos(todos.map(t => t.id === id ? { ...t, is_complete: !currentStatus } : t))

    try {
      const res = await fetch('/api/todos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_complete: !currentStatus }),
      })

      if (!res.ok) {
        // Revert on failure
        setTodos(todos.map(t => t.id === id ? { ...t, is_complete: currentStatus } : t))
      }
    } catch (error) {
      setTodos(todos.map(t => t.id === id ? { ...t, is_complete: currentStatus } : t))
    }
  }

  const deleteTodo = async (id: string) => {
    const originalTodos = [...todos]
    setTodos(todos.filter(t => t.id !== id))

    try {
      const res = await fetch(`/api/todos?id=${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        setTodos(originalTodos)
      }
    } catch (error) {
      setTodos(originalTodos)
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold mb-4">Add a new task</h2>
        <form onSubmit={addTodo} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 outline-none transition-all"
            />
          </div>
          <div>
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 outline-none transition-all resize-none h-20"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Clock size={16} />
              <label htmlFor="reminder">Remind me in (hours):</label>
              <input
                id="reminder"
                type="number"
                min="1"
                max="72"
                placeholder="e.g. 2"
                value={reminderHours}
                
                onChange={(e) => setReminderHours(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-20 px-2 py-1 border border-gray-200 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !title}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              <Plus size={18} />
              {isSubmitting ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-3">
        {todos.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No tasks yet. Add one above!</p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                todo.is_complete 
                  ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60' 
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm'
              }`}
            >
              <button
                onClick={() => toggleTodo(todo.id, todo.is_complete)}
                className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  todo.is_complete
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'border-gray-300 dark:border-gray-500 hover:border-blue-500'
                }`}
              >
                {todo.is_complete && <Check size={14} strokeWidth={3} />}
              </button>
              
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium ${todo.is_complete ? 'line-through' : ''}`}>
                  {todo.title}
                </h3>
                {todo.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 whitespace-pre-wrap">
                    {todo.description}
                  </p>
                )}
                {todo.reminder_at && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-blue-600 dark:text-blue-400 font-medium">
                    <Clock size={12} />
                    <span>Reminder set for {new Date(todo.reminder_at).toLocaleString()}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
