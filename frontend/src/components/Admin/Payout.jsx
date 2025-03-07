import { useEffect } from 'react'
import { useAdminStore } from '../../api/store'
import { timestampToDate } from '../../utils/dataFormating'
import DynamicTable from '../DynamicTable'

function classNames (...classes) {
  return classes.filter(Boolean).join(' ')
}
const statusStyles = {
  successful: 'bg-green-100 text-green-800',
  processing: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-red-100 text-gray-800'
}

const tableHeading = [
  { name: 'Transaction', css_normal: '', css_list: '' },
  {
    name: 'Amount',
    css_normal: 'lg:table-cell hidden',
    css_list: 'lg:table-cell'
  },
  { name: 'Date', css_normal: 'sm:table-cell hidden', css_list: 'sm:hidden' },
  { name: 'Status', css_normal: '', css_list: 'hidden' }
]

export default function Payout () {
  const { payments, gpo, setPayout } = useAdminStore()
  const highlights = [
    {
      label: 'Budget',
      value: `₹${gpo?.budget} lakh`
    },
    { label: 'Balance', value: `₹4.5 lakh` },
    { label: 'Unpaid', value: `₹50,000 / 20 workers` },
    { label: 'Compensation', value: '₹36,000' }
  ]

  useEffect(() => {
    const data = setPayout()
    console.log(data)
  }, [])
  return (
    <main className='px-4 py-6 sm:px-6 lg:px-8'>
      <div>
        <div className=' pb-2'>
          <h3 className='text-lg font-medium leading-6 text-gray-900'>
            Payment summary
          </h3>
          <p className='mt-2 max-w-4xl text-sm text-gray-700'>
            for the financial year <b>{gpo?.fy}</b>.<br />
            <i>
              {'_'}
              Labour rate at your Gram Panchayat is{' '}
              <b>{`₹${gpo?.labour_rate}/day`}.</b>
            </i>
          </p>
        </div>
        <div className=' bg-white pb-1 sm:pb-4 border-gray-200'>
          <div className='relative'>
            <div className='relative mx-auto max-w-7xl px-6 lg:px-8'>
              <div className='mx-auto max-w-100 px-6'>
                <div className='sm:[&>*:nth-child(2)]:rounded-tr-2xl lg:[&>*:nth-child(3)]:rounded-none lg:[&>*:nth-child(2)]:rounded-none sm:[&>*:nth-child(3)]:rounded-bl-2xl mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-4'>
                  {highlights.map((card, index) => (
                    <div
                      key={index}
                      className='first:rounded-t-2xl sm:first:rounded-tr-none last:rounded-b-2xl sm:last:rounded-bl-none sm:first:rounded-tl-2xl lg:first:rounded-l-2xl sm: lg:last:rounded-r-2xl sm:last:rounded-br-2xl flex flex-col bg-white border p-6 text-center'
                    >
                      <dt className='truncate text-md font-medium text-gray-700 order-1 mt-2leading-6 '>
                        {card.label}
                      </dt>
                      <dd className='text-md font-medium text-gray-500 order-2 tracking-tight'>
                        {card.label == 'Status' ? (
                          <span
                            className={classNames(
                              statusStyles[card.value],
                              'px-3 rounded-3xl capitalize text-md'
                            )}
                          >
                            {card.value}
                          </span>
                        ) : (
                          card.value
                        )}
                      </dd>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Recent Payments */}
      <div className='mx-auto mt-8 max-w-6xl'>
        <h2 className='text-lg font-medium leading-6 text-gray-900'>
          All payments
        </h2>
        <p className='text-sm font-normal font-normal text-gray-600'>
          auto credited with <b>DBT (Direct Benefit Transfer)</b>
        </p>
      </div>
      {payments?.length === 0 ? (
        <div className='mx-auto max-w-7xl px-12 text-center pt-4'>
          <div className='rounded-xl border ring-gray-100 h-24 flex items-center justify-center'>
            <p className='mt-2 text-lg font-medium text-black text-opacity-50'>
              Seems no recent activity, check back soon.
            </p>
          </div>
        </div>
      ) : (
        <DynamicTable
          headings={tableHeading}
          data={payments}
          statusStyles={statusStyles}
        />
      )}
    </main>
  )
}
