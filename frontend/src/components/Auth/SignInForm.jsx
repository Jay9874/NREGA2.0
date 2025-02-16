import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authStore } from '../../api/store/authStore'
import HCaptcha from '@hcaptcha/react-hcaptcha'
const sitekey = import.meta.env.VITE_CAPTCHA_SITE_KEY

export default function SignInForm () {
  const { loginUser, demoLogin, setCaptchaToken } = authStore()
  const [showPassword, setShowPassword] = useState(false)
  const crossRef = useRef(null)
  const navigate = useNavigate()
  const captcha = useRef()
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: ''
  })
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

  function handleEyeBtn (e) {
    console.log('clicked eye')
    if (showPassword) {
      setShowPassword(false)
    } else {
      setShowPassword(true)
    }
  }

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

              <div className='mt-2'>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-700'
                >
                  Password
                </label>
                <div className='mt-1 flex rounded-md shadow-sm'>
                  <div className='relative flex flex-grow items-stretch focus-within:z-10'>
                    <input
                      className='block w-full rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                      type={`${showPassword ? 'text' : 'password'}`}
                      name='password'
                      id='password'
                      required
                      value={loginInfo.password}
                      onChange={e =>
                        setLoginInfo({ ...loginInfo, password: e.target.value })
                      }
                      placeholder='atleast 8 digit'
                      aria-describedby='password-description'
                      autoComplete='new-password'
                    />
                  </div>
                  <button
                    type='button'
                    onClick={handleEyeBtn}
                    className='relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
                  >
                    <svg
                      width='20'
                      height='15'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      
                      <path
                        className='stroke-gray-400'
                        d='M2.5 7.5 a 8.5 8.5 0 0 1 15 0 a 8.5 8.5 0 0 1 -15 0 z'
                        fill='transparent'
                      />
      
                      <circle
                        className='fill-gray-400'
                        cx='10'
                        cy='7.5'
                        r={3}
                      />
                      {/* the indicator */}
                      <path
                        ref={crossRef}
                        className={`eye-btn ${
                          showPassword ? 'strike-off' : 'strike'
                        } fill-gray-400 stroke-gray-400`}
                        d='M3 0.5 l 14 14'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </button>
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
        <div className='mt-4 mb-4 '>
          <Link
            onClick={() => handleDemo('jayprakashsharma225@gmail.com', 'admin')}
          >
            <div className='text-center relative rounded-full py-1 px-3 text-sm leading-6 text-gray-600 ring-1 ring-black/10 hover:ring-black/20'>
              as a Sachiv
            </div>
          </Link>
        </div>
        <div className=''>
          <Link onClick={() => handleDemo('jay.gdsc@gmail.com', 'worker')}>
            <div className='text-center relative rounded-full py-1 px-3 text-sm leading-6 text-gray-600 ring-1 ring-black/10 hover:ring-black/20'>
              as a Worker
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
