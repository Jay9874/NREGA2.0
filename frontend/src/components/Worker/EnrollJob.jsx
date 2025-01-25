'use client'
import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { authStore, useWorkerStore } from '../../api/store'
import { toast } from 'sonner'
import { timestampToDate } from '../../utils/dataFormating'

export default function EnrollJob () {
  const [timeDuration, setTimeDuration] = useState(15)
  const [loadingJobDetail, setLoadingJobDetail] = useState(true)
  const [entitlement, setEntitlement] = useState()
  const [job, setJob] = useState({})
  const [startDate, setStartDate] = useState('')
  const { jobId } = useParams()
  const navigate = useNavigate()
  const { applyToJob, nearbyJobs, setNearbyJobs } = useWorkerStore()
  const { user } = authStore()
  const [disabled, setDisabled] = useState('minus')

  async function sendApplication (e) {
    try {
      e.preventDefault()
      toast.loading('Sending application...')
      setLoadingJobDetail(true)
      const data = await applyToJob(
        jobId,
        job.sachiv_id,
        startDate,
        timeDuration
      )
      toast.dismiss()
      toast.success(`Successfully applied to "${job.job_name}".`)
      setNearbyJobs()
      navigate('..')
    } catch (err) {
      console.log(err)
      setLoadingJobDetail(false)
      toast.dismiss()
      toast.error('Something went wrong.')
    }
  }
  async function setupJobDetail () {
    try {
      const currJob = nearbyJobs.filter((job, index) => job.job_id == jobId)[0]
      setJob(currJob)
      const options = {
        method: 'POST',
        body: JSON.stringify({ workerId: user?.id }),
        credentials: 'include',
        headers: {
          'Content-Type': 'Application/json',
          Accept: 'Application/json'
        }
      }
      const res = await fetch(`/api/worker/entitlement`, options)
      const { data, error } = await res.json()
      if (error) throw error
      setEntitlement(data?.entitlement)
      if (timeDuration == entitlement) setDisabled('all')
      setLoadingJobDetail(false)
    } catch (err) {
      console.log(err)
      setLoadingJobDetail(false)
    }
  }

  function handleDuration (e) {
    const { name } = e.target
    if (name == 'add-outline') {
      if (timeDuration < entitlement)
        setTimeDuration(prev => {
          if (prev == 15 && timeDuration < entitlement) setDisabled('none')
          if (prev == entitlement - 1) setDisabled('plus')
          return (prev += 1)
        })
    } else {
      if (timeDuration >= 16)
        setTimeDuration(prev => {
          if (prev > 16) setDisabled('none')
          else setDisabled('minus')
          return (prev -= 1)
        })
    }
  }
  useEffect(() => {
    setupJobDetail()
  }, [jobId])
  return (
    <div className='h-[100vh] overflow-scroll top-0 md:w-[calc(100%-256px)] w-full backdrop-blur-sm fixed z-20 bg-gray-300 bg-opacity-75'>
      <div className='flex justify-center items-center min-h-full px-4 pb-6 pt-[70px] overflow-scroll'>
        <div className='rounded-lg w-96 bg-white'>
          <div className='flex w-full items-center gap-2 flex-wrap justify-between p-6'>
            <div className='flex-1'>
              <h2 className='mb-4 font-medium'>
                Job application <span className='text-gray-500'>in</span>
              </h2>
              <div className='flex items-center space-x-3'>
                <div>
                  <h3 className='text-sm font-medium text-gray-900'>
                    {job?.job_name}
                  </h3>
                  <p className='text-xs text-gray-700'>
                    <i>_{job.job_description}</i>
                  </p>
                </div>
                <span className='inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800'>
                  {job?.locationObj?.gp} GP
                </span>
              </div>
              <p className='mt-1 truncate text-sm text-gray-500'>
                Distance:{' '}
                <span className='text-indigo-700 font-medium'>
                  {job?.locationObj?.dist} Km
                </span>
              </p>
              <p className='mt-1 truncate text-sm text-gray-500'>
                Inauguration:{' '}
                <span className='text-gray-700'>
                  {timestampToDate(job.job_start_date)}
                </span>
              </p>
              <p className='mt-1 truncate text-sm text-gray-500'>
                Entitlement:{' '}
                <span className='text-gray-700'>{entitlement} days left</span>
              </p>
            </div>
          </div>
          <form className='p-6' onSubmit={sendApplication}>
            <div>
              <p className='block text-sm font-medium text-gray-700'>
                Work duration
              </p>
              <div className='mt-1 flex w-full justify-center items-center gap-4'>
                <button
                  type='button'
                  name='remove'
                  onClick={handleDuration}
                  disabled={disabled == 'minus' || disabled == 'all'}
                  className={`p-2 flex justify-center items-center ${
                    disabled == 'minus' || disabled == 'all'
                      ? 'bg-transparent'
                      : 'bg-gray-100'
                  }  rounded-md`}
                >
                  <ion-icon name='remove-outline'></ion-icon>
                </button>
                <p className='text-sm text-gray-500'>{timeDuration} day</p>
                <button
                  type='button'
                  name='add'
                  disabled={disabled == 'plus' || disabled == 'all'}
                  onClick={handleDuration}
                  className={`p-2 flex justify-center items-center ${
                    disabled == 'plus' || disabled == 'all'
                      ? 'bg-transparent'
                      : 'bg-gray-100'
                  }  rounded-md`}
                >
                  <ion-icon name='add-outline'></ion-icon>
                </button>
              </div>
            </div>
            <div className='mt-2'>
              <label
                htmlFor='start_date'
                className='block text-sm font-medium text-gray-700'
              >
                Joining date
              </label>
              <div className='mt-1'>
                <input
                  id='start_date'
                  name='start_date'
                  type='date'
                  value={startDate}
                  min={new Date().toISOString().slice(0, 10)}
                  max={new Date(new Date().getFullYear() + 1, 2, 32)
                    .toISOString()
                    .slice(0, 10)}
                  required
                  placeholder='YYYY-MM-DD'
                  onChange={e => setStartDate(e.target.value)}
                  className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                />
              </div>
            </div>
            <div className='pt-4 rounded-b-lg w-full flex items-center gap-4 justify-center'>
              <button
                disabled={loadingJobDetail}
                className='w-full inline-flex items-center justify-center rounded-full border border-transparent bg-red-100 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200 bg-opacity-75'
              >
                <Link to='..' type='button' className='w-full'>
                  Cancel
                </Link>
              </button>
              <button
                type='submit'
                disabled={loadingJobDetail}
                className='w-full inline-flex items-center justify-center rounded-full border border-transparent bg-indigo-100 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-200 bg-opacity-75'
              >
                Apply
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
