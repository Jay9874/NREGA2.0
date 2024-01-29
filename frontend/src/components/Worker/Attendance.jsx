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
  const [states, setStates] = useState([])
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
    return fetchedState
  }
  async function getDistricts (state) {
    const fetchedDistricts = await Promise.all(
      locations.map(location => {
        if (location.state === state) return location.district
        else return null
      })
    )
    return fetchedDistricts
  }
  async function getBlocks (district) {
    const fetchedBlocks = await Promise.all(
      locations.map(location => {
        if (location.district === district) return location.block
        else return null
      })
    )
    return fetchedBlocks
  }
  async function getPanchayats (block) {
    const fetchedPanchayats = await Promise.all(
      locations.map(location => {
        if (location.block === block) return location.panchayat
        else return null
      })
    )
    return fetchedPanchayats
  }

  async function setupFilter (address) {
    const stateData = await getStates()
    setStates(stateData)
    setSelected((prev) => ({...prev, state: stateData[0]}))

    const districtData = await getDistricts(stateData[0])
    setDistricts(districtData)
    setSelected((prev) => ({...prev, district: districtData[0]}))

    const blockData = await getBlocks(districtData[0])
    setBlocks(blockData)
    setSelected((prev) => ({...prev, block: blockData[0]}))

    const panchayatData = await getPanchayats(blockData[0])
    setPanchayats(panchayatData)
    setSelected((prev) => ({...prev, panchayat: panchayatData[0]}))
  }

  useEffect(() => {
    if (dataLoaded) {
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
      {dataLoaded && (
        <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
          <div className='mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
            <div>
              <Dropdown
                options={states}
                label='State'
                selected={selected.state}

              />
            </div>
            <div>
              <Dropdown
                options={districts}
                label='District'
                selected={selected.district}
              />
            </div>
            <div>
              <Dropdown
                options={blocks}
                label='Block'
                selected={selected.block}
              />
            </div>
            <div>
              <Dropdown
                options={panchayats}
                label='Panchayat'
                selected={selected.panchayat}
              />
            </div>
          </div>
        </div>
      )}

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
