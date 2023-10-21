import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authStore } from '../../api/store/store'
import formImg from '../../assets/images/mgn.webp'

export default function SignInForm () {
  const navigate = useNavigate()
  const { loginUser } = authStore()

  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: ''
  })

  return (
    <>
      <div className='flex min-h-full'>
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

                  {/* <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-700">
                      Login as
                    </div>
                    <div className="flex items-center gap-5">
                      <div className="flex items-center">
                        <input
                          id="worker"
                          name="worker"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          value='worker'
                          onChange={(e) => setLoginInfo({...loginInfo, userType: e.target.value })}
                          checked={loginInfo.userType === 'worker'}
                        />
                        <label
                          htmlFor="worker"
                          className="ml-2 block text-sm text-gray-900"
                        >
                          Worker
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="admin"
                          name="admin"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          value='admin'
                          onChange={(e) => setLoginInfo({...loginInfo, userType: e.target.value })}
                          checked={loginInfo.userType === 'admin'}
                        />
                        <label
                          htmlFor="admin"
                          className="ml-2 block text-sm text-gray-900"
                        >
                          Admin
                        </label>
                      </div>
                    </div>
                  </div> */}

                  <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                      <input
                        id='remember-me'
                        name='remember-me'
                        type='checkbox'
                        className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
                      />
                      <label
                        htmlFor='remember-me'
                        className='ml-2 block text-sm text-gray-900'
                      >
                        Remember me
                      </label>
                    </div>

                    <div className='text-sm'>
                      <a
                        href='#'
                        className='font-medium text-indigo-600 hover:text-indigo-500'
                      >
                        Forgot your password?
                      </a>
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
        <div className='relative hidden w-0 flex-1 lg:block'>
          <img
            // className='absolute inset-0 h-full w-full object-cover'
            className='absolute inset-0 -z-10 h-full w-full object-cover'
            src={formImg}
            alt='Kaamgaar'
          />
        </div>
      </div>
    </>
  )
}
