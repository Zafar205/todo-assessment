import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import TodoList from '@/components/TodoList'
import { LogOut } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: todos } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">TodoApp</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{user.email}</span>
            <form action="/auth/signout" method="post">
              <button className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors" title="Sign out">
                <LogOut size={20} />
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <TodoList initialTodos={todos || []} />
      </div>
    </main>
  )
}
