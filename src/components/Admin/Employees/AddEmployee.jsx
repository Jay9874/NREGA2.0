import React from 'react'
import { Link } from 'react-router-dom'
import { useAdminStore } from '../../../api/store'

export default function AddEmployee () {
  const { lastAddedUser } = useAdminStore()
  console.log(lastAddedUser)
  return (
    <main>
      {/* The Form with all the fields. */}
      <div className='px-6'>
        <h2 className='text-base font-semibold leading-7 text-gray-900'>
          Fill New Worker's Details
        </h2>
        <p className='mt-1 text-sm leading-6 text-gray-600'>
          This information will be will be used only for this system. It won't
          change worker's Bank, Aadhaar and other personal details.
        </p>
      </div>
      <form className=''>
        <div className='space-y-12 px-12'>
          <div className='border-b border-gray-900/10 pb-12'>
            <div className='mt-10'>
              <div className='sm:col-span-4'>
                <label
                  htmlFor='uuid'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Worker ID
                </label>
                <div className='mt-2'>
                  <div className='flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md'>
                  <input
                    type='uuid'
                    name='uuid'
                    id='uuid'
                    value={lastAddedUser.id}
                    disabled
                    className='peer block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm'
                    placeholder='id'
                  />
                  </div>
                </div>
              </div>
              <div className='mt-8 sm:col-span-4'>
                <label
                  htmlFor='cover-photo'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Profile photo
                </label>
                <div className='mt-2 sm:flex items-center gap-6'>
                  <div className='shrink-0 '>
                    <span className='inline-block h-14 w-14 overflow-hidden rounded-full bg-gray-100'>
                      <svg
                        className='h-full w-full text-gray-300'
                        fill='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' />
                      </svg>
                    </span>
                  </div>
                  <label className='block mt-2'>
                    <span className='sr-only'>Choose profile photo</span>
                    <input
                      type='file'
                      className='block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                 file:bg-violet-50 file:text-violet-700
                   hover:file:bg-violet-100'
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className='border-b border-gray-900/10 pb-12'>
            <h2 className='text-base font-semibold leading-7 text-gray-900'>
              Personal Information
            </h2>
            <p className='mt-1 text-sm leading-6 text-gray-600'>
              Use a permanent address where you can receive mail.
            </p>

            <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
              <div className='sm:col-span-3'>
                <label
                  htmlFor='first-name'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  First name
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    name='first-name'
                    id='first-name'
                    autoComplete='given-name'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>
              {/* Last Name */}
              <div className='sm:col-span-3'>
                <label
                  htmlFor='last-name'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Last name
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    name='last-name'
                    id='last-name'
                    autoComplete='family-name'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>
              {/* Father's Name */}
              <div className='sm:col-span-3'>
                <label
                  htmlFor='father-name'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Father Name
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    name='fatherName'
                    id='father-name'
                    autoComplete='family-name'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>
              {/* Email address */}
              <div className='sm:col-span-4'>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Email address
                </label>
                <div className='mt-2'>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    autoComplete='email'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>
              {/* Aadhaar number */}
              <div className='col-span-full'>
                <label
                  htmlFor='aadhaar'
                  className='block text-sm font-medium text-gray-700'
                >
                  Aadhaar Number
                </label>
                <div className='mt-1'>
                  <input
                    type='text'
                    name='aadhaar'
                    id='aadhaar'
                    className='block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm'
                    placeholder='0000-0000-0000'
                  />
                </div>
              </div>
              {/* Age */}
              <div className='col-span-full'>
                <label
                  htmlFor='age'
                  className='block text-sm font-medium text-gray-700'
                >
                  Age
                </label>
                <div className='mt-1'>
                  <input
                    type='text'
                    name='age'
                    id='age'
                    className='block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm'
                    placeholder='00'
                  />
                </div>
              </div>
              {/* Bank Account Number */}
              <div className='col-span-full'>
                <label
                  htmlFor='acc'
                  className='block text-sm font-medium text-gray-700'
                >
                  Bank Acc. No
                </label>
                <div className='mt-1'>
                  <input
                    type='text'
                    name='acc'
                    id='acc'
                    className='block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm'
                    placeholder='12 or 16 digit'
                  />
                </div>
              </div>
              {/* Street Address */}
              <div className='col-span-full'>
                <label
                  htmlFor='street-address'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Street address
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    name='street-address'
                    id='street-address'
                    autoComplete='street-address'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>
              {/* Location ID */}
              <div className='sm:col-span-2 sm:col-start-1'>
                <label
                  htmlFor='location_id'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Location ID
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    name='location_id'
                    id='location_id'
                    disabled
                    className='peer block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm'
                    placeholder='id'
                  />
                  <p className='mt-2 invisible peer-disabled:visible text-gray-600 text-sm'>
                    Autofilled
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-6 flex items-center justify-end gap-x-6 pb-12'>
            <Link
              to='..'
              className='text-sm font-semibold leading-6 text-gray-900'
            >
              Cancel
            </Link>
            <button
              type='submit'
              className='rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </main>
  )
}
