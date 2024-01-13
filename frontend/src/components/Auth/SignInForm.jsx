import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authStore } from '../../api/store/store'

export default function SignInForm () {
  const navigate = useNavigate()
  const { loginUser } = authStore()

  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: ''
  })

  return (
    <div className='flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
      <div className='mx-auto w-full max-w-sm lg:w-96'>
        <div>
          <h2 className='mt-6 text-3xl font-bold tracking-tight text-gray-900'>
            Sign in to your account
          </h2>
        </div>

        <div className='mt-8'>
          <div className='mt-6'>
            <form
              className='space-y-6'
              onSubmit={e => {
                e.preventDefault()
                loginUser(loginInfo.email, loginInfo.password, navigate)
              }}
            >
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700'
                >
                  Email address
                </label>
                <div className='mt-1'>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    autoComplete='email'
                    value={loginInfo.email}
                    required
                    onChange={e =>
                      setLoginInfo({ ...loginInfo, email: e.target.value })
                    }
                    className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                  />
                </div>
              </div>

              <div className='space-y-1'>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-700'
                >
                  Password
                </label>
                <div className='mt-1'>
                  <input
                    id='password'
                    name='password'
                    type='password'
                    autoComplete='current-password'
                    required
                    value={loginInfo.password}
                    onChange={e =>
                      setLoginInfo({
                        ...loginInfo,
                        password: e.target.value
                      })
                    }
                    className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                  />
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <div className='text-sm'>
                  <Link
                    to='/auth/recovery'
                    className='font-medium text-indigo-600 hover:text-indigo-500'
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type='submit'
                  className='flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
