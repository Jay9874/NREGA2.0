import { BanknotesIcon} from '@heroicons/react/20/solid'
import { timestampToDate } from '../utils/dataFormating'
const statusStyles = {
  successful: 'bg-green-100 text-green-800',
  processing: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-red-100 text-gray-800'
}

function classNames (...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function RecentPayment ({ heading, recentActivity }) {
  return recentActivity?.length === 0 ? (
    <div className='mx-auto px-4 max-w-6xl sm:px-6 lg:px-8 text-center pt-4'>
      <div className='rounded-xl p-2 overflow-scroll border ring-gray-100 h-24 flex items-center justify-center'>
        <p className='mt-2 text-lg font-medium text-black text-opacity-50'>
          Seems no recent activities, check back soon.
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
          {recentActivity.map(transaction => (
            <li key={transaction.id}>
              <a
                href={transaction.href}
                className='block bg-white px-4 py-4 hover:bg-gray-50'
              >
                <span className='flex items-center space-x-4'>
                  <span className='flex flex-1 space-x-2 truncate'>
                    <BanknotesIcon
                      className='h-5 w-5 flex-shrink-0 text-gray-400'
                      aria-hidden='true'
                    />
                    <span className='flex flex-col truncate text-sm text-gray-500'>
                      <span className='truncate'>
                        {transaction.payment_title}
                      </span>
                      <span className='font-medium text-gray-900'>
                        Amount: {'₹'}
                        {transaction.amount.toFixed(2)}
                      </span>
                      <time
                        className='font-medium text-gray-900'
                        dateTime={transaction.datetime}
                      >
                        Date: {timestampToDate(transaction?.created_at)}
                      </time>
                      <span className='font-medium text-gray-900'>
                        Status:{' '}
                        <span
                          className={classNames(
                            statusStyles[transaction.status],
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize'
                          )}
                        >
                          {' '}
                          {transaction?.status}
                        </span>
                      </span>
                    </span>
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      {/* Activity table (small device and up)*/}
      <div className='hidden sm:block'>
        <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
          <div className='mt-2 flex flex-col'>
            <div className='min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead>
                  <tr>
                    <th
                      className='bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900'
                      scope='col'
                    >
                      Transaction
                    </th>
                    <th
                      className='bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900'
                      scope='col'
                    >
                      Amount
                    </th>
                    <th
                      className=' bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900 md:block'
                      scope='col'
                    >
                      Status
                    </th>
                    <th
                      className='bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900'
                      scope='col'
                    >
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 bg-white'>
                  {recentActivity.map(transaction => (
                    <tr key={transaction.id} className='bg-white'>
                      <td className='w-full max-w-0 whitespace-nowrap px-6 py-4 text-sm text-gray-900'>
                        <div className='flex'>
                          <a
                            href={transaction.href}
                            className='group inline-flex space-x-2 truncate text-sm'
                          >
                            <BanknotesIcon
                              className='h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500'
                              aria-hidden='true'
                            />
                            <p className='truncate text-gray-500 group-hover:text-gray-900'>
                              {transaction.payment_title}
                            </p>
                          </a>
                        </div>
                      </td>
                      <td className='whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500'>
                        {'₹'}
                        <span className='font-medium text-gray-500'>
                          {transaction.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500 md:block'>
                        <span
                          className={classNames(
                            statusStyles[transaction.status],
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize'
                          )}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className='whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500'>
                        <time dateTime={transaction.datetime}>
                          {timestampToDate(transaction?.created_at)}
                        </time>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
