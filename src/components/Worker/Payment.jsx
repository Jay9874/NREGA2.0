const stats = [
  {
    name: 'For work',
    stat: 'Amristsorvar, Hadipur'
  },
  {
    name: 'Date of transaction',
    stat: '12th Dec 2020'
  },
  {
    name: 'Amount',
    stat: '₹ 5000'
  },
  {
    name: 'Status',
    stat: 'Failed'
  },
  {
    name: 'Transaction ID',
    stat: '024564134124645431'
  }
]

const transactions = [
  {
    id: 1,
    name: 'Payment from Kedraband Panchayat',
    href: '#',
    amount: '₹20,000',
    status: 'success',
    date: 'July 11, 2020',
    datetime: '2020-07-11'
  },
  {
    id: 2,
    name: 'Payment from Kedraband Panchayat',
    href: '#',
    amount: '₹20,000',
    status: 'processing',
    date: 'July 11, 2020',
    datetime: '2020-07-11'
  }
  // More transactions...
]

function classNames (...classes) {
  return classes.filter(Boolean).join(' ')
}

const statusStyles = {
  paid: 'bg-green-100 text-green-800',
  processing: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-red-100 text-gray-800'
}

import RecentPayment from '../RecentPayment'

export default function Payment () {
  return (
    <main>
      <div className='p-6'>
        <h3 className='text-lg font-medium leading-6 text-gray-900'>
          Last Transaction
        </h3>
        <dl className='mt-5 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:grid-cols-5 md:divide-y-0 md:divide-x'>
          {stats.map(item => (
            <div key={item.name} className='px-4 py-5 sm:p-6'>
              <dt className='text-base font-normal text-gray-900'>
                {item.name}
              </dt>
              {item.name === 'Status' ? (
                <dd className='mt-1 flex items-baseline justify-between md:block lg:flex'>
                  <div className='flex items-baseline text-xl overflow-hidden font-semibold text-black-600'>
                    <span
                      className={classNames(
                        statusStyles[item.stat.toLowerCase()],
                        'px-6 py-1 rounded-3xl'
                      )}
                    >
                      {item.stat}
                    </span>
                  </div>
                </dd>
              ) : (
                <dd className='mt-1 flex items-baseline justify-between md:block lg:flex'>
                  <div className='flex items-baseline text-xl overflow-hidden font-semibold text-black-600'>
                    {/* <p className='truncate'> {item.stat}</p> */}
                    <p>{item.stat}</p>
                  </div>
                </dd>
              )}
            </div>
          ))}
        </dl>
      </div>
      {/* Recent Payments */}
      <RecentPayment heading={'Other Payments'} recentActivity={transactions} />
    </main>
  )
}
