import { Link } from 'react-router-dom'
import Pagination from '../../Pagination'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useAdminStore } from '../../../api/store'
import { jobDuration, timestampToDate } from '../../../utils/dataFormating'
import { useEffect, useState } from 'react'

const statusStyles = {
  present: 'bg-green-100 text-green-800',
  absent: 'bg-red-100 text-gray-800'
}
const tableHeading = [
  { name: 'Name' },
  { name: 'Description' },
  { name: 'Deadline' },
  { name: 'Workers' },
  { name: 'Progress' }
]

export default function ViewJobs () {
  const { jobs, workerMap, profile } = useAdminStore()

  const updatedJobs = jobs.map((job, index) => {
    return {
      ...job,
      Name: job.job_name,
      Description: job.job_description,
      Progress: `${jobDuration(job.created_at, job.job_deadline).percentage}`,
      Deadline:  `${timestampToDate(job.job_deadline)}`,
      Workers: workerMap.has(job.job_id) ? workerMap.get(job.job_id) : 0
    }
  })

  return (
    <main>
      <div className='px-4 py-6 sm:px-6 lg:px-8'>
        <div className='sm:flex sm:items-center'>
          <div className='sm:flex-auto'>
            <h1 className='text-xl font-semibold text-gray-900'>All Jobs</h1>
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

        {/* List all the jobs */}
        {/* {updatedJobs.length === 0 ? (
          <div className='mx-auto max-w-7xl px-6 text-center pt-4'>
            <div className='rounded-xl border-0 ring-1 ring-gray-100 h-24 flex items-center justify-center'>
              <p className='mt-2 text-lg font-medium text-black text-opacity-50'>
                Seems nothing here, please try again!
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className='shadow sm:hidden'>
              <ul
                role='list'
                className='mt-2 divide-y divide-gray-200 overflow-hidden shadow sm:hidden'
              >
                {updatedJobs.map((transaction, index) => (
                  <li key={index}>
                    <a
                      href={transaction.href}
                      className='block bg-white px-4 py-4 hover:bg-gray-50'
                    >
                      <span className='flex items-center space-x-4'>
                        <span className='flex flex-1 space-x-2 truncate'>
                          <span className='w-full flex flex-col truncate text-sm text-gray-500'>
                            {tableHeading.map((heading, index) => (
                              <span key={index} className='truncate'>
                                <span className='font-medium text-gray-900'>
                                  {heading.name}
                                  {': '}
                                </span>
                                {heading.name.toUpperCase() === 'STATUS' ? (
                                  <span
                                    className={classNames(
                                      statusStyles[transaction[heading.name]],
                                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize'
                                    )}
                                  >
                                    {transaction[heading.name]}
                                  </span>
                                ) : (
                                  <span>{transaction[heading.name]}</span>
                                )}
                              </span>
                            ))}
                          </span>
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className='hidden sm:block'>
              <div className='pt-12 pb-12'>
                <div className='relative min-w-full max-h-[250px] overflow-scroll overflow-x-auto align-middle shadow sm:rounded-lg'>
                  <table className='min-w-full relative divide-y divide-gray-200'>
                    <thead>
                      <tr>
                        {tableHeading.map((heading, index) => (
                          <th
                            key={index}
                            className='sticky top-0 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900 
                            z-10 border-b border-gray-300 bg-opacity-75 pl-4 pr-3 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8'
                            scope='col'
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
                        ))}
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200 h-50 bg-white w-full'>
                      {updatedJobs.map((transaction, index) => (
                        <tr key={index} className='bg-white'>
                          {tableHeading.map((heading, index) =>
                            heading.name === 'Progress' ? (
                              <td
                                key={index}
                                className='whitespace-nowrap px-6 py-4 text-sm text-gray-500 md:block'
                              >
                                <div className='admin-job-progress-outer'>
                                  <div id='admin-job-progress' data-done='70'>
                                    <span className='text-sm'>
                                      {transaction[heading.name]}
                                      {'%'}
                                    </span>
                                  </div>
                                </div>
                              </td>
                            ) : (
                              <td
                                key={index}
                                className='w-full whitespace-nowrap px-6 py-4 text-left text-sm text-gray-500'
                              >
                                <p className='truncate text-gray-500 group-hover:text-gray-900'>
                                  {transaction[heading.name]}
                                </p>
                              </td>
                            )
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )} */}
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
                      Progress
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
                        <dd className='mt-1 truncate '>
                          <span className='text-gray-700'>Description: </span>
                          <span className='text-gray-500 whitespace-pre-line'>{work.Description}</span>
                        </dd>
                        <dt className='sr-only md:hidden'>Progress</dt>
                        <dd className='mt-1 truncate text-gray-500 lg:hidden'>
                          <span className='text-gray-700'>Progress: </span>
                          <span className='text-gray-500'>{work.Progress}%</span>
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
                      {work.Progress}%
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
