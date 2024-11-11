import { useState } from 'react'
import JobAttendance from './JobAttendance'

const works = [
  {
    name: 'Tree Plantation',
    worker_count: '30',
    duration: '2 month',
    location: 'Kasba GP'
  },
  {
    name: 'Tree Plantation',
    worker_count: '30',
    duration: '2 month',
    location: 'Kasba GP'
  },
  {
    name: 'Tree Plantation',
    worker_count: '30',
    duration: '2 month',
    location: 'Kasba GP'
  },
  {
    name: 'Tree Plantation',
    worker_count: '30',
    duration: '2 month',
    location: 'Kasba GP'
  },
  {
    name: 'Tree Plantation',
    worker_count: '30',
    duration: '2 month',
    location: 'Kasba GP'
  },
  {
    name: 'Tree Plantation',
    worker_count: '30',
    duration: '2 month',
    location: 'Kasba GP'
  },
  {
    name: 'Tree Plantation',
    worker_count: '30',
    duration: '2 month',
    location: 'Kasba GP'
  },
  {
    name: 'Tree Plantation',
    worker_count: '30',
    duration: '2 month',
    location: 'Kasba GP'
  }
]

function classNames (...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function AdminAttendance () {
  const [selectedJob, setSelectedJob] = useState(null)
  function onClose () {
    setSelectedJob(null)
  }
  return (
    <main className='relative min-h-[calc(100vh-64px)]'>
      {selectedJob != null && (
        <div className='overlay-modal h-full flex justify-center overflow-scroll absolute top-0 w-full z-20 bg-gray-300 bg-opacity-90'>
          {/* The selected job attendance */}
          <div className='modal h-full w-full lg:max-w-[60%] box-border  p-4 lg:p-12'>
            <JobAttendance onclose={onClose} />
          </div>
        </div>
      )}
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
          <div className='mt-8 flex gap-2 border-b-2  flex-wrap md:flex-nowrap lg:flex-row flex-col-reverse items-center lg:items-start'>
            <div className='max-h-[60vh] overflow-scroll pb-6 w-full'>
              {/* The job container */}
              <div className='inline-block w-full align-middle'>
                <div className='shadow-sm ring-1 ring-black ring-opacity-5'>
                  <table
                    className='border-separate w-full'
                    style={{ borderSpacing: 0 }}
                  >
                    <thead className='bg-gray-50'>
                      <tr>
                        <th
                          scope='col'
                          className='sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8'
                        >
                          <button className='cursor-pointer flex items-center gap-6'>
                            Name{' '}
                            <ion-icon
                              className='down-arrow'
                              name='chevron-down-outline'
                            ></ion-icon>
                          </button>
                        </th>
                        <th
                          scope='col'
                          className='sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell'
                        >
                          <button className='cursor-pointer flex items-center gap-6'>
                            Worker Count{' '}
                            <ion-icon
                              className='down-arrow'
                              name='chevron-down-outline'
                            ></ion-icon>
                          </button>
                        </th>
                        <th
                          scope='col'
                          className='sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell'
                        >
                          <button className='cursor-pointer flex items-center gap-6'>
                            Duration{' '}
                            <ion-icon
                              className='down-arrow'
                              name='chevron-down-outline'
                            ></ion-icon>
                          </button>
                        </th>
                        <th
                          scope='col'
                          className='sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter'
                        >
                          <button className='cursor-pointer flex items-center gap-6'>
                            Location{' '}
                            <ion-icon
                              className='down-arrow'
                              name='chevron-down-outline'
                            ></ion-icon>
                          </button>
                        </th>
                        <th
                          scope='col'
                          className='sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pr-4 pl-3 backdrop-blur backdrop-filter'
                        >
                          <span className='sr-only'>Attendance</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white'>
                      {works.map((work, workIdx) => (
                        <tr key={workIdx}>
                          <td
                            className={classNames(
                              workIdx !== works.length - 1
                                ? 'border-b border-gray-200'
                                : '',
                              'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                            )}
                          >
                            {work.name}
                          </td>
                          <td
                            className={classNames(
                              workIdx !== works.length - 1
                                ? 'border-b border-gray-200'
                                : '',
                              'whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell'
                            )}
                          >
                            {work.worker_count}
                          </td>
                          <td
                            className={classNames(
                              workIdx !== works.length - 1
                                ? 'border-b border-gray-200'
                                : '',
                              'whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden lg:table-cell'
                            )}
                          >
                            {work.duration}
                          </td>
                          <td
                            className={classNames(
                              workIdx !== works.length - 1
                                ? 'border-b border-gray-200'
                                : '',
                              'whitespace-nowrap px-3 py-4 text-sm text-gray-500'
                            )}
                          >
                            {work.location}
                          </td>
                          <td
                            className={classNames(
                              workIdx !== works.length - 1
                                ? 'border-b border-gray-200'
                                : '',
                              'relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium'
                            )}
                          >
                            <button
                              onClick={() => setSelectedJob(workIdx)}
                              className='flex items-center justify-evenly w-[100%]'
                            >
                              <span className='ring-1 ring-gray-500 hover:ring-indigo-500 hover:text-indigo-700 text-gray-500 px-4 py-1 hover:bg-indigo-50 bg-gray-50 rounded-full'>
                                Attendance
                              </span>
                              <ion-icon name='chevron-forward-outline'></ion-icon>
                              <span className='sr-only'>, {work.name}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
