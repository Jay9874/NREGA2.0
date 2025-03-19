import { useEffect } from 'react'
import { useAdminStore } from '../../api/store'
import DynamicTable from '../DynamicTable'
import HighlightGrid from '../highlightGrid'

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
  const { payments, gpo, setPayout, loading } = useAdminStore()
  const highlights = [
    {
      label: 'Budget',
      value: `₹${gpo?.budget} lakh`
    },
    { label: 'Balance', value: `₹4.5 lakh` },
    { label: 'Unpaid', value: `₹50,000 / 20 workers` },
    { label: 'Compensation', value: '₹36,000' }
  ]

  async function getData () {
    try {
      const data = await setPayout()
      // console.log(data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (!loading) getData()
  }, [loading])
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

        {/* Highlights of this tab */}
        <HighlightGrid highlights={highlights} statusStyles={statusStyles} />
      </div>
      {/* Recent Payments */}
      <div className='mx-auto mt-8 max-w-6xl'>
        <h2 className='text-lg font-medium leading-6 text-gray-900'>
          All payments
        </h2>
        <p className='text-sm font-normal text-gray-600'>
          auto credited with <b>DBT (Direct Benefit Transfer)</b>
        </p>
      </div>
      {payments?.length === 0 ? (
        <div className='mx-auto max-w-6xl text-center pt-4'>
          <div className='rounded-xl px-2 border ring-gray-100 h-24 flex items-center justify-center'>
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
