import Dropdown from '../Dropdown'
import { filterLoop } from '../../utils/locationDrops'
import { useWorkerStore } from '../../api/store'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import Calendar from './Calendar'
import DynamicTable from '../DynamicTable'
import { ChevronRightIcon } from '@heroicons/react/20/solid'

const tableHeading = [
  { name: 'Work', css_normal: '', css_list: '' },
  {
    name: 'Deadline',
    css_normal: 'lg:table-cell hidden',
    css_list: 'lg:table-cell'
  },
  {
    name: 'Presence',
    css_normal: 'sm:table-cell hidden',
    css_list: 'table-cell sm:hidden'
  }
]

export default function Attendance () {
  const {
    selectedAttendances,
    locations,
    loadingAttendance,
    setAttendancePopup,
    isAttendanceActive,
    selectAttendance,
    setAttndPopupData,
    onAttendanceFilterChange
  } = useWorkerStore()

  const [filterInitialized, setFilterInitialized] = useState(false)
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
  const [changedFilter, setChangedFilter] = useState(null)
  const filterLoopcallback = [
    { callback: setDistricts },
    { callback: setBlocks },
    { callback: setPanchayats }
  ]

  // filter only the required locations
  async function filterData (id, value) {
    return locations.filter(
      location => location[filterLoop[id].landmark] === value
    )
  }
  // looping to fill child filters
  async function getLandmarkData (id, value) {
    return new Promise(async (resolve, reject) => {
      try {
        filterLoop[id].landmarkValue = value
        filterLoop[id].callback = filterLoopcallback[id].callback
        var selection = {
          state: selected.state,
          district: selected.district,
          block: selected.block,
          panchayat: selected.panchayat
        }
        for (let i = id; i < 3; i++) {
          const landmarkValue =
            i === id ? value : filterLoop[i - 1].landmarkValue
          const newLocations = await filterData(i, landmarkValue)
          const fetchedLandmarkData = newLocations.map(
            location => location[filterLoop[i].toFetch]
          )
          filterLoopcallback[i].callback([...new Set(fetchedLandmarkData)])
          selection[filterLoop[i].toFetch] = fetchedLandmarkData[0]
          setSelected(prev => ({
            ...prev,
            [filterLoop[i].toFetch]: fetchedLandmarkData[0]
          }))
          filterLoop[i].fetchedDatas = fetchedLandmarkData
          filterLoop[i].landmarkValue = fetchedLandmarkData[0]
        }
        resolve(selection)
      } catch (error) {
        toast.error(error)
        reject(error)
      }
    })
  }

  // Initialize filter
  async function initFilter () {
    try {
      const fetchedStates = locations.map(location => location.state)
      setStates([...new Set(fetchedStates)])
      var result = await getLandmarkData(0, fetchedStates[0])
      result.state = fetchedStates[0]
      setSelected(result)
      setFilterInitialized(true)
      const data = await onAttendanceFilterChange(result)
      return result
    } catch (error) {
      console.log(error)
    }
  }

  // Handle any filter change except panchayat
  function handleChange (id, label, value) {
    try {
      setSelected(prev => ({ ...prev, [label]: value }))
      setChangedFilter({ id, label, value })
    } catch (err) {
      console.log(err)
      return err
    }
  }
  // handle panchayat filter change
  async function handlePanchayatChange (id, label, value) {
    try {
      if (locations.length == 0)
        return toast.message('Cant move out of universe.')

      setSelected(prev => ({ ...prev, [label]: value }))
      const data = await onAttendanceFilterChange({
        ...selected,
        [label]: value
      })
    } catch (err) {
      console.log(err)
    }
  }

  // Handle row click to view day wise attendance
  async function handleRowClick (e, row) {
    try {
      await setAttndPopupData(row)
      await selectAttendance(row)
      setAttendancePopup(true)
    } catch (err) {
      console.log(err)
      return null
    }
  }

  async function handleFilterChange (id, label, value) {
    try {
      if (locations.length === 0)
        return toast.message('Cant move out of universe.')
      let selection = await getLandmarkData(id, value)
      selection = { ...selection, [label]: value }
      const data = await onAttendanceFilterChange(selection)
    } catch (err) {
      console.log(err)
      return err
    }
  }

  useEffect(() => {
    if (locations.length == 0) {
      setStates(['in a galaxy'])
      setDistricts(['far'])
      setBlocks(['far'])
      setPanchayats(['away'])
      setSelected({
        state: 'in a galaxy',
        district: 'far',
        block: 'far',
        panchayat: 'away'
      })
    } else {
      if (!loadingAttendance) initFilter()
    }
  }, [])

  // side effects for filter change
  useEffect(() => {
    if (changedFilter) {
      const { id, label, value } = changedFilter
      handleFilterChange(id, label, value)
    }
  }, [changedFilter])

  return (
    // The Attendance popup
    <div>
      {isAttendanceActive && (
        <div className='fixed md:ml-64 overflow-scroll md:px-16 px-4 backdrop-blur-sm py-16 bg-gray-300 bg-opacity-75 inset-0 h-full min-h-[100vh] max-w-full z-20'>
          <Calendar />
        </div>
      )}

      {/* Attendance filter */}
      <main className='flex-1 pb-8 relative z-10 px-4'>
        <div className='px-4 py-6 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8'>
          <div className='pb-5'>
            <h3 className='text-lg font-medium leading-6 text-gray-900'>
              Your Attendance
            </h3>
            <p className='mt-2 max-w-4xl text-sm text-gray-500'>
              Across locations. Change State, Block, District or Panchayat to
              view specific attendance.
            </p>
          </div>
        </div>

        {/* Filtering seletions */}
        {filterInitialized && (
          <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
            <div className='mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
              <div className='relative z-50'>
                <Dropdown
                  options={states}
                  label='state'
                  selected={selected.state}
                  onChange={handleChange}
                  id={0}
                />
              </div>
              <div className='relative z-40'>
                <Dropdown
                  options={districts}
                  label='district'
                  selected={selected.district}
                  onChange={handleChange}
                  id={1}
                />
              </div>
              <div className='relative z-30'>
                <Dropdown
                  options={blocks}
                  label='block'
                  selected={selected.block}
                  onChange={handleChange}
                  id={2}
                />
              </div>
              <div className='relative z-20'>
                <Dropdown
                  options={panchayats}
                  label='panchayat'
                  selected={selected.panchayat}
                  id={3}
                  onChange={handlePanchayatChange}
                />
              </div>
            </div>
          </div>
        )}

        {/* Filter Results */}
        <h2 className='mx-auto mt-8 max-w-6xl px-4 text-lg font-medium leading-6 text-gray-900 sm:px-6 lg:px-8'>
          Found attendance
        </h2>
        {loadingAttendance ? (
          <div className='mx-auto max-w-7xl px-6 text-center pt-4'>
            <div className='rounded-xl border-0 ring-1 ring-gray-100 h-24 flex items-center justify-center'>
              <p className='mt-2 text-lg font-medium text-black text-opacity-50 animate-pulse'>
                Fetching attendance...
              </p>
            </div>
          </div>
        ) : locations.length === 0 ? (
          <div className='mx-auto max-w-7xl px-6 text-center pt-4'>
            <div className='rounded-xl border-0 ring-1 ring-gray-100 h-24 flex items-center justify-center'>
              <p className='mt-2 text-lg font-medium text-black text-opacity-50 animate-pulse'>
                Turning on the hyper space mode...
              </p>
            </div>
          </div>
        ) : (
          <DynamicTable
            data={selectedAttendances}
            headings={tableHeading}
            loading={loadingAttendance}
            rowNext={true}
            rowClick={handleRowClick}
            actionHeader='View'
            actionButton={ChevronRightIcon}
          />
        )}
      </main>
    </div>
  )
}
