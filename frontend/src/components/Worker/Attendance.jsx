import Dropdown from '../Dropdown'
import { dropDown } from '../../utils/locationDrops'
import { TableRow } from '../TableRow'
import { useWorkerStore } from '../../api/store'
import { useEffect, useState } from 'react'
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

export default function Attendance () {
  const { attendances, locations, dataLoaded } = useWorkerStore()
  const tableHeading = [{ name: 'Work' }, { name: 'Date' }, { name: 'Status' }]
  const [states, setStates] = useState(null)
  const [districts, setDistricts] = useState([])
  const [blocks, setBlocks] = useState([])
  const [panchayats, setPanchayats] = useState([])
  const [selected, setSelected] = useState({
    state: '',
    district: '',
    block: '',
    panchayat: ''
  })
  async function getStates () {
    const fetchedState = await Promise.all(
      locations.map(location => location.state)
    )
    setStates(prevStates => {
      console.log(prevStates)
      return [...prevStates, fetchedState]
    })
    // console.log(fetchedState, states)
    return states
  }
  async function getDistricts (state) {
    const districts = await Promise.all(
      locations.map(location => {
        if (location.state === state) return location.state
        else return null
      })
    )
    console.log(districts)
    return districts
  }
  function getBlocks (district) {
    setBlocks([])
    locations.forEach(location => {
      if (location.district === district) {
        setBlocks(prevValue => [...prevValue, location.block])
      }
    })
    console.log(blocks)
    return blocks
  }
  function getPanchayats (block) {
    setPanchayats([])
    locations.forEach(location => {
      if (location.block === block) {
        setPanchayats(prevValue => [...prevValue, location.panchayat])
      }
    })
    console.log(panchayats)
    return panchayats
  }

  async function setupFilter () {
    await getStates()
    await getDistricts(states[0])
  }
  useEffect(() => {
    if (dataLoaded) {
      console.log('setup called')
      setupFilter()
    }
  }, [dataLoaded])
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

      {/* Filtering seletions */}

      <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
        <div className='mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          <div>
            {/* State */}
            <Dropdown
              options={states}
              label='State'
              selected={selected.state}
            />
          </div>
          <div>
            {/* District */}
            <Dropdown
              options={districts}
              label='District'
              selected={selected.district}
            />
          </div>
          <div>
            {/* Block */}
            <Dropdown
              options={blocks}
              label='Block'
              selected={selected.block}
            />
          </div>
          <div>
            {/* Panchayat */}
            <Dropdown
              options={panchayats}
              label='Panchayat'
              selected={selected.panchayat}
            />
          </div>
        </div>
      </div>

      {/* Filter Results */}
      <h2 className='mx-auto mt-8 max-w-6xl px-4 text-lg font-medium leading-6 text-gray-900 sm:px-6 lg:px-8'>
        Found Attendance
      </h2>

      {attendances?.length === 0 ? (
        <div className='mx-auto max-w-7xl px-12 text-center pt-4'>
          <div className='rounded-xl border ring-gray-100 h-24 flex items-center justify-center'>
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
