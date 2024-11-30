import { Link, Outlet } from 'react-router-dom'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useAdminStore } from '../../api/store'
import { jobDuration } from '../../utils/dataFormating'

const works = [
  {
    name: 'Tree Plantation',
    worker_count: '30',
    duration: '2 month',
    location: 'Kasba GP',
    jobId: 1
  },
  {
    name: 'Tree Plantation',
    worker_count: '30',
    duration: '2 month',
    location: 'Kasba GP',
    jobId: 2
  },
  {
    name: 'Tree Plantation',
    worker_count: '30',
    duration: '2 month',
    location: 'Kasba GP',
    jobId: 3
  },
  {
    name: 'Tree Plantation',
    worker_count: '30',
    duration: '2 month',
    location: 'Kasba GP',
    jobId: 4
  },
  {
    name: 'Tree Plantation',
    worker_count: '30',
    duration: '2 month',
    location: 'Kasba GP',
    jobId: 5
  },
  {
    name: 'Tree Plantation',
    worker_count: '30',
    duration: '2 month',
    location: 'Kasba GP',
    jobId: 6
  },
  {
    name: 'Tree Plantation',
    worker_count: '30',
    duration: '2 month',
    location: 'Kasba GP',
    jobId: 7
  },
  {
    name: 'Tree Plantation',
    worker_count: '30',
    duration: '2 month',
    location: 'Kasba GP',
    jobId: 8
  }
]

const tableHeading = [
  { name: 'Name' },
  { name: 'Duration' },
  { name: 'Location' },
  { name: 'Workers' },
  { name: '' }
]

function classNames (...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function AdminAttendance () {
  const { jobs, workerMap, profile } = useAdminStore()

  const updatedJobs = jobs.map((job, index) => {
    return {
      ...job,
      Name: job.job_name,
      Duration: `${jobDuration(job.created_at, job.job_deadline).days} Days`,
      Location: profile?.location_id?.panchayat,
      Workers: workerMap.has(job.job_id) ? workerMap.get(job.job_id) : 0
    }
  })

  function onClose () {
    console.log('hello')
  }
  return (
    <main className='relative min-h-[calc(100vh-64px)]'>
      {/* The selected job attendance */}
      <Outlet context={[onClose]} />

      <div className='relative overflow-hidden h-full'>
        <div className='px-4 sm:px-6 lg:px-8 py-6 h-full'>
          <div className='sm:flex sm:items-center'>
            <div className='sm:flex-auto'>
              <h1 className='text-xl font-semibold text-gray-900'>
                Select a Job to add attendance
              </h1>
              <p className='mt-2 text-sm text-gray-700'>
                A list of all the jobs in your Gram Panchayat. You can sort with
                job name, location, duration and workers.
              </p>
            </div>
          </div>
          <div className='mt-8 flex gap-2 overflow-scroll flex-wrap md:flex-nowrap lg:flex-row flex-col-reverse items-center lg:items-start'>
            {/* Job Container */}
            {updatedJobs.length == 0 ? (
              <div className='mx-auto w-full px-6 text-center pt-4'>
                <div className='rounded-xl border-0 ring-1 ring-gray-100 h-24 flex items-center justify-center'>
                  <p className='mt-2 text-lg font-medium text-black text-opacity-50'>
                    Seems nothing here, please try again!
                  </p>
                </div>
              </div>
            ) : (
              <div className='relative min-w-full max-h-[350px] align-middle sm:rounded-lg mt-8 shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg'>
                <table className='min-w-full relative  divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      {tableHeading.map((heading, index) =>
                        heading.name == '' ? (
                          <th
                            key={index}
                            scope='col'
                            className='relative py-3.5 pl-3 pr-4 sm:pr-6'
                          >
                            <span className='sr-only'>Status</span>
                          </th>
                        ) : (
                          <th
                            key={index}
                            scope='col'
                            className={`sticky ${
                              index == 1 || index == 2
                                ? 'hidden lg:table-cell'
                                : ''
                            } top-0 bg-gray-50 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 
                            z-10 border-b border-gray-300 bg-opacity-75 backdrop-blur backdrop-filter
                        `}
                          >
                            <a href='#' className='group inline-flex'>
                              {heading.name}
                              <span className='invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible'>
                                <ChevronDownIcon
                                  className='h-5 w-5'
                                  aria-hidden='true'
                                />
                              </span>
                            </a>
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className='bg-white'>
                    {updatedJobs.map((work, workIdx) => (
                      <tr key={workIdx}>
                        {tableHeading.map((heading, index) =>
                          heading.name == '' ? (
                            <td
                              key={index}
                              className='whitespace-nowrap w-[150px] py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6'
                            >
                              <Link to={`job/${work.job_id}`}>
                                <p className='flex items-center w-[150px] justify-between gap-2 ring-1 ring-gray-500 hover:ring-indigo-500 hover:text-indigo-700 text-gray-500 px-4 py-1 hover:bg-indigo-50 bg-gray-50 rounded-full'>
                                  <span>Attendance</span>
                                  <ion-icon name='arrow-forward-outline'></ion-icon>
                                </p>
                                <span className='sr-only'>{work.job_name}</span>
                              </Link>
                            </td>
                          ) : (
                            <td
                              key={index}
                              className={`${
                                index == 1 || index == 2
                                  ? 'hidden lg:table-cell'
                                  : ''
                              } whitespace-nowrap px-3 py-4 text-sm text-gray-500`}
                            >
                              {/* <p className='truncate text-gray-500 group-hover:text-gray-900'> */}
                              {work[heading.name]}
                              {/* </p> */}
                            </td>
                          )
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
