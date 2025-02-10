import React, { useEffect, useState } from 'react'
import { ArrowLongLeftIcon } from '@heroicons/react/20/solid'
import { Link, useNavigate } from 'react-router-dom'
import { authStore, useAdminStore } from '../../../api/store'
import Mapbox from '../../Mapbox'
import { formatLocationToGP } from '../../../utils/dataFormating'
import { toast } from 'sonner'

export default function AddJob () {
  const { profile, addJob, setDashboard } = useAdminStore()
  const { loading } = authStore()
  const [minEnd, setMinEnd] = useState('')
  const [preview, setPreview] = useState(null)
  const [selectedFile, setSelectedFile] = useState()
  const navigate = useNavigate()

  const [jobDetails, setJobDetails] = useState({
    person_days: 0,
    geotag: [],
    job_deadline: new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
    job_description: '',
    job_name: '',
    job_start_date: new Date().toISOString().slice(0, 10),
    location_id: profile?.location_id?.id,
    sachiv_id: profile?.id,
    work_photo: '28f9377e-9ac1-4a77-be4c-774f47cf36ee'
  })

  function handleChange (e) {
    const { name, value } = e.target
    setJobDetails(prev => ({ ...prev, [name]: value }))
  }

  // function for file preview
  const onSelectFile = e => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined)
      return
    }
    const image = e.target.files[0]
    const imageSize = image.size / 1048576
    if (imageSize > 1) {
      toast.warning('Image size is large, keep it within 1 MB.')
      setSelectedFile(null)
    } else {
      setSelectedFile(image)
    }
  }

  // handle the form submission
  async function handleSubmit (e) {
    try {
      e.preventDefault()
      const data = await addJob({ ...jobDetails, photo: preview })
      await setDashboard()
      navigate('..')
    } catch (err) {
      console.log(err)
    }
  }

  // Set the cordinates of the pin
  function setCords (cords) {
    setJobDetails(prev => ({ ...prev, geotag: cords }))
  }

  // to dynamically change job deadline w.r.t start date
  useEffect(() => {
    const start_date = jobDetails.job_start_date
    var dateObj = new Date(start_date)
    // Add 15 days
    dateObj.setDate(dateObj.getDate() + 15)
    dateObj = dateObj.toISOString().slice(0, 10)
    setMinEnd(dateObj)
    setJobDetails(prev => ({ ...prev, job_deadline: dateObj }))
  }, [jobDetails.job_start_date])

  // for image preview
  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(selectedFile) //represented as a base64string
      reader.onload = () => {
        setPreview(reader.result)
      }
    } else {
      setPreview(null)
    }
  }, [selectedFile])

  return (
    <main className=' relative'>
      {/* Bread crumbing to last url */}
      <Link to='..' className='w-fit'>
        <ArrowLongLeftIcon
          className='h-12 w-12 text-indigo-600'
          aria-hidden='true'
          title='Back to Jobs List'
        />
      </Link>
      <div className='col-span-full w-full'>
        <div className='px-6'>
          <h2 className='text-base font-semibold leading-7 text-gray-900'>
            Add a new job.
          </h2>
          <p className='mt-1 text-sm leading-6 text-gray-600'>
            Fill in the details of job or select from given options in
            respective fields . <strong>All fields are required.</strong>
          </p>
        </div>

        <form className='px-6' onSubmit={handleSubmit}>
          {/* Input fields for jobs details */}
          <div className='mt-4 md:w-1/2'>
            <label
              htmlFor='job_name'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              Job name
            </label>
            <div className='relative mt-1 rounded-md shadow-sm'>
              <input
                type='text'
                required
                name='job_name'
                id='job_name'
                value={jobDetails.job_name}
                onChange={handleChange}
                className='w-full focus:outline-none border-gray-300 rounded-md focus:outline:none sm:text-sm'
                placeholder={`Vrikshaaropan in ${formatLocationToGP(
                  profile?.location_id
                )}`}
                aria-invalid='true'
                aria-describedby='mobile-error'
              />
            </div>
          </div>

          {/* field for job description */}
          <div className='mt-2 md:w-1/2'>
            <label
              htmlFor='job_description'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              Job description
            </label>
            <div className='relative mt-1 rounded-md shadow-sm'>
              <textarea
                type='text'
                required
                name='job_description'
                id='job_description'
                value={jobDetails.job_description}
                onChange={handleChange}
                className='w-full focus:outline-none border-gray-300 rounded-md focus:outline:none sm:text-sm'
                placeholder='Give a brief about job in one or two sentence.'
                aria-invalid='true'
                aria-describedby='mobile-error'
              />
            </div>
          </div>

          {/* Starting job image */}
          <div className='sm:col-span-6 mt-2'>
            <label
              htmlFor='photo'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              Initial work site photo
            </label>
            <div className='mt-1 w-fit rounded-md border-2 border-dashed border-gray-300 p-1'>
              {/* Preview Image if uploaded */}
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
                      <span>Initial Photo</span>
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
              {selectedFile && (
                <div className='preview-cont relative h-[150px] w-[150px]'>
                  <img
                    className='h-[100%] w-[100%]'
                    src={preview}
                    alt='worker image'
                  />
                  <div className='absolute flex flex-col items-center gap-2 top-0 right-0 z-10 p-1'>
                    <label
                      title='Change Image'
                      htmlFor='worker_photo'
                      className='edit-btn cursor-pointer flex items-center justify-center rounded-full h-[24px] w-[24px] bg-gray-200 '
                    >
                      <ion-icon
                        color='primary'
                        name='pencil-outline'
                      ></ion-icon>
                      <input
                        id='worker_photo'
                        name='worker_photo'
                        type='file'
                        multiple={false}
                        accept='image/png, image/jpeg, image/jpg'
                        className='sr-only'
                        onChange={onSelectFile}
                      />
                    </label>
                    {selectedFile && (
                      <button
                        onClick={() => {
                          setSelectedFile(null)
                          setPreview(null)
                        }}
                        title='Cancel'
                        type='button'
                        className='close-btn flex items-center justify-center rounded-full h-[24px] w-[24px] bg-gray-200'
                      >
                        <ion-icon
                          color='danger'
                          name='close-outline'
                        ></ion-icon>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Job start date */}
          <div className='mt-2 w-full grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-3 sm:grid-cols-2'>
            <div>
              <label
                htmlFor='start_date'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Start date
              </label>
              <div className='mt-1'>
                <input
                  id='start_date'
                  name='job_start_date'
                  type='date'
                  value={jobDetails.job_start_date}
                  min={new Date().toISOString().slice(0, 10)}
                  max={new Date(new Date().getFullYear() + 1, 2, 32)
                    .toISOString()
                    .slice(0, 10)}
                  required
                  placeholder='YYYY-MM-DD'
                  onChange={handleChange}
                  className='block w-full appearance-none rounded-md border border-gray-300 px-4 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                />
              </div>
            </div>
            {/* Job end date */}
            <div>
              <label
                htmlFor='end_date'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Expected end date (min 15 days)
              </label>
              <div className='mt-1'>
                <input
                  id='end_date'
                  disabled={jobDetails.job_start_date ? false : true}
                  name='job_deadline'
                  type='date'
                  value={jobDetails.job_deadline}
                  min={minEnd}
                  max={new Date(new Date().getFullYear() + 1, 2, 32)
                    .toISOString()
                    .slice(0, 10)}
                  required
                  placeholder='YYYY-MM-DD'
                  onChange={handleChange}
                  title='select start date to set end date'
                  className={`${
                    jobDetails.job_start_date ? '' : 'cursor-not-allowed'
                  } block w-full appearance-none rounded-md border border-gray-300 px-4 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                />
              </div>
            </div>
          </div>
          {/* field for person days generated */}
          <div className='mt-4 grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-3 sm:grid-cols-2'>
            <div>
              <label
                htmlFor='job_name'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Person days generated
              </label>
              <div className='relative mt-1 rounded-md shadow-sm'>
                <input
                  type='number'
                  required
                  name='person_days'
                  id='person_days'
                  min={10}
                  max={15}
                  value={jobDetails.person_days}
                  onChange={handleChange}
                  className='w-full focus:outline-none border-gray-300 rounded-md focus:outline:none sm:text-sm'
                  placeholder='Expected person day generation'
                  title='Expected person days generation in job.'
                  aria-invalid='true'
                  aria-describedby='mobile-error'
                />
              </div>
            </div>
          </div>
          {/* Drop pin on google map to set geo-tag of work. */}
          <div className='mt-4 w-full'>
            <label
              htmlFor='end_date'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              Drap the pin in map to set job location.
            </label>
            <div className='mt-2 relative'>
              <div className='my-2 w-full grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-3 sm:grid-cols-2'>
                <input
                  type='text'
                  required
                  name='longitude'
                  id='longitude'
                  readOnly
                  value={`Longs: ${
                    jobDetails.geotag[0] ? jobDetails.geotag[0] : 'not set'
                  }`}
                  className='w-full focus:outline-none border-gray-300 rounded-md focus:outline:none sm:text-sm'
                  placeholder='longitude'
                  aria-invalid='true'
                  aria-describedby='mobile-error'
                />
                <input
                  type='text'
                  required
                  name='latitude'
                  id='latitude'
                  readOnly
                  value={`Lats: ${
                    jobDetails.geotag[1] ? jobDetails.geotag[1] : 'not set'
                  }`}
                  className='w-full focus:outline-none border-gray-300 rounded-md focus:outline:none sm:text-sm'
                  placeholder='latitude'
                  aria-invalid='true'
                  aria-describedby='mobile-error'
                />
              </div>
              <Mapbox setCords={setCords} />
            </div>
          </div>

          {/* action buttons */}
          <div className='mt-4 flex items-center justify-end gap-x-6 pb-12'>
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
              Add job
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
