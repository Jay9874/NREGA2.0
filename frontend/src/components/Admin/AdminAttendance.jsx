import { useState } from 'react'
import JobAttendance from './JobAttendance'

const people = [
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  },
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member'
  }
  // More people...
]

function classNames (...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function AdminAttendance () {
  const [selectedJob, setSelectedJob] = useState(null)
  return (
    <div className='relative overflow-hidden'>
      <div className='px-4 sm:px-6 lg:px-8 py-6'>
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
        <div className='mt-8 flex gap-2 flex-wrap md:flex-nowrap lg:flex-row flex-col-reverse items-center sm:items-start sm:items-center'>
          <div className='max-h-[60vh] overflow-scroll pb-6'>
            {/* The job container */}
            <div className='inline-block min-w-full align-middle'>
              <div className='shadow-sm ring-1 ring-black ring-opacity-5'>
                <table
                  className='min-w-full border-separate'
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
                        <span className='sr-only'>Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white'>
                    {people.map((person, personIdx) => (
                      <tr key={personIdx}>
                        <td
                          className={classNames(
                            personIdx !== people.length - 1
                              ? 'border-b border-gray-200'
                              : '',
                            'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                          )}
                        >
                          {person.name}
                        </td>
                        <td
                          className={classNames(
                            personIdx !== people.length - 1
                              ? 'border-b border-gray-200'
                              : '',
                            'whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell'
                          )}
                        >
                          {person.title}
                        </td>
                        <td
                          className={classNames(
                            personIdx !== people.length - 1
                              ? 'border-b border-gray-200'
                              : '',
                            'whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden lg:table-cell'
                          )}
                        >
                          {person.email}
                        </td>
                        <td
                          className={classNames(
                            personIdx !== people.length - 1
                              ? 'border-b border-gray-200'
                              : '',
                            'whitespace-nowrap px-3 py-4 text-sm text-gray-500'
                          )}
                        >
                          {person.role}
                        </td>
                        <td
                          className={classNames(
                            personIdx !== people.length - 1
                              ? 'border-b border-gray-200'
                              : '',
                            'relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium'
                          )}
                        >
                          <button
                            onClick={() => setSelectedJob(personIdx)}
                            className='flex items-center justify-evenly w-[100%]'
                          >
                            <span className='ring-1 ring-gray-500 hover:ring-indigo-500 hover:text-indigo-700 text-gray-500 px-4 py-1 hover:bg-indigo-50 bg-gray-50 rounded-2xl'>
                              Attendance
                            </span>
                            <ion-icon name='chevron-forward-outline'></ion-icon>
                            <span className='sr-only'>, {person.name}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* The selected job attendance */}
          {selectedJob != null && <JobAttendance />}
        </div>
      </div>
    </div>
  )
}
