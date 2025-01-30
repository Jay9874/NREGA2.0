import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLongLeftIcon, PhotoIcon } from '@heroicons/react/24/solid'
import { useAdminStore } from '../../../api/store'

export default function EditEmployee () {
  const { id } = useParams()
  const { employees } = useAdminStore()
  const [selectedFile, setSelectedFile] = useState()
  const [loading, setLoading] = useState()
  const [employee, setEmployee] = useState()
  const [preview, setPreview] = useState()
  const [profile, setProfile] = useState({
    email: '',
    mobile: '',
    image: ''
  })

  // function for file preview
  const onSelectFile = e => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined)
      return
    }
    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0])
  }

  function handleChange (e) {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }
  useEffect(() => {
    const [currEmployee] = employees.filter((emp, index) => emp.id == id)
    setEmployee(currEmployee)
    setProfile({
      email: currEmployee.email,
      mobile: currEmployee.mobile_no,
      image: currEmployee.photo
    })
  }, [])

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined)
      return
    }
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

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
          <h1 className='text-lg font-semibold text-gray-900'>Edit Profile</h1>
          <p className='text-sm text-gray-700'>
            Update the worker profile of
            <b> {employee?.first_name + ' ' + employee?.last_name}.</b>
          </p>
        </div>
        <form>
          {/* Input fields */}
          <div className='mt-2 md:w-1/2'>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'
            >
              New email
            </label>
            <div className='relative mt-1 rounded-md shadow-sm'>
              <input
                type='email'
                required
                name='email'
                id='email'
                value={profile.email}
                onChange={handleChange}
                className='w-full focus:outline-none border-gray-300 rounded-md focus:outline:none valid:text-green-600 sm:text-sm'
                placeholder={employee?.email}
                aria-invalid='true'
                aria-describedby='email-error'
              />
            </div>
          </div>
          {/* New mobile number */}
          <div className='mt-2 md:w-1/2'>
            <label
              htmlFor='mobile'
              className='block text-sm font-medium text-gray-700'
            >
              New mobile number
            </label>
            <div className='relative mt-1 rounded-md shadow-sm'>
              <input
                type='text'
                required
                name='mobile'
                id='mobile'
                value={profile.mobile}
                onChange={handleChange}
                className='w-full focus:outline-none border-gray-300 rounded-md focus:outline:none valid:text-green-600 sm:text-sm'
                placeholder={employee?.mobile_no}
                aria-invalid='true'
                aria-describedby='mobile-error'
              />
            </div>
          </div>
          <div className='sm:col-span-6 mt-2'>
            <label
              htmlFor='mobile'
              className='block text-sm font-medium text-gray-700'
            >
              New photo
            </label>
            <div
              className={`mt-1 w-fit rounded-md border-2 border-dashed border-gray-300 ${
                selectedFile ? 'p-1' : 'px-6 pt-5 pb-6'
              } `}
            >
              {!selectedFile && (
                <div className='space-y-1 text-center'>
                  <svg
                    className='mx-auto h-12 w-12 text-gray-400'
                    stroke='currentColor'
                    fill='none'
                    viewBox='0 0 48 48'
                    aria-hidden='true'
                  >
                    <path
                      d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                      strokeWidth={2}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  <div className='flex text-sm text-gray-600'>
                    <label
                      htmlFor='file-upload'
                      className='relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500'
                    >
                      <span>New photo</span>
                      <input
                        id='file-upload'
                        name='file-upload'
                        type='file'
                        required
                        accept='image/png, image/jpeg, image/jpg'
                        className='sr-only'
                        onChange={onSelectFile}
                      />
                    </label>
                  </div>
                  <p className='text-xs text-gray-500'>
                    PNG, or JPG up to 10MB
                  </p>
                </div>
              )}

              {/* Preview Image if uploaded */}
              {selectedFile && (
                <div className='preview-cont relative h-[150px] w-[150px]'>
                  <img
                    className='h-[100%] w-[100%]'
                    src={preview}
                    alt='Progress photo'
                  />
                  <div className='absolute flex flex-col items-center gap-2 top-0 right-0 z-10 p-1'>
                    <label
                      title='Change Image'
                      className='edit-btn cursor-pointer flex items-center justify-center rounded-full h-[24px] w-[24px] bg-gray-200 '
                    >
                      <ion-icon
                        color='primary'
                        name='pencil-outline'
                      ></ion-icon>
                      <input
                        id='file-upload'
                        name='file-upload'
                        type='file'
                        accept='image/png, image/jpeg, image/jpg'
                        className='sr-only'
                        onChange={onSelectFile}
                      />
                    </label>
                    <button
                      onClick={() => setSelectedFile(null)}
                      title='Cancel'
                      className='close-btn flex items-center justify-center rounded-full h-[24px] w-[24px] bg-gray-200 '
                    >
                      <ion-icon color='danger' name='close-outline'></ion-icon>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* action buttons */}
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
      </div>
    </>
  )
}
