import { Link, Outlet, useNavigate } from 'react-router-dom'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useAdminStore } from '../../../api/store'
import { jobDuration, timestampToDate } from '../../../utils/dataFormating'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export default function AdminAttendance () {
  const { jobs, workerMap, profile } = useAdminStore()
  const [locationGrant, setlocationGrant] = useState('prompt')
  const [location, setLocation] = useState({
    long: '',
    lat: ''
  })
  const navigate = useNavigate()

  const updatedJobs = jobs.map((job, index) => {
    return {
      ...job,
      Name: job.job_name,
      Deadline: timestampToDate(job.job_deadline),
      Duration: `${jobDuration(job.created_at, job.job_deadline).days} Days`,
      Workers: workerMap.has(job.job_id) ? workerMap.get(job.job_id) : 0,
      timestamp: job.job_deadline
    }
  })
  function handlePermission () {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
    function success (pos) {
      const crd = pos.coords
      setLocation(() => ({ long: crd.longitude, lat: crd.latitude }))
    }
    function error (err) {
      console.warn(`ERROR(${err.code}): ${err.message}`)
    }
    navigator.geolocation.getCurrentPosition(success, error, options)
    navigator.permissions
      .query({ name: 'geolocation' })
      .then(function (result) {
        if (result.state == 'granted') {
          setlocationGrant('granted')
        } else if (result.state == 'prompt') {
          setlocationGrant('prompt')
          navigator.geolocation.getCurrentPosition(
            pos => {
              const crd = pos.coords
              setLocation(() => ({ long: crd.longitude, lat: crd.latitude }))
            },
            positionDenied,
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0
            }
          )
        } else if (result.state == 'denied') {
          setlocationGrant('denied')
        }
      })
  }
  useEffect(() => {
    handlePermission()
  }, [])

  async function giveAttendance (jobId) {
    handlePermission()
    if (locationGrant == 'denied')
      return toast.warning('Allow location sharing to continue.')
    return navigate(`job/${jobId}`)
  }
  return (
    <main className='relative h-[calc(100vh-65px)] w-full overflow-scroll'>
      {/* Overlay model for job attendance */}
      {locationGrant == 'granted' && (
        <Outlet context={[location, locationGrant]} />
      )}
      <div className='absolute top-0 w-full px-4 py-6 sm:px-6 lg:px-8'>
        <div className='sm:flex sm:items-center'>
          <div className='sm:flex-auto'>
            <h1 className='text-lg font-medium leading-6 text-gray-900'>
              Select a Job to add attendance
            </h1>
            <p className='mt-2 text-sm text-gray-700'>
              <span className='text-gray-800'>
                List of all the jobs in <b>{profile?.location_id?.panchayat}</b>{' '}
                Gram Panchayat.
              </span>
              <br />{' '}
              <span className='text-md  font-semibold'>
                <i>
                  To sort, click Heading for job name, location, duration or
                  workers
                </i>
              </span>
            </p>
          </div>
        </div>

        {/* Displaying the list of job to add attendance */}
        {updatedJobs.length == 0 ? (
          <div className='mx-auto w-full px-6 text-center pt-4'>
            <div className='rounded-xl border-0 ring-1 ring-gray-100 h-24 flex items-center justify-center'>
              <p className='mt-2 text-lg font-medium text-black text-opacity-50'>
                Seems nothing here, please try again!
              </p>
            </div>
          </div>
        ) : (
          <div className='no-scrollbar -mx-2 max-h-[420px] relative sm:mx-0 mt-8 overflow-scroll shadow ring-1 ring-black ring-opacity-5 rounded-lg'>
            <table className='relative min-w-full divide-y divide-gray-300'>
              <thead className='bg-gray-50 sticky z-10 top-0 bg-opacity-75 backdrop-blur-sm'>
                <tr>
                  <th
                    scope='col'
                    className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6'
                  >
                    <a href='#' className='group inline-flex'>
                      Name
                      <span className='invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible'>
                        <ChevronDownIcon
                          className='h-5 w-5'
                          aria-hidden='true'
                        />
                      </span>
                    </a>
                  </th>
                  <th
                    scope='col'
                    className='hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell'
                  >
                    <a href='#' className='group inline-flex'>
                      Deadline
                      <span className='invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible'>
                        <ChevronDownIcon
                          className='h-5 w-5'
                          aria-hidden='true'
                        />
                      </span>
                    </a>
                  </th>
                  <th
                    scope='col'
                    className='hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell'
                  >
                    <a href='#' className='group inline-flex'>
                      Duration
                      <span className='invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible'>
                        <ChevronDownIcon
                          className='h-5 w-5'
                          aria-hidden='true'
                        />
                      </span>
                    </a>
                  </th>
                  <th
                    scope='col'
                    className='hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell'
                  >
                    <a href='#' className='group inline-flex'>
                      Workers
                      <span className='invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible'>
                        <ChevronDownIcon
                          className='h-5 w-5'
                          aria-hidden='true'
                        />
                      </span>
                    </a>
                  </th>
                  <th scope='col' className='relative py-3.5 pl-3 pr-4 sm:pr-6'>
                    <span className='sr-only'>Status</span>
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 bg-white'>
                {updatedJobs.map((work, workIdx) => {
                  var deadline = new Date(work.timestamp)
                  var now = new Date()
                  deadline.setHours(0, 0, 0, 0)
                  now.setHours(0, 0, 0, 0)
                  return (
                    <tr key={workIdx}>
                      <td className='w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6'>
                        {work.Name}
                        <dl className='font-normal lg:hidden'>
                          <dt className='sr-only'>Deadline</dt>
                          <dd className='mt-1 truncate '>
                            <span className='text-gray-700'>Deadline: </span>
                            <span className='text-gray-500'>
                              {work.Deadline}
                            </span>
                          </dd>
                          <dt className='sr-only md:hidden'>Duration</dt>
                          <dd className='mt-1 truncate text-gray-500 lg:hidden'>
                            <span className='text-gray-700'>Duration: </span>
                            <span className='text-gray-500'>
                              {work.Duration}
                            </span>
                          </dd>
                          <dt className='sr-only md:hidden'>Workers</dt>
                          <dd className='mt-1 truncate text-gray-500 sm:hidden'>
                            <span className='text-gray-700'>Workers: </span>
                            <span className='text-gray-500'>
                              {work.Workers}
                            </span>
                          </dd>
                        </dl>
                      </td>
                      <td className='hidden px-3 py-4 text-sm text-gray-500 lg:table-cell'>
                        {work.Deadline}
                      </td>
                      <td className='hidden truncate px-3 py-4 text-sm text-gray-500 lg:table-cell'>
                        {work.Duration}
                      </td>
                      <td className='hidden px-3 py-4 text-sm text-gray-500 sm:table-cell'>
                        {work.Workers}
                      </td>
                      <td className='py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 w-[150px]'>
                        {deadline.getTime() < now.getTime() ? (
                          <p className='flex items-center w-[150px] justify-between gap-2 ring-1 ring-green-500 text-green-500 px-4 py-1 bg-gray-50 rounded-full'>
                            Completed
                            <span className='sr-only'>, {work.Name}</span>
                            <ion-icon
                              color='success'
                              name='checkmark-done-outline'
                            ></ion-icon>
                          </p>
                        ) : work.Workers == 0 ? (
                          <p className='flex items-center w-[150px] justify-between gap-2 ring-1 ring-yellow-500 text-yellow-500 px-4 py-1 bg-gray-50 rounded-full'>
                            No worker
                            <span className='sr-only'>, {work.Name}</span>
                            <ion-icon color='warning' name='people-outline'></ion-icon>
                          </p>
                        ) : (
                          <button onClick={() => giveAttendance(work.job_id)}>
                            <p className='flex items-center w-[150px] justify-between gap-2 ring-1 ring-indigo-500 text-indigo-700 px-4 py-1 bg-indigo-50 rounded-full'>
                              Attendance
                              <span className='sr-only'>, {work.Name}</span>
                              <ion-icon
                                color='tertiary'
                                name='arrow-forward-outline'
                              ></ion-icon>
                            </p>
                            <span className='sr-only'>{work.job_name}</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className='sticky bottom-0 h-[25px] w-full bg-gradient-to-t  from-gray-50' />
          </div>
        )}
      </div>
    </main>
  )
}
