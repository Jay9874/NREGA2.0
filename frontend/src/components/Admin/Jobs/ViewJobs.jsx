const people = [
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    department: 'Optimization',
    email: 'lindsay.walton@example.com',
    role: 'Member',
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  // More people...
]

const statusStyles = {
  present: 'bg-green-100 text-green-800',
  absent: 'bg-red-100 text-gray-800',
}
const tableHeading = [
  { name: 'Name' },
  { name: 'Location' },
  { name: 'Deadline' },
  { name: 'Headcount' },
  { name: 'Delay' },
]

const tableData = [
  {
    Location: 'Joda Mandir, Kasba, Kolkata, West Bengal',
    Presence: '2/147 Day',
    Name: 'Ped Lagao',
    Deadline: '2024-01-25T23:26:35+00:00',
    id: 1,
    Headcount: 5,
    Delay: 5,
    start: '2023-09-01T17:29:27.52655+00:00',
  },
  {
    Location: 'Joda Mandir, Kasba, Kolkata, West Bengal',
    Presence: '2/147 Day',
    Name: 'Ped Lagao',
    Deadline: '2024-01-25T23:26:35+00:00',
    id: 1,
    Headcount: 5,
    Delay: 5,
    start: '2023-09-01T17:29:27.52655+00:00',
  },
  {
    Location: 'Joda Mandir, Kasba, Kolkata, West Bengal',
    Presence: '2/147 Day',
    Name: 'Ped Lagao',
    Deadline: '2024-01-25T23:26:35+00:00',
    id: 1,
    Headcount: 5,
    Delay: 5,
    start: '2023-09-01T17:29:27.52655+00:00',
  },
  {
    Location: 'Joda Mandir, Kasba, Kolkata, West Bengal',
    Presence: '2/147 Day',
    Name: 'Ped Lagao',
    Deadline: '2024-01-25T23:26:35+00:00',
    id: 1,
    Headcount: 5,
    Delay: 5,
    start: '2023-09-01T17:29:27.52655+00:00',
  },
]

export default function ViewJobs() {
  return (
    <main>
      <div className='px-4 py-6 sm:px-6 lg:px-8'>
        <div className='sm:flex sm:items-center'>
          <div className='sm:flex-auto'>
            <h1 className='text-xl font-semibold text-gray-900'>All Jobs</h1>
            <p className='mt-2 text-sm text-gray-700'>
              created by you for your local Gram Panchayat.
            </p>
          </div>
          <div className='mt-4 sm:mt-0 sm:ml-16 sm:flex-none'>
            <button
              type='button'
              className='inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto'
            >
              Add a Job
            </button>
          </div>
        </div>

        {/* List all the jobs */}
        {tableData.length === 0 ? (
          <div className='mx-auto max-w-7xl px-6 text-center pt-4'>
            <div className='rounded-xl border-0 ring-1 ring-gray-100 h-24 flex items-center justify-center'>
              <p className='mt-2 text-lg font-medium text-black text-opacity-50'>
                Seems nothing here, please try again!
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Activity list (smallest breakpoint only) */}
            <div className='shadow sm:hidden'>
              <ul
                role='list'
                className='mt-2 divide-y divide-gray-200 overflow-hidden shadow sm:hidden'
              >
                {tableData.map((transaction, index) => (
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

            {/* Activity table (small breakpoint and up) */}
            <div className='hidden sm:block'>
              <div className='pb-12'>
                {/* <div className='mt-2 flex flex-col'> */}
                <div className='min-w-full max-h-[200px] overflow-scroll overflow-x-auto align-middle shadow sm:rounded-lg'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className="stickey top-0">
                      <tr>
                        {tableHeading.map((heading, index) => (
                          <th
                            key={index}
                            className='bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900'
                            scope='col'
                          >
                            {heading.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200 h-50 bg-white overflow-y-scroll w-full'>
                      {tableData.map((transaction, index) => (
                        <tr key={index} className='bg-white'>
                          {tableHeading.map((heading, index) =>
                            heading.name === 'Status' ? (
                              <td
                                key={index}
                                className='whitespace-nowrap px-6 py-4 text-sm text-gray-500 md:block'
                              >
                                <span
                                  className={classNames(
                                    statusStyles[transaction[heading.name]],
                                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize'
                                  )}
                                >
                                  {transaction[heading.name]}
                                </span>
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
                  {/* Pagination */}
                </div>
                {/* </div> */}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
