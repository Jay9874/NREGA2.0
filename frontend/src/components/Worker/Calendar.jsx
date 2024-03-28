import React, { useEffect, useState } from 'react'
import { useWorkerStore } from '../../api/store'
import { Fragment } from 'react'
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
  MapPinIcon,
} from '@heroicons/react/20/solid'
import { Menu, Transition } from '@headlessui/react'

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
    attndDates,
    attndMonths,
    setAttndDates,
    isFormatingPopup,
  } = useWorkerStore()
  const [selectedMonth, setSelectedMonth] = useState()

  console.log(attndDates)
  useEffect(() => {
    // setSelectedMonth(selectedAttendance.startMonth)
    setSelectedMonth((prev) => {
      return attndMonths.map((month) => {
        const monthNum = month.slice(1) * 1
        const yearNum = month.slice(-4) * 1
        console.log(monthNum, yearNum)
        // return `${months[month.slice]}`
        return month
      })
    })
    setAttndDates(1)
  }, [])

  return isFormatingPopup ? (
    <div className='w-1/2 h-[calc(100vh - 20px)] px-24 py-12 text-center'>
      Please Wait
    </div>
  ) : (
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
            {days.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </div>
          <div className='isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200'>
            {attndDates.map((day, dayIdx) => {
              return (
                <button
                  key={day.date}
                  type='button'
                  className={classNames(
                    'py-1.5 hover:bg-gray-100 focus:z-10',
                    day.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
                    dayIdx === 0 && `col-start-${day.weekDay}`
                    // (day.isSelected || day.isToday) && 'font-semibold',
                    // day.isSelected && 'text-white',
                    // !day.isSelected &&
                    //   day.isCurrentMonth &&
                    //   !day.isToday &&
                    //   'text-gray-900',
                    // !day.isSelected &&
                    //   !day.isCurrentMonth &&
                    //   !day.isToday &&
                    //   'text-gray-400',
                    // day.isToday && !day.isSelected && 'text-indigo-600',
                    // dayIdx === 0 && 'rounded-tl-lg',
                    // dayIdx === 6 && 'rounded-tr-lg',
                    // dayIdx === days.length - 7 && 'rounded-bl-lg',
                    // dayIdx === days.length - 1 && 'rounded-br-lg'
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
            })}
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
