import { Link } from 'react-router-dom'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useAdminStore } from '../../../api/store'
import { jobDuration, timestampToDate } from '../../../utils/dataFormating'
import { useEffect } from 'react'


export default function ViewJobs () {
  const { jobs, workerMap, profile } = useAdminStore()

  const updatedJobs = jobs.map((job, index) => {
    return {
      ...job,
      Name: job.job_name,
      Description: job.job_description,
      Progress: `${jobDuration(job.created_at, job.job_deadline).percentage}`,
      Deadline:  `${timestampToDate(job.job_deadline)}`,
      Started:  `${timestampToDate(job.job_start_date)}`,
      Workers: workerMap.has(job.job_id) ? workerMap.get(job.job_id) : 0
    }
  })

  return (
    <main>
      <div className='px-4 py-6 sm:px-6 lg:px-8'>
        <div className='sm:flex sm:items-center'>
          <div className='sm:flex-auto'>
            <h1 className='text-lg font-medium leading-6 text-gray-900'>All Jobs</h1>
            <p className='mt-2 text-sm text-gray-700'>
              <span className='text-gray-800'>
                Created by you in <b>{profile?.location_id?.panchayat}</b> Gram
                Panchayat.
              </span>
              <br />
              <span className='text-md  font-semibold'>
                <i>Click Heading of a column to sort.</i>
              </span>
            </p>
          </div>
          <div className='mt-4 sm:mt-0 sm:ml-16 sm:flex-none'>
            <Link
              to='add'
              className='inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto'
            >
              Add a Job
            </Link>
          </div>
        </div>
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
                      Description
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
                      Started
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
                  <th
                    scope='col'
                    className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
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
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 bg-white'>
                {updatedJobs.map((work, workIdx) => (
                  <tr key={workIdx}>
                    <td className='w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6'>
                      {work.Name}
                      <dl className='font-normal lg:hidden'>
                        <dt className='sr-only'>Description</dt>
                        <dd className='mt-1'>
                          <span className='text-gray-700'>Description: </span>
                          <span className='text-gray-500 whitespace-wrap'>{work.Description}</span>
                        </dd>
                        <dt className='sr-only md:hidden'>Created</dt>
                        <dd className='mt-1 truncate text-gray-500 lg:hidden'>
                          <span className='text-gray-700'>Created: </span>
                          <span className='text-gray-500'>{work.Created}</span>
                        </dd>
                        <dt className='sr-only md:hidden'>Workers</dt>
                        <dd className='mt-1 truncate text-gray-500 sm:hidden'>
                          <span className='text-gray-700'>Workers: </span>
                          <span className='text-gray-500'>{work.Workers}</span>
                        </dd>
                      </dl>
                    </td>
                    <td className='hidden px-3 py-4 text-sm text-gray-500 lg:table-cell'>
                      {work.Description}
                    </td>
                    <td className='hidden px-3 py-4 text-sm text-gray-500 lg:table-cell'>
                      {work.Started}
                  
                    </td>
                    <td className='hidden px-3 py-4 text-sm text-gray-500 sm:table-cell'>
                      {work.Workers}
                    </td>
                    <td className='px-3 py-4 text-sm text-gray-500'>
                      {work.Deadline}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='sticky bottom-0 h-[25px] w-full bg-gradient-to-t  from-gray-50' />
          </div>
        )}
      </div>
    </main>
  )
}
