import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLongLeftIcon, PhotoIcon } from '@heroicons/react/24/solid'

export default function EditEmployee() {
  const { id } = useParams()
  return (
    <>
      <Link to='..'>
        <ArrowLongLeftIcon
          className='h-12 w-12 text-indigo-600'
          aria-hidden='true'
          title='Back to Employees List'
        />
      </Link>
      <div className='col-span-full px-6'>
        <div className='sm:flex-auto'>
          <h1 className='text-xl font-semibold text-gray-900'>Profile</h1>
          <p className='mt-2 text-sm text-gray-700'>
            You can only update profile photo.
          </p>
        </div>
        <div className='px-6 mx-auto w-1/2 mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 py-10'>
          <div className='text-center'>
            <PhotoIcon
              className='mx-auto h-12 w-12 text-gray-300'
              aria-hidden='true'
            />
            <div className='mt-4 flex text-sm leading-6 text-gray-600'>
              <label
                htmlFor='file-upload'
                className='relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500'
              >
                <span>Upload a file</span>
                <input
                  id='file-upload'
                  name='file-upload'
                  type='file'
                  className='sr-only'
                />
              </label>
              <p className='pl-1'>or drag and drop</p>
            </div>
            <p className='text-xs leading-5 text-gray-600'>
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
