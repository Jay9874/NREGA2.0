import React, { useEffect, useState } from 'react'
import { useWorkerStore } from '../../api/store'
import { DataTable } from '../Errors'
import { Fragment } from 'react'
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
  MapPinIcon,
} from '@heroicons/react/20/solid'
import { Menu, Transition } from '@headlessui/react'

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Calendar() {
  const {
    setAttendancePopup,
    selectedAttendance,
    isFormatingPopup,
    attndMonths,
    setAttndDates,
    setFormatingPopup,
    currActiveDates,
  } = useWorkerStore()
  const [selectedMonth, setSelectedMonth] = useState()
  const [months, setMonths] = useState([])
  const [active, setActive] = useState(0)
  const [dataInitialize, setDataInitialize] = useState(false)
  const [changeDates, setChangeDates] = useState(true)

  async function setupMonths() {
    return new Promise(async (resolve, reject) => {
      try {
        const newMonths = attndMonths.map((month, idx) => {
          const monthNum = Number(month.slice(0, 2))
          const yearNum = Number(month.slice(3, 7))
          const date = {
            str: `${monthNames[monthNum - 1]}, ${yearNum}`,
            num: monthNum,
            idx: idx,
          }
          return date
        })
        setMonths(newMonths)
        resolve(newMonths)
        return newMonths
      } catch (err) {
        reject(err)
        return null
      }
    })
  }
  async function setupAttnd() {
    try {
      const fetchedMonths = await setupMonths()
      setSelectedMonth(fetchedMonths[active])
      await setAttndDates(fetchedMonths[active].num)
      setDataInitialize(true)
      setChangeDates(false)
    } catch (err) {
      console.log(err)
    }
  }

  async function handleMonthChange(dir) {
    if (dir === 'N') {
      setActive((prev) => prev + 1)
    } else if (dir === 'P') {
      setActive((prev) => prev - 1)
    }
  }

  async function onMonthChange() {
    setChangeDates(true)
    setSelectedMonth(months[active])
    await setAttndDates(months[active].num)
    setFormatingPopup(false)
    setChangeDates(false)
  }

  useEffect(() => {
    if (!dataInitialize) {
      setupAttnd()
    } else {
      onMonthChange()
    }
  }, [active])

  return isFormatingPopup ? (
    <div className=' bg-white text-center shadow-md px-6 py-6 rounded-md border-1 border-gray-200'>
      <DataTable />
    </div>
  ) : (
    <div className='min-h-1/2'>
      <div className='bg-white shadow-md px-6 py-6 rounded-md border-1 border-gray-200'>
        <h2 className='text-lg font-semibold text-gray-900'>
          Daily Attendances <span className='text-gray-400'>of the site</span>
        </h2>

        {/* The calendar codes */}
        <div className='mt-6 text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:mt-9 xl:col-start-9'>
          <div className='flex items-center text-gray-900 '>
            {selectedMonth?.idx >= 1 && (
              <button
                type='button'
                onClick={() => handleMonthChange('P')}
                className='-m-1.5 px-2 py-2 rounded-full bg-gray-50 flex flex-none items-center justify-center p-1.5 text-gray-900 hover:bg-gray-100'
              >
                <span className='sr-only'>Previous month</span>
                <ChevronLeftIcon className='h-5 w-5' aria-hidden='true' />
              </button>
            )}

            <div className='flex-auto font-semibold'>{selectedMonth?.str}</div>
            {selectedMonth?.idx < months?.length - 1 && (
              <button
                type='button'
                onClick={() => handleMonthChange('N')}
                className='-m-1.5 px-2 py-2 rounded-full bg-gray-50 flex flex-none items-center justify-center p-1.5 text-gray-900 hover:bg-gray-100'
              >
                <span className='sr-only'>Next month</span>
                <ChevronRightIcon className='h-5 w-5' aria-hidden='true' />
              </button>
            )}
          </div>
          <div className='isolate mt-4 grid grid-cols-7 rounded-lg px-1 py-1 grid-rows-5 gap-px bg-gray-200 text-sm shadow ring-1 ring-gray-200'>
            {changeDates ? (
              <div>Changing dates...</div>
            ) : (
              currActiveDates.map((day, dayIdx) => {
                return (
                  <button
                    key={day.date}
                    type='button'
                    className={classNames(
                      'py-1.5 ',
                      day.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
                      day.status === 'absent' && 'bg-red-200',
                      day.status === 'present' && 'bg-green-200',
                      dayIdx % 7 === 0 && 'rounded-tl-lg',
                      dayIdx % 7 === 6 && 'rounded-tr-lg',
                      dayIdx % 7 === days.length - 7 && 'rounded-bl-lg',
                      dayIdx % 7 === days.length - 1 && 'rounded-br-lg'
                    )}
                  >
                    <time
                      dateTime={day.date}
                      className={classNames(
                        'mx-auto flex h-7 w-7 items-center justify-center rounded-full',
                        day.isSelected && day.isToday && 'bg-indigo-600',
                        day.isSelected && !day.isToday && 'bg-gray-900'
                      )}
                    >
                      {day.date.split('-').pop().replace(/^0/, '')}
                    </time>
                  </button>
                )
              })
            )}
          </div>
        </div>
        <div className='mt-2'>
          <div className='flex  items-center'>
            <div className='w-6 h-3 bg-green-500 inline-block rounded-sm' />{' '}
            <span className='whitespace-pre'> Present</span>
          </div>
          <div className='flex  items-center'>
            <div className='w-6 h-3 bg-red-500 inline-block rounded-sm' />{' '}
            <span className='whitespace-pre'> Absent</span>
          </div>
          <div className='flex  items-center'>
            <div className='w-6 h-3 bg-gray-200 inline-block rounded-sm' />{' '}
            <span className='whitespace-pre'> Not Given</span>
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
