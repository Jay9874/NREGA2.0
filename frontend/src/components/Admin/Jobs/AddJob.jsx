import React, { useEffect, useState } from 'react'
import { ArrowLongLeftIcon } from '@heroicons/react/20/solid'
import { Link, useNavigate } from 'react-router-dom'
import { authStore, useAdminStore } from '../../../api/store'
import Mapbox from '../../Mapbox'
import { formatLocationToGP } from '../../../utils/dataFormating'

export default function AddJob () {
  const { jobs, profile, addJob, setDashboard } = useAdminStore()
  const { loading } = authStore()
  const [minEnd, setMinEnd] = useState('')
  const navigate = useNavigate()
  const [jobDetails, setJobDetails] = useState({
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

  // handle the form submission
  async function handleSubmit (e) {
    try {
      e.preventDefault()
      const data = await addJob(jobDetails)
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

  return (
    <main className=' relative'>
      {/* Bread crumbing to last url */}
      <Link to='..' className='w-fit'>
        <ArrowLongLeftIcon
          className='h-12 w-12 text-indigo-600'
          aria-hidden='true'
          title='Back to Employees List'
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
          <div className='mt-2 md:w-1/2'>
            <label
              htmlFor='job_name'
              className='block text-sm font-medium text-gray-700'
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

          <div className='mt-2 md:w-1/2'>
            <label
              htmlFor='job_description'
              className='block text-sm font-medium text-gray-700'
            >
              Job description
            </label>
            <div className='relative mt-1 rounded-md shadow-sm'>
              <input
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

          {/* Job start date */}
          <div className='mt-2 w-fit'>
            <label
              htmlFor='start_date'
              className='block text-sm font-medium text-gray-700'
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

          {/* Calendar input for job end date */}
          <div className='mt-2 w-fit'>
            <label
              htmlFor='end_date'
              className='block text-sm font-medium text-gray-700'
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

          {/* Drop pin on google map to set geo-tag of work. */}
          <div className='mt-2 w-full'>
            <label
              htmlFor='end_date'
              className='block text-sm font-medium text-gray-700'
            >
              Drap the pin to set job location.
            </label>
            <div className='h-96 w-full mt-2 relative'>
              <Mapbox setCords={setCords} />
            </div>
          </div>

          {/* action buttons */}
          <div className='mt-12 flex items-center justify-end gap-x-6 pb-12'>
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
