'use client'
import React, { useEffect, useState } from 'react'
import {
  useOutletContext,
  useParams,
  Link,
  useNavigate
} from 'react-router-dom'
import { useWorkerStore } from '../../api/store'
import AdminCard from '../Skeleton/AdminCard'
import { toast } from 'sonner'

export default function EnrollJob () {
  const [timeDuration, setTimeDuration] = useState()
  const [loadingJobDetail, setLoadingJobDetail] = useState(true)
  const [startDate, setStartDate] = useState()
  const { jobId } = useParams()
  var [sachivId, jobToEnroll] = useOutletContext()
  const navigate = useNavigate()
  const { applyToJob, nearbyJobs } = useWorkerStore()

  async function sendApplication () {
    try {
      toast.loading('Sending application...')
      setLoadingJobDetail(true)
      const data = await applyToJob(jobId, sachivId, startDate, timeDuration)
      toast.dismiss()
      toast.success('Applied for job successfully.')
      navigate('..')
    } catch (err) {
      console.log(err)
      return toast.error('Something went wrong.')
    }
  }

  useEffect(() => {
    jobToEnroll = nearbyJobs.filter((job, index) => job.job_id == jobId)[0]
    sachivId = jobToEnroll?.sachiv_id
    setLoadingJobDetail(false)
  }, [jobId])
  return (
    <div className='overlay-modal z-10 overscroll-contain h-[100vh] overflow-scroll fixed w-full z-20 bg-gray-300 bg-opacity-90'>
      <div className='flex justify-center px-4 py-6'>
        {loadingJobDetail ? (
          <h1>Loading...</h1>
        ) : (
          <div className='rounded-lg bg-white'>
            <div className='flex w-full items-center gap-2 flex-wrap justify-between p-6'>
              <div className='flex-1'>
                <div className='flex items-center space-x-3'>
                  <h3 className='text-sm font-medium text-gray-900'>
                    {jobToEnroll?.job_name}
                  </h3>
                  <span className='inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800'>
                    {jobToEnroll?.locationObj.gp} GP
                  </span>
                </div>
                <p className='mt-1 truncate text-sm text-gray-500'>
                  Distance: {jobToEnroll?.locationObj.dist} Km
                </p>
                {/* <p className='mt-1 truncate text-sm text-gray-500'>
                  Live: {`${work?.live?.lat}, ${work?.live?.long}`}
                </p>
                <p className='mt-1 truncate text-sm text-gray-500'>
                  {work?.date}
                </p> */}
              </div>
            </div>
            <form className='p-6'>
              <div>
                <label
                  htmlFor='time_duration'
                  className='block text-sm font-medium text-gray-700'
                >
                  Job duration
                </label>
                <div className='mt-1'>
                  <input
                    id='time_duration'
                    name='time_duration'
                    type='text'
                    value={timeDuration}
                    required
                    placeholder='max 15 day'
                    onChange={e => setTimeDuration(e.target.value)}
                    className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                  />
                </div>
              </div>
              <div className='mt-2'>
                <label
                  htmlFor='start_date'
                  className='block text-sm font-medium text-gray-700'
                >
                  Start date
                </label>
                <div className='mt-1'>
                  <input
                    id='start_date'
                    name='start_date'
                    type='text'
                    value={startDate}
                    required
                    placeholder='YYYY-MM-DD'
                    onChange={e => setStartDate(e.target.value)}
                    className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                  />
                </div>
              </div>
            </form>
            <div className='no-scrollbar py-4 px-6 sticky w-full z-10 bottom-0 flex items-center gap-4 justify-center backdrop-blur backdrop-filter bg-gray-50 bg-opacity-75'>
              <button
                disabled={loadingJobDetail}
                className='w-full inline-flex items-center justify-center rounded-full border border-transparent bg-red-100 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200 bg-opacity-75'
              >
                <Link to='..' type='button' className='w-full'>
                  Cancel
                </Link>
              </button>
              <button
                onClick={() =>
                  sendApplication(jobId, sachivId, startDate, timeDuration)
                }
                disabled={loadingJobDetail}
                className='w-full inline-flex items-center justify-center rounded-full border border-transparent bg-indigo-100 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-200 bg-opacity-75'
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
