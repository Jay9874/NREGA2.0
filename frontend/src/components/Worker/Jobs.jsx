import { toast } from 'sonner'
import { useWorkerStore } from '../../api/store'
import DynamicTable from '../DynamicTable'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { jobDuration, timestampToDate } from '../../utils/dataFormating'
import HighlightGrid from '../highlightGrid'

const tableHeading = [
  { name: 'Work', css_normal: '', css_list: '' },
  {
    name: 'Location',
    css_normal: 'lg:table-cell hidden',
    css_list: 'lg:table-cell'
  },
  {
    name: 'Deadline',
    css_normal: 'md:table-cell hidden',
    css_list: 'md:hidden'
  },
  {
    name: 'Started',
    css_normal: 'sm:table-cell hidden',
    css_list: 'sm:hidden'
  },
  { name: 'Status', css_normal: '', css_list: 'hidden' }
]

const statusStyles = {
  enrolled: 'bg-indigo-100 text-indigo-800',
  applied: 'bg-yellow-100 text-yellow-800',
  rejected: 'bg-red-100 text-red-800',
  completed: 'bg-green-100 text-green-800',
  'working on': 'bg-indigo-100 text-indigo-800'
}

const Jobs = () => {
  const { lastWork, nearbyJobs, currentlyEnrolled } = useWorkerStore()
  const [updatedJobs, setUpdatedJobs] = useState()
  const navigate = useNavigate()

  const highlight = [
    {
      label: 'Your presence',
      value: `${lastWork.presence}/${lastWork.duration} Day`
    },
    { label: 'Labours', value: lastWork.labours },
    { label: 'Completion', value: `${lastWork.completion}%` },
    { label: 'Deadline', value: lastWork.deadline }
  ]
  function jobProfile (jobId, sachivId, job) {
    if (currentlyEnrolled) {
      return toast.message('You are currently enrolled in', {
        description: `'${currentlyEnrolled.jobName}' from ${currentlyEnrolled.start} to ${currentlyEnrolled.end}.`
      })
    }
    return navigate(`enroll/${jobId}`)
  }

  useEffect(() => {
    // Modifying nearbyJobs object to fit in frontend
    const jobsArr = nearbyJobs.map(job => ({
      ...job,
      Work: job.job_name,
      Location: (
        <span>
          <span className='text-indigo-700 font-medium'>
            {job.locationInfo.dist} Km{' '}
          </span>
          <span>from {job.locationInfo.gp} GP</span>
        </span>
      ),
      Started: `${timestampToDate(job.created_at)}`,
      Deadline: `${timestampToDate(job.job_deadline)}`,
      Duration: `${jobDuration(job.created_at, job.job_deadline).days} Day`,
      Status:
        job.Status == 'unenrolled' ? (
          <button onClick={() => jobProfile(job.job_id, job.sachiv_id, job)}>
            <p className='-ml-2 flex items-center w-[80px] justify-between gap-1 ring-1 ring-indigo-500 text-indigo-700 px-2.5 py-0.5 bg-indigo-50 rounded-full'>
              Enroll
              <span className='sr-only'>enroll in {job.job_name}</span>
              <ion-icon
                color='tertiary'
                name='arrow-forward-outline'
              ></ion-icon>
            </p>
          </button>
        ) : (
          job.Status
        )
    }))
    setUpdatedJobs(jobsArr)
  }, [])

  return (
    <main className='relative'>
      <Outlet />
      <div className='px-4'>
        <div className='px-4 pt-6 pb-1 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8 '>
          <div className=' pb-2'>
            <h3 className='text-lg font-medium leading-6 text-gray-900'>
              Your working site
            </h3>
            <p className='mt-2 max-w-4xl text-sm text-gray-700'>
              <b>{lastWork.name}</b> at {lastWork.location.district},{' '}
              {lastWork.location.panchayat} <br />
              <i>
                {'_'}
                {lastWork.desc}
              </i>
              {currentlyEnrolled && (
                <span>
                  <br />
                  till {currentlyEnrolled?.end}
                </span>
              )}
            </p>
          </div>
          {/* Highlights of this tab */}
          <HighlightGrid highlights={highlight} statusStyles={statusStyles} />
        </div>
        {/* Nearby Jobs within 15km */}
        <h2 className='mx-auto mt-8 max-w-6xl px-4 text-lg font-medium leading-6 text-gray-900 sm:px-6 lg:px-8'>
          Jobs near you{' '}
          <p className='max-w-4xl text-sm text-gray-500 font-normal'>
            within 15 Km
          </p>
        </h2>

        {nearbyJobs.length === 0 ? (
          <div className='mx-auto max-w-7xl px-6 text-center pt-4'>
            <div className='rounded-xl border-0 ring-1 ring-gray-100 h-24 flex items-center justify-center'>
              <p className='mt-2 text-lg font-medium text-black text-opacity-50'>
                Seems nothing here, Please check back soon.
              </p>
            </div>
          </div>
        ) : (
          <DynamicTable
            data={updatedJobs}
            headings={tableHeading}
            rowNext={null}
            statusStyles={statusStyles}
          />
        )}
      </div>
    </main>
  )
}

export default Jobs
