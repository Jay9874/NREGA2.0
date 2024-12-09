import { Link } from 'react-router-dom'
import { useAdminStore } from '../../../api/store'
import { ChevronDownIcon, CheckCircleIcon } from '@heroicons/react/20/solid'
import { useEffect } from 'react'

export default function ViewEmployees () {
  const { employees, profile } = useAdminStore()

  return (
    <div className='px-4 py-6 sm:px-6 lg:px-8'>
      <div className='sm:flex sm:items-center'>
        <div className='sm:flex-auto'>
          <h1 className='text-lg font-medium leading-6 text-gray-900'>
            Workers
          </h1>
          <p className='mt-2 text-sm text-gray-700'>
            A list of all the workers in your{' '}
            <b>{profile?.location_id?.panchayat}</b> Gram Panchayat.
          </p>
        </div>
        <div className='mt-4 sm:mt-0 sm:ml-16 sm:flex-none'>
          <Link
            to={'/admin/workers/add'}
            className='inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto'
          >
            Add Worker
          </Link>
        </div>
      </div>
      <div className='mt-8 flex flex-col'>
        <div className='-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full py-2 align-middle px-6'>
            {employees.length == 0 ? (
              <div className='mx-auto w-full px-6 text-center pt-4'>
                <div className='rounded-xl border-0 ring-1 ring-gray-100 h-24 flex items-center justify-center'>
                  <p className='mt-2 text-lg font-medium text-black text-opacity-50'>
                    Seems nothing here, please try again!
                  </p>
                </div>
              </div>
            ) : (
              <div className='no-scrollbar -mx-2 max-h-[420px] relative sm:mx-0 mt-2 overflow-scroll shadow ring-1 ring-black ring-opacity-5 rounded-lg'>
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
                          Aadhaar
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
                        className='hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell'
                      >
                        <a href='#' className='group inline-flex'>
                          Mobile
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
                          Age
                          <span className='invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible'>
                            <ChevronDownIcon
                              className='h-5 w-5'
                              aria-hidden='true'
                            />
                          </span>
                        </a>
                      </th>
                      <th scope='col' className='relative py-3.5 px-2 sm:pr-6'>
                        <span className='sr-only'>Status</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200 bg-white'>
                    {employees.map((employee, employeeId) => (
                      <tr key={employeeId}>
                        <td className='w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6'>
                          <div className='flex items-center'>
                            <div className='h-10 w-10 flex-shrink-0'>
                              <img
                                className='h-10 w-10 rounded-full'
                                src={employee.photo}
                                alt='profile_img'
                              />
                            </div>
                            <div className='ml-4'>
                              <div className='font-medium text-gray-900'>
                                {employee.first_name} {employee.last_name}
                              </div>
                              <div className='flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6 sm:mt-0'>
                                <span>
                                  <CheckCircleIcon
                                    className='mr-0.5 h-5 w-5 flex-shrink-0 text-green-400'
                                    aria-hidden='true'
                                  />
                                </span>
                                <span>{employee.mgnrega_id}</span>
                              </div>
                            </div>
                          </div>
                          <dl className='font-normal lg:hidden pl-14'>
                            <dt className='sr-only'>Aadhaar Number</dt>
                            <dd className='mt-1 truncate '>
                              <span className='text-gray-700'>Aadhaar: </span>
                              <span className='text-gray-500'>
                                {employee.aadhar_no}
                              </span>
                            </dd>
                            <dt className='sr-only lg:hidden'>Mobile Number</dt>
                            <dd className='mt-1 truncate text-gray-500 md:hidden'>
                              <span className='text-gray-700'>Mobile: </span>
                              <span className='text-gray-500'>
                                {employee.mobile_no}
                              </span>
                            </dd>
                            <dt className='sr-only md:hidden'>Age</dt>
                            <dd className='mt-1 truncate text-gray-500 sm:hidden'>
                              <span className='text-gray-700'>Age: </span>
                              <span className='text-gray-500'>
                                {employee.age}
                              </span>
                            </dd>
                          </dl>
                        </td>
                        <td className='hidden px-3 py-4 text-sm text-gray-500 lg:table-cell'>
                          {employee.aadhar_no}
                        </td>
                        <td className='hidden truncate px-3 py-4 text-sm text-gray-500 md:table-cell'>
                          {employee.mobile_no}
                        </td>
                        <td className='hidden px-3 py-4 text-sm text-gray-500 sm:table-cell'>
                          {employee.age}
                        </td>
                        <td className='py-4 pr-4 text-right text-sm font-medium w-[30px]'>
                          <Link
                            to={`/admin/workers/edit/${employee.id}`}
                            className='text-indigo-600 hover:text-indigo-900'
                          >
                            Edit
                            <span className='sr-only'>, {employee.name}</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className='sticky bottom-0 h-[25px] w-full bg-gradient-to-t  from-gray-50' />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
