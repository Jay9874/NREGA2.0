import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authStore } from '../../api/store/store'
import { toast } from 'sonner'

export default function ResetPass () {
  const navigate = useNavigate()
  const { resetPassword, loading } = authStore()
  const [password, setPassword] = useState({
    new_password: '',
    confirm_password: ''
  })
  return (
    <div className='flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
      <div className='mx-auto w-full max-w-sm lg:w-96'>
        <div>
          <h2 className='mt-6 text-3xl font-bold tracking-tight text-gray-900'>
            Recover Your Account
          </h2>
        </div>

        <div className='mt-8'>
          <div className='mt-6'>
            <form
              className='space-y-6'
              onSubmit={e => {
                e.preventDefault()
                if (password.new_password !== password.confirm_password) {
                  toast.error('Passwords do not match', { duration: 1000 })
                  return null
                }
                resetPassword(password.new_password, navigate)
              }}
            >
              <div>
                <label
                  htmlFor='new'
                  className='block text-sm font-medium text-gray-700'
                >
                  New Password
                </label>
                <div className='mt-1'>
                  <input
                    id='new'
                    name='password'
                    type='password'
                    value={password.new_password}
                    required
                    onChange={e =>
                      setPassword({ ...password, new_password: e.target.value })
                    }
                    className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                  />
                </div>
                <label
                  htmlFor='repeat'
                  className='block text-sm font-medium text-gray-700'
                >
                  Repeat Password
                </label>
                <div className='mt-1'>
                  <input
                    id='repeat'
                    name='repeat'
                    type='password'
                    value={password.confirm_password}
                    required
                    onChange={e =>
                      setPassword({
                        ...password,
                        confirm_password: e.target.value
                      })
                    }
                    className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                  />
                </div>
              </div>
              <div>
                <button
                  type='submit'
                  disabled={loading}
                  className='flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
