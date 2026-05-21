import { login } from './actions'
import Link from 'next/link'

export default async function LoginPage(props: {
  searchParams: Promise<{ message: string }>
}) {
  const searchParams = await props.searchParams
  const message = searchParams.message
  
  // A simple hack to style success messages vs error messages
  const isSuccessMessage = message?.toLowerCase().includes('check email')

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
          Welcome back to TodoApp
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Sign in to your account.
        </p>

        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="••••••••"
            />
          </div>
          
          {message && (
            <p className={`text-sm p-3 rounded-md text-center ${
              isSuccessMessage 
                ? 'text-green-700 bg-green-50 dark:bg-green-900/30 dark:text-green-400'
                : 'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {message}
            </p>
          )}

          <div className="flex flex-col gap-4 mt-4">
            <button
              formAction={login}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors"
            >
              Sign In
            </button>
            
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link href="/signup" className="text-blue-600 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
