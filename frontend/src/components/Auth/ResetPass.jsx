import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authStore } from '../../api/store/authStore'
import { toast } from 'sonner'
import PasswordInput from '../PasswordInput'

export default function ResetPass () {
  const navigate = useNavigate()
  const { resetPassword, loading } = authStore()
  const [password, setPassword] = useState({
    new_password: '',
    confirm_password: ''
  })
  function handleInput (e) {
    const { name, value } = e.target
    setPassword(prev => ({ ...prev, [name]: value }))
  }
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
                <PasswordInput
                  label='New Password'
                  name='new_password'
                  id='new_password'
                  value={password.new_password}
                  hint='Enter your new password'
                  onChange={handleInput}
                  parentClass='mt-2'
                />
               
                <PasswordInput
                  label='Repeat Password'
                  name='confirm_password'
                  id='confirm_password'
                  value={password.confirm_password}
                  hint='Retype your new password'
                  onChange={handleInput}
                  parentClass='mt-2'
                />
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
