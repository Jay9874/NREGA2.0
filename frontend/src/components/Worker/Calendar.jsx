import React, { useEffect, useState } from 'react'
import { useWorkerStore } from '../../api/store'
import { DataTable } from '../Errors'

function classNames (...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Calendar () {
  const {
    setAttendancePopup,
    isFormatingPopup,
    attndMonths,
    setAttndDates,
    setFormatingPopup,
    currActiveDates,
    selectedAttendance
  } = useWorkerStore()

  // State Variables
  const [selectedMonth, setSelectedMonth] = useState()
  const [months, setMonths] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dataInitialize, setDataInitialize] = useState(false)
  const [changeDates, setChangeDates] = useState(true)

  // Functions
  async function setupAttnd () {
    try {
      const fetchedMonths = [...attndMonths.values()]
      setMonths(fetchedMonths)
      setSelectedMonth(fetchedMonths[currentIndex])
      await setAttndDates(fetchedMonths[currentIndex].uniqueID)
      setDataInitialize(true)
      setChangeDates(false)
    } catch (err) {
      console.log(err)
    }
  }

  const handleChange = async () => {
    try {
      setChangeDates(true)
      setSelectedMonth(months[currentIndex])
      await setAttndDates(months[currentIndex].uniqueID)
      setFormatingPopup(false)
      setChangeDates(false)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (!dataInitialize) {
      setupAttnd()
    } else {
      handleChange()
    }
  }, [currentIndex])


  return isFormatingPopup ? (
    <div className=' bg-white mt-6  text-center shadow-md px-6 py-6 rounded-md border-1 border-gray-200'>
      <DataTable />
    </div>
  ) : (
    <div className='px-0 sm:px-6 py-6'>
      <div className='bg-white shadow-md px-6 py-6 rounded-md border-1 border-gray-200'>
        <div className='text-md font-bold text-gray-900'>
          Daily Attendances
          <br />
          <p className='text-sm text-gray-500 font-normal pt-2'>
            for{' '}
            <span className='text-gray-600 font-medium'>
              {selectedAttendance.Work}
            </span>{' '}
            <br />
            at{' '}
            <span className='text-gray-600 font-medium'>
              {selectedAttendance.Location}
            </span>
            <br />
            started{' '}
            <span className='text-gray-600 font-medium'>
              {selectedAttendance.Started}
            </span>
          </p>
        </div>

        {/* The calendar codes */}
        <div className='mt-2 text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:mt-9 xl:col-start-9'>
          <div className='relative p-2 w-full overflow-hidden rounded-2xl'>
            <div
              className='flex transition-transform duration-500 ease-in-out'
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
                width: '100%'
              }}
            >
              {months.map((month, index) => (
                <div
                  key={index}
                  className={`w-full h-8 flex items-center justify-center text-black text-sm font-bold rounded-2xl shrink-0`}
                  style={{ minWidth: '100%' }}
                >
                  {month.str}
                </div>
              ))}
            </div>
            {/* Prev month button */}
            {selectedMonth?.idx >= 1 && (
              <button
                onClick={e =>
                  setCurrentIndex(
                    prevIndex => (prevIndex - 1 + months.length) % months.length
                  )
                }
                // className='absolute flex justify-center items-center left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-100 text-white p-2 rounded-full'
               className='absolute flex justify-center items-center left-2 top-1/2 transform -translate-y-1/2  rounded-full bg-white p-2 shadow-md transition-colors hover:bg-gray-100 disabled:opacity-50'
              >
                <ion-icon name='chevron-back-outline'></ion-icon>
              </button>
            )}
            {/* Next month button */}
            {selectedMonth?.idx < months?.length - 1 && (
              <button
                onClick={e =>
                  setCurrentIndex(prevIndex => (prevIndex + 1) % months.length)
                }
                // className='absolute flex justify-center items-center right-0 top-1/2 transform -translate-y-1/2 rounded-full bg-gray-200 hover:bg-gray-100 text-white p-2'
                className='absolute flex justify-center items-center right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition-colors hover:bg-gray-100 disabled:opacity-50'
              >
                <ion-icon name='chevron-forward-outline'></ion-icon>
              </button>
            )}
          </div>

          <div className='isolate mt-4 grid grid-cols-7 rounded-lg px-1 py-1 grid-rows-5 gap-px gap-y-0.5 bg-gray-200 text-sm shadow ring-1 ring-gray-200'>
            {changeDates ? (
              <div>Changing dates...</div>
            ) : (
              currActiveDates?.map((day, dayIdx) => {
                return (
                  <div
                    key={dayIdx}
                    type='button'
                    className={classNames(
                      'py-1.5 bg-gray-50',
                      day.status === 'absent' && 'bg-red-200',
                      day.status === 'present' && 'bg-green-200',
                      dayIdx % 7 === 0 && 'rounded-tl-lg',
                      dayIdx % 7 === 6 && 'rounded-tr-lg',
                      dayIdx % 7 === 0 && 'rounded-bl-lg',
                      dayIdx % 7 === 6 && 'rounded-br-lg'
                    )}
                  >
                    <time
                      dateTime={day.date}
                      className='mx-auto flex h-7 w-7 items-center justify-center rounded-full'
                    >
                      {day.date}
                    </time>
                  </div>
                )
              })
            )}
          </div>
        </div>
        <div className='mt-2'>
          <div className='flex  items-center'>
            <div className='w-6 h-3 bg-green-500 inline-block rounded-sm' />{' '}
            <span className='whitespace-pre font-normal text-sm text-gray-500'>
              {' '}
              Present
            </span>
          </div>
          <div className='flex  items-center'>
            <div className='w-6 h-3 bg-red-500 inline-block rounded-sm' />{' '}
            <span className='whitespace-pre font-normal text-sm text-gray-500'>
              {' '}
              Absent
            </span>
          </div>
          <div className='flex  items-center'>
            <div className='w-6 h-3 bg-gray-200 inline-block rounded-sm' />{' '}
            <span className='whitespace-pre font-normal text-sm text-gray-500'>
              {' '}
              Not given / Holiday
            </span>
          </div>
        </div>
        <button
          type='button'
          onClick={() => setAttendancePopup(false)}
          className='mt-8 text-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
        >
          Close
        </button>
      </div>
    </div>
  )
}
