import { useEffect, useState } from 'react'
import { useAdminStore } from '../../api/store'
import DynamicTable from '../DynamicTable'
import HighlightGrid from '../highlightGrid'
import PaymentTab from '../Skeleton/PaymentTab'

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
  const [loadedData, setLoadedData] = useState(false)
  const [highlights, setHighlights] = useState([
    {
      label: 'Budget',
      value: `₹${gpo?.budget} lakh`
    },
    { label: 'Balance', value: `₹${gpo?.acc_bln} lakh` },
    { label: 'Unpaid', value: `₹ / # workers` },
    { label: 'Compensation', value: '₹' }
  ])

  async function getData () {
    try {
      setLoadedData(false)
      const data = await setPayout()
      const { unsuccessfulPayments } = data
      // getting unpaid workers
      const unpaidLabours = unsuccessfulPayments.length
      
      console.log(data)
      setLoadedData(true)
    } catch (err) {
      setLoadedData(true)
      console.log(err)
    }
  }

  useEffect(() => {
    if (!payments) getData()
  }, [])

  return !loadedData ? (
    <div className='px-4 py-6 sm:px-6 lg:px-8'>
      <PaymentTab />
    </div>
  ) : (
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
