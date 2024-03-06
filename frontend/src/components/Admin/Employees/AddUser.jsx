import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminStore } from '../../../api/store'
import { toast } from 'sonner'

export default function AddUser({ onUserCreation }) {
  const { addUser, loading } = useAdminStore()
  const [user, setUser] = useState({
    email: '',
    password: '',
  })
  const [lockInput, setLockInput] = useState(false)
  function handleChange(e) {
    const { name, value } = e.target
    setUser((prev) => ({ ...prev, [name]: value }))
  }
  async function handleSubmit(e) {
    try {
      e.preventDefault()
      if (!user.email) {
        throw new Error('Please enter a valid Email ID.')
      }
      if (user.password.length < 8)
        throw new Error('Password must be atleast 8 digit long.')
      const newUser = await addUser(user)
      setLockInput(true)
      onUserCreation(newUser)
    } catch (error) {
      return toast.error(error.message)
    }
  }
  return (
    <main>
      <div className='px-6'>
        <h2 className='text-base font-semibold leading-7 text-gray-900'>
          First Add a New User
        </h2>
        <p className='mt-1 text-sm leading-6 text-gray-600'>
          Fill in the actual Email ID of Worker and a strong Password.
        </p>
      </div>
      <form className='px-12' onSubmit={handleSubmit}>
        {/* Email Field */}
        <div className='mt-2 md:w-1/2'>
          <label
            htmlFor='email'
            className='block text-sm font-medium text-gray-700'
          >
            Email
          </label>
          <div className='relative mt-1 rounded-md shadow-sm'>
            <input
              type='email'
              name='email'
              id='email'
              value={user.email}
              onChange={handleChange}
              className='block w-full border-gray-300 rounded-md invalid:border-pink-500 invalid:text-pink-600
                         focus:invalid:border-pink-500 focus:invalid:ring-pink-500 sm:text-sm'
              placeholder='you@example.com'
              aria-invalid='true'
              aria-describedby='email-error'
              disabled={lockInput}
            />
          </div>
          <p className='mt-2 text-sm text-yellow-500' id='email-error'>
            It will be used as username for logging in.
          </p>
        </div>
        {/* Password */}
        <div className='mt-2 md:w-1/2'>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-gray-700'
          >
            Password
          </label>
          <div className='mt-1'>
            <input
              type='password'
              name='password'
              id='password'
              value={user.password}
              onChange={handleChange}
              className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
              placeholder='atleast 8 digit'
              aria-describedby='password-description'
              autoComplete='new-password'
              disabled={lockInput}
            />
          </div>
          <p className='mt-2 text-sm text-yellow-500' id='email-description'>
            Atleast 8 characters long. It will be used as password for logging
            in.
          </p>
        </div>
        {/* Action buttons */}
        <div className='mt-6 flex items-center justify-end gap-x-6 pb-12'>
          <Link
            to='..'
            className='rounded-md text-sm font-semibold leading-6 px-3 py-2 text-gray-900 hover:bg-gray-200'
          >
            Cancel
          </Link>
          <button
            type='submit'
            disabled={loading}
            className={`rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold
             text-white shadow-sm ${
               !loading
                 ? 'hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                 : 'cursor-not-allowed'
             } `}
          >
            Continue
          </button>
        </div>
      </form>
    </main>
  )
}
