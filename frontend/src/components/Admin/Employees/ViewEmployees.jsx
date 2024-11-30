import { Link } from 'react-router-dom'
import { useAdminStore } from '../../../api/store'

export default function ViewEmployees () {
  const { employees, profile } = useAdminStore()
  return (
    <div className='px-4 sm:px-6 lg:px-8'>
      <div className='sm:flex sm:items-center'>
        <div className='sm:flex-auto pt-6'>
          <h1 className='text-xl font-semibold text-gray-900'>Workers</h1>
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
              <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg'>
                <table className='min-w-full divide-y divide-gray-300'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th
                        scope='col'
                        className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6'
                      >
                        Name
                      </th>
                      <th
                        scope='col'
                        className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                      >
                        Aadhaar
                      </th>
                      <th
                        scope='col'
                        className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                      >
                        Mobile
                      </th>
                      <th
                        scope='col'
                        className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                      >
                        Age
                      </th>
                      <th
                        scope='col'
                        className='relative py-3.5 pl-3 pr-4 sm:pr-6'
                      >
                        <span className='sr-only'>Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200 bg-white'>
                    {employees.map((person, index) => (
                      <tr key={index}>
                        <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6'>
                          <div className='flex items-center'>
                            <div className='h-10 w-10 flex-shrink-0'>
                              <img
                                className='h-10 w-10 rounded-full'
                                src={person.photo}
                                alt='profile_img'
                              />
                            </div>
                            <div className='ml-4'>
                              <div className='font-medium text-gray-900'>
                                {person.first_name} {person.last_name}
                              </div>
                              <div className='text-gray-500'>
                                {person.mgnrega_id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                          <div className='text-gray-900'>
                            {person.aadhar_no}
                          </div>
                        </td>
                        <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                          {/* <span className='inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800'> */}
                          <span className='inline-flex rounded-full px-2 text-xs font-semibold leading-5'>
                            {person.mobile_no}
                          </span>
                        </td>
                        <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                          {person.age} yr
                        </td>
                        <td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6'>
                          <Link
                            to={`/admin/workers/edit/${person.id}`}
                            className='text-indigo-600 hover:text-indigo-900'
                          >
                            Edit<span className='sr-only'>, {person.name}</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
