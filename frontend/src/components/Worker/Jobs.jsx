import { TableRow } from '../TableRow'
import { useWorkerStore } from '../../api/store'

const tableHeading = [
  { name: 'Work' },
  { name: 'Location' },
  { name: 'Duration' },
  { name: 'Started' },
  { name: 'Status' },
]

const statusStyles = {
  enrolled: 'bg-green-100 text-green-800',
  unenrolled: 'bg-red-100 text-gray-800',
}

const Jobs = () => {
  const { lastWork, nearbyJobs } = useWorkerStore()
  const highlight = [
    {
      label: 'Your presence',
      value: `${lastWork.presence}/${lastWork.duration} day`,
    },
    { label: 'Labours', value: lastWork.labours },
    { label: 'Completion', value: `${lastWork.completion}%` },
    { label: 'Deadline', value: lastWork.deadline },
  ]

  return (
    <main>
      <div className='px-4 pt-6 pb-1 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8 '>
        <div className=' pb-2'>
          <h3 className='text-lg font-medium leading-6 text-gray-900'>
            Your working site
          </h3>
          <p className='mt-2 max-w-4xl text-sm text-gray-500'>
            {lastWork.name}, {lastWork.location.district},{' '}
            {lastWork.location.panchayat}
          </p>
        </div>
        <div className=' bg-white pb-1 sm:pb-4 border-gray-200'>
          <div className='relative'>
            <div className='relative mx-auto max-w-7xl px-6 lg:px-8'>
              <div className='mx-auto max-w-100 px-6'>
                <div className='sm:[&>*:nth-child(2)]:rounded-tr-2xl lg:[&>*:nth-child(3)]:rounded-none lg:[&>*:nth-child(2)]:rounded-none sm:[&>*:nth-child(3)]:rounded-bl-2xl mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-4'>
                  {highlight.map((card, index) => (
                    <div
                      key={index}
                      className='first:rounded-t-2xl sm:first:rounded-tr-none last:rounded-b-2xl sm:last:rounded-bl-none sm:first:rounded-tl-2xl lg:first:rounded-l-2xl sm: lg:last:rounded-r-2xl sm:last:rounded-br-2xl flex flex-col bg-white border p-6 text-center'
                    >
                      <dt className='truncate text-md font-medium text-gray-500 order-1 mt-2leading-6 '>
                        {card.label}
                      </dt>
                      <dd className='text-lg font-medium text-gray-900 order-2 tracking-tight'>
                        {card.value}
                      </dd>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Drowpdown */}
      <h2 className='mx-auto mt-8 max-w-6xl px-4 text-lg font-medium leading-6 text-gray-900 sm:px-6 lg:px-8'>
        Jobs near You
      </h2>

      {nearbyJobs.length === 0 ? (
        <div className='mx-auto max-w-7xl px-6 text-center pt-4'>
          <div className='rounded-xl border-0 ring-1 ring-gray-100 h-24 flex items-center justify-center'>
            <p className='mt-2 text-lg font-medium text-black text-opacity-50'>
              Seems nothing here, Please check back soon.
            </p>
          </div>
        </div>
      ) : (
        <TableRow
          tableHeading={tableHeading}
          tableData={nearbyJobs}
          statusStyles={statusStyles}
          rowNext={null}
        />
      )}
    </main>
  )
}

export default Jobs
