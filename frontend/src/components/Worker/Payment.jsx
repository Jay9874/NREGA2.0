import { useWorkerStore } from '../../api/store'
import { timestampToDate } from '../../utils/convertTimestamp'

function classNames (...classes) {
  return classes.filter(Boolean).join(' ')
}

const statusStyles = {
  success: 'bg-green-100 text-green-800',
  processing: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-red-100 text-gray-800'
}

import RecentPayment from '../RecentPayment'

export default function Payment () {
  const { payment } = useWorkerStore()

  return (
    <main>
      <div className='p-6'>
        <h3 className='text-lg font-medium leading-6 text-gray-900'>
          Last Transaction
        </h3>
        <dl
          className='mt-5 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden 
        rounded-lg bg-white shadow md:grid-cols-5 md:divide-y-0 md:divide-x'
        >
          {/* For name */}
          <div className='px-4 py-5 sm:p-6'>
            <dt className='text-base font-normal text-gray-900'>For Work</dt>
            <dd className='mt-1 flex items-baseline justify-between md:block lg:flex'>
              <div className='flex items-baseline text-xl overflow-hidden font-semibold text-black-600'>
                <p>{payment[0]?.payment_for.job_name}</p>
              </div>
            </dd>
          </div>
          {/* For Amount */}
          <div className='px-4 py-5 sm:p-6'>
            <dt className='text-base font-normal text-gray-900'>Amount</dt>
            <dd className='mt-1 flex items-baseline justify-between md:block lg:flex'>
              <div className='flex items-baseline text-xl overflow-hidden font-semibold text-black-600'>
                <p>
                  {'₹'}
                  {payment[0]?.amount}
                </p>
              </div>
            </dd>
          </div>
          {/* For Date */}
          <div className='px-4 py-5 sm:p-6'>
            <dt className='text-base font-normal text-gray-900'>Date</dt>
            <dd className='mt-1 flex items-baseline justify-between md:block lg:flex'>
              <div className='flex items-baseline text-xl overflow-hidden font-semibold text-black-600'>
                <p>{timestampToDate(payment[0]?.created_at)}</p>
              </div>
            </dd>
          </div>
          {/* For Status */}
          <div className='px-4 py-5 sm:p-6'>
            <dt className='text-base font-normal text-gray-900'>Status</dt>
            <dd className='mt-1 flex items-baseline justify-between md:block lg:flex'>
              <div className='flex items-baseline text-xl overflow-hidden font-semibold text-black-600'>
                <span
                  className={classNames(
                    statusStyles[payment[0]?.status],
                    'px-6 py-1 rounded-3xl capitalize'
                  )}
                >
                  {payment[0]?.status}
                </span>
              </div>
            </dd>
          </div>
          {/* For Trans. ID */}
          <div className='px-4 py-5 sm:p-6'>
            <dt className='text-base font-normal text-gray-900'>Transc. ID</dt>
            <dd className='mt-1 flex items-baseline justify-between md:block lg:flex'>
              <div className='flex items-baseline text-xl overflow-hidden font-semibold text-black-600'>
                <p>{payment[0]?.transaction_id}</p>
              </div>
            </dd>
          </div>
        </dl>
      </div>
      {/* Recent Payments */}
      <RecentPayment heading={'Other Payments'} recentActivity={payment} />
    </main>
  )
}
