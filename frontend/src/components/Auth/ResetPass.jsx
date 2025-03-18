import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { authStore } from '../../api/store/authStore'
import { toast } from 'sonner'
import PasswordInput from '../PasswordInput'

export default function ResetPass () {
  const [searchParams] = useSearchParams()
  const [params, setParams] = useState({})
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
  async function handleSubmit (e) {
    try {
      e.preventDefault()
      if (password.new_password !== password.confirm_password) {
        toast.error('Passwords do not match', { duration: 1000 })
        return null
      }
      if (!params) {
        return toast.error('Invalid token, try creating a new one.')
      }
      const data = await resetPassword(password.new_password, params)
      navigate(`/${data.type}/dashboard`)
    } catch (err) {
      console.log(err)
      toast.error(err)
    }
  }

  useEffect(() => {
    const token_hash = searchParams.get('token_hash')
    const error = searchParams.get('error')
    if (error) {
      const error_desc = searchParams.get('error_description')
      toast.error(error_desc)
      setParams(null)
    } else if (!token_hash) {
      toast.error('Link is invalid, create a new one.')
      setParams(null)
    } else if (token_hash !== '') {
      const token_hash = searchParams.get('token_hash')
      const email = searchParams.get('email')
      const type = searchParams.get('type')
      setParams({ token_hash, email, type })
    }
  }, [searchParams])
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
            <form className='space-y-6' onSubmit={handleSubmit}>
              <div>
                <PasswordInput
                  label='New Password'
                  name='new_password'
                  id='new_password'
                  value={password.new_password}
                  hint='Enter your new password'
                  autoComplete='new-password'
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
                  autoComplete='new-password'
                  parentClass='mt-2'
                />
              </div>
              <input hidden name='token' value={params} required readOnly />
              <div className='flex items-center justify-between'>
                <div className='text-sm'>
                  <Link
                    to='/auth/login'
                    className='flex justify-center items-center gap-2 font-medium text-indigo-600 hover:text-indigo-500'
                  >
                    <ion-icon
                      size='large'
                      name='arrow-back-circle-outline'
                    ></ion-icon>
                    Back to login
                  </Link>
                </div>
              </div>
              <div>
                <button
                  type='submit'
                  disabled={loading}
                  className={`${
                    loading
                      ? 'bg-indigo-300 cursor-wait'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  } flex w-full justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
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
