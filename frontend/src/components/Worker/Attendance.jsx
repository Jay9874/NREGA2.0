import Dropdown from '../Dropdown'
import { TableRow } from '../TableRow'
import { useWorkerStore } from '../../api/store'
import { useEffect, useState } from 'react'
import { supabase } from '../../api'

const statusStyles = {
  present: 'bg-green-100 text-green-800',
  absent: 'bg-red-100 text-gray-800'
}
const tableHeading = [{ name: 'Work' }, { name: 'Date' }, { name: 'Status' }]

export default function Attendance () {
  const { attendances, locations, dataLoaded } = useWorkerStore()
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

  async function getLandmarkData (landmark, landmarkValue, callback, toFetch) {
    const fetchedLandmarkData = await Promise.all(
      locations.map((location, index) => {
        if (!landmarkValue || location[landmark] === landmarkValue)
          return { id: index, value: location[toFetch] }
        else return null
      })
    )
    callback(fetchedLandmarkData)
    setSelected(prev => ({ ...prev, [toFetch]: fetchedLandmarkData[0].value }))
    return fetchedLandmarkData
  }

  async function initializeFilter () {
    const stateData = await getLandmarkData('state', '', setStates, 'state')
    const districtData = await getLandmarkData(
      'state',
      stateData[0].value,
      setDistricts,
      'district'
    )
    const blockData = await getLandmarkData(
      'district',
      districtData[0].value,
      setBlocks,
      'block'
    )
    await getLandmarkData(
      'block',
      blockData[0].value,
      setPanchayats,
      'panchayat'
    )
  }

  function handleChange (label, id) {
    console.log('changed', id, label)
  }

  // async function test () {
  //   await supabase
  //     .from('attendance')
  //     .select()
  //     .eq('user_id', userId)
  //     .then(({ data, error }) => console.log(data))
  // }

  useEffect(() => {
    if (dataLoaded) {
      initializeFilter()
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
                label='state'
                selected={selected.state}
                onChange={handleChange}
              />
            </div>
            <div>
              <Dropdown
                options={districts}
                label='district'
                selected={selected.district}
                onChange={handleChange}
              />
            </div>
            <div>
              <Dropdown
                options={blocks}
                label='block'
                selected={selected.block}
                onChange={handleChange}
              />
            </div>
            <div>
              <Dropdown
                options={panchayats}
                label='panchayat'
                selected={selected.panchayat}
                // onChange={getLocationAttendance}
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
