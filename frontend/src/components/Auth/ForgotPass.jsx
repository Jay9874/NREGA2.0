import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authStore } from '../../api/store/authStore'
import { toast } from 'sonner'

export default function ForgotPass () {
  const navigate = useNavigate()
  const { recoverUser, loading } = authStore()

  const [loginInfo, setLoginInfo] = useState({
    email: ''
  })
  async function handleSubmit (e) {
    try {
      e.preventDefault()
      if (loginInfo.email === '')
        return toast.error('Enter an email to send link.')
      const data = await recoverUser(loginInfo.email)
      navigate('/')
    } catch (err) {
      console.error(err)
    }
  }
  return (
    <div className='flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
      <div className='mx-auto w-full max-w-sm lg:w-96'>
        <div className='flex items-center justify-between'>
          <div className='text-sm'>
            {/* back to login link */}
            <Link
              to='/auth/login'
              title='Go back to login page.'
              className='flex items-center stroke-indigo-600 hover:stroke-indigo-500 font-medium text-indigo-600 hover:text-indigo-500'
            >
              <div className='h-8 w-8'>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
                  <path
                    fill='none'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='24'
                    d='M128 384 L12 256 l128 -128 M12 256 h448'
                  />
                </svg>
              </div>
              <p> back to login</p>
            </Link>
          </div>
        </div>
        <div>
          <h2 className='mt-6 text-3xl font-bold tracking-tight text-gray-900'>
            Recover your account
          </h2>
        </div>

        <div className='mt-6'>
          <form className='space-y-6' onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700'
              >
                Your registered email
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

            <div>
              <button
                type='submit'
                disabled={loading}
                className={`flex ${
                  loading
                    ? 'bg-indigo-300 cursor-wait'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } w-full justify-center rounded-md border border-transparent  py-2 px-4 text-sm font-medium text-white shadow-sm  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
              >
                Send Recovery Email
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
