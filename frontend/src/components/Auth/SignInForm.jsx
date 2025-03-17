import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authStore } from '../../api/store/authStore'
import PasswordInput from '../PasswordInput'

export default function SignInForm () {
  const { loginUser, demoLogin, loading } = authStore()
  const crossRef = useRef(null)
  const navigate = useNavigate()
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: ''
  })

  function handleInput (e) {
    const { name, value } = e.target
    setLoginInfo(prev => ({ ...prev, [name]: value }))
  }
  function handleDemo (email, type) {
    demoLogin(email, type, navigate)
  }
  function handleSubmit (e) {
    e.preventDefault()
    loginUser(loginInfo.email, loginInfo.password, navigate)
  }
  useEffect(() => {
    if (crossRef.current) {
      const len = crossRef.current.getTotalLength()
      crossRef.current.style.strokeDasharray = len
    }
  }, [])

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
            <form className='space-y-6' onSubmit={handleSubmit}>
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
                    autoComplete='username'
                    value={loginInfo.email}
                    required
                    onChange={e =>
                      setLoginInfo({ ...loginInfo, email: e.target.value })
                    }
                    className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                  />
                </div>
              </div>
              <PasswordInput
                label='Password'
                name='password'
                id='password'
                value={loginInfo.password}
                hint='Enter your password'
                parentClass='mt-2'
                autoComplete='current-password'
                onChange={handleInput}
              />
              <div className='flex items-center justify-between'>
                <Link
                  to='/auth/recovery'
                  className='font-medium text-sm text-indigo-600 hover:text-indigo-500'
                >
                  Forgot your password?
                </Link>
              </div>
              <button
                type='submit'
                disabled={loading}
                className={`${
                  loading
                    ? 'bg-indigo-300 cursor-wait'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } flex w-full justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
              >
                Sign in
              </button>
            </form>
          </div>
        </div>

        <div className='relative mt-8'>
          <div
            className='absolute inset-0 flex items-center'
            aria-hidden='true'
          >
            <div className='w-full border-t border-gray-300' />
          </div>
          <div className='relative flex justify-center'>
            <span className='bg-white px-2 text-sm text-gray-500'>
              Or take demo
            </span>
          </div>
        </div>

        {/* Demo options */}
        <button
          type='button'
          disabled={loading}
          className='w-full mt-4'
          onClick={() => handleDemo('jayprakashsharma225@gmail.com', 'admin')}
        >
          <div
            className={` ${
              loading ? 'cursor-wait' : ''
            } text-center relative rounded-full py-1 px-3 text-sm leading-6 text-gray-600 ring-1 ring-black/10 hover:ring-black/20`}
          >
            as a Sachiv
          </div>
        </button>

        <button
          type='button'
          disabled={loading}
          className='w-full mt-4'
          onClick={() => handleDemo('jay.gdsc@gmail.com', 'worker')}
        >
          <div
            className={` ${
              loading ? 'cursor-wait' : ''
            } text-center relative rounded-full py-1 px-3 text-sm leading-6 text-gray-600 ring-1 ring-black/10 hover:ring-black/20`}
          >
            as a Worker
          </div>
        </button>
      </div>
    </div>
  )
}
