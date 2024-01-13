import { ChevronRightIcon } from '@heroicons/react/20/solid'

function classNames (...classes) {
  return classes.filter(Boolean).join(' ')
}

export const TableRow = ({ tableHeading, tableData, statusStyles }) => {
  return (
    <>
      {/* Activity list (smallest breakpoint only) */}
      <div className='shadow sm:hidden'>
        <ul
          role='list'
          className='mt-2 divide-y divide-gray-200 overflow-hidden shadow sm:hidden'
        >
          {tableData.map(transaction => (
            <li key={transaction.id}>
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
                          {heading.name === 'Status' ? (
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
                  <ChevronRightIcon
                    className='h-5 w-5 flex-shrink-0 text-gray-400'
                    aria-hidden='true'
                  />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Activity table (small breakpoint and up) */}
      <div className='hidden sm:block'>
        <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-12'>
          <div className='mt-2 flex flex-col'>
            <div className='min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg'>
              <table className='min-w-full divide-y divide-gray-200 max-h-12'>
                <thead>
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
                <tbody className='divide-y divide-gray-200 bg-white  overflow-auto'>
                  {tableData.map(transaction => (
                    <tr key={transaction.id} className='bg-white'>
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
          </div>
        </div>
      </div>
    </>
  )
}
