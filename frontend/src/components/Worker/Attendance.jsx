import Dropdown from '../Dropdown'
import { useEffect } from 'react'
import { dropDown } from '../../utils/locationDrops'
import { TableRow } from '../TableRow'
import { useWorkerStore } from '../../api/store'
const cards = [
  { name: 'State' },
  { name: 'District' },
  { name: 'Block' },
  { name: 'Panchayat' }
]

const statusStyles = {
  present: 'bg-green-100 text-green-800',
  absent: 'bg-red-100 text-gray-800'
}

const Attendance = () => {
  const { attendances, getAttendance } = useWorkerStore()
  const tableHeading = [{ name: 'Work' }, { name: 'Date' }, { name: 'Status' }]
  async function getJobs () {
    await getAttendance()
  }
  useEffect(() => {
    getJobs()
  }, [])
  return (
    <main className='flex-1 pb-8'>
      <div className='px-4 py-6 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8'>
        <div className='border-b border-gray-200 pb-5'>
          <h3 className='text-lg font-medium leading-6 text-gray-900'>
            Your Attendance
          </h3>
          <p className='mt-2 max-w-4xl text-sm text-gray-500'>
            Across locations. Change State, Block, District and Panchayat to
            view specific attendance.
          </p>
        </div>
      </div>
      <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
        <div className='mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          {cards.map((card, index) => (
            <div key={index}>
              <Dropdown options={dropDown[`${card.name}`]} label={card.name} />
            </div>
          ))}
          {/* <button
            type='button'
            // onClick={() => getAttendance()}
            className='inline-flex items-center rounded-md border border-transparent bg-cyan-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2'
          >
            Get works
          </button> */}
        </div>
      </div>
      <h2 className='mx-auto mt-8 max-w-6xl px-4 text-lg font-medium leading-6 text-gray-900 sm:px-6 lg:px-8'>
        Found Attendance
      </h2>

      {attendances.length === 0 ? (
        <div className='mx-auto max-w-7xl px-6 text-center pt-4'>
          <div className='rounded-xl border-0 ring-1 ring-gray-100 h-24 flex items-center justify-center'>
            <p className='mt-2 text-lg font-medium text-black text-opacity-50'>
              Seems nothing here, try changing filters.
            </p>
          </div>
        </div>
      ) : (
        <TableRow
          tableHeading={tableHeading}
          tableData={attendances}
          statusStyles={statusStyles}
        />
      )}
    </main>
  )
}

export default Attendance
