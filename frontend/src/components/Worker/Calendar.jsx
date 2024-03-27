import React, { useEffect, useState } from 'react'
import { useWorkerStore } from '../../api/store'
import { Fragment } from 'react'
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
  MapPinIcon
} from '@heroicons/react/20/solid'
import { Menu, Transition } from '@headlessui/react'
import { getDaysArray } from '../../utils/generate_date'

const months = [
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
  'December'
]
const days = [
  { date: '2021-12-27' },
  { date: '2021-12-28' },
  { date: '2021-12-29' },
  { date: '2021-12-30' },
  { date: '2021-12-31' },
  { date: '2022-01-01', isCurrentMonth: true },
  { date: '2022-01-02', isCurrentMonth: true },
  { date: '2022-01-03', isCurrentMonth: true },
  { date: '2022-01-04', isCurrentMonth: true },
  { date: '2022-01-05', isCurrentMonth: true },
  { date: '2022-01-06', isCurrentMonth: true },
  { date: '2022-01-07', isCurrentMonth: true },
  { date: '2022-01-08', isCurrentMonth: true },
  { date: '2022-01-09', isCurrentMonth: true },
  { date: '2022-01-10', isCurrentMonth: true },
  { date: '2022-01-11', isCurrentMonth: true },
  { date: '2022-01-12', isCurrentMonth: true, isToday: true },
  { date: '2022-01-13', isCurrentMonth: true },
  { date: '2022-01-14', isCurrentMonth: true },
  { date: '2022-01-15', isCurrentMonth: true },
  { date: '2022-01-16', isCurrentMonth: true },
  { date: '2022-01-17', isCurrentMonth: true },
  { date: '2022-01-18', isCurrentMonth: true },
  { date: '2022-01-19', isCurrentMonth: true },
  { date: '2022-01-20', isCurrentMonth: true },
  { date: '2022-01-21', isCurrentMonth: true },
  { date: '2022-01-22', isCurrentMonth: true, isSelected: true },
  { date: '2022-01-23', isCurrentMonth: true },
  { date: '2022-01-24', isCurrentMonth: true },
  { date: '2022-01-25', isCurrentMonth: true },
  { date: '2022-01-26', isCurrentMonth: true },
  { date: '2022-01-27', isCurrentMonth: true },
  { date: '2022-01-28', isCurrentMonth: true },
  { date: '2022-01-29', isCurrentMonth: true },
  { date: '2022-01-30', isCurrentMonth: true },
  { date: '2022-01-31', isCurrentMonth: true },
  { date: '2022-02-01' },
  { date: '2022-02-02' },
  { date: '2022-02-03' },
  { date: '2022-02-04' },
  { date: '2022-02-05' },
  { date: '2022-02-06' }
]

function classNames (...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Calendar () {
  const { setAttendancePopup, selectedAttendance } = useWorkerStore()
  const [selectedMonth, setSelectedMonth] = useState()
  const [dates, setDates] = useState([])
  console.log(dates)
  useEffect(() => {
    console.log(selectedAttendance)
    setSelectedMonth(selectedAttendance.startMonth)
    // setDates(genDates(selectedAttendance.start, selectedAttendance.end))
    console.log(selectedAttendance.start, selectedAttendance.end)
    setDates(getDaysArray(selectedAttendance.start, selectedAttendance.end))
  }, [])
  return (
    <div className='min-h-1/2'>
      <div className='bg-white shadow-md px-6 py-6 rounded-md border-1 border-gray-200'>
        <h2 className='text-lg font-semibold text-gray-900'>
          Daily attendance of site.
        </h2>

        {/* The calendar codes */}
        {/* <div className='lg:grid lg:grid-cols-2 lg:gap-x-16'> */}
        <div className='mt-10 text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:mt-9 xl:col-start-9'>
          <div className='flex items-center text-gray-900 '>
            <button
              type='button'
              className='-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500'
            >
              <span className='sr-only'>Previous month</span>
              <ChevronLeftIcon className='h-5 w-5' aria-hidden='true' />
            </button>
            <div className='flex-auto font-semibold'>
              {months[selectedMonth]}
              {', '}
              {selectedAttendance.startYear}
            </div>
            <button
              type='button'
              className='-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500'
            >
              <span className='sr-only'>Next month</span>
              <ChevronRightIcon className='h-5 w-5' aria-hidden='true' />
            </button>
          </div>
          <div className='mt-6 grid grid-cols-7 text-xs leading-6 text-gray-500'>
            <div>M</div>
            <div>T</div>
            <div>W</div>
            <div>T</div>
            <div>F</div>
            <div>S</div>
            <div>S</div>
          </div>
          <div className='isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200'>
            {days.map((day, dayIdx) => (
              <button
                key={day.date}
                type='button'
                className={classNames(
                  'py-1.5 hover:bg-gray-100 focus:z-10',
                  day.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
                  (day.isSelected || day.isToday) && 'font-semibold',
                  day.isSelected && 'text-white',
                  !day.isSelected &&
                    day.isCurrentMonth &&
                    !day.isToday &&
                    'text-gray-900',
                  !day.isSelected &&
                    !day.isCurrentMonth &&
                    !day.isToday &&
                    'text-gray-400',
                  day.isToday && !day.isSelected && 'text-indigo-600',
                  dayIdx === 0 && 'rounded-tl-lg',
                  dayIdx === 6 && 'rounded-tr-lg',
                  dayIdx === days.length - 7 && 'rounded-bl-lg',
                  dayIdx === days.length - 1 && 'rounded-br-lg'
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
            ))}
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
