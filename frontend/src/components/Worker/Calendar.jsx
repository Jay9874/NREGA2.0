import React, { useEffect, useState } from 'react'
import { useWorkerStore } from '../../api/store'
import { DataTable } from '../Errors'
import { Fragment } from 'react'
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
  MapPinIcon
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
  'December'
]

const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
function classNames (...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Calendar () {
  const {
    setAttendancePopup,
    selectedAttendance,
    isFormatingPopup,
    attndDates,
    attndMonths,
    setAttndDates,
    setFormatingPopup
  } = useWorkerStore()
  const [selectedMonth, setSelectedMonth] = useState()
  const [months, setMonths] = useState([])
  const [active, setActive] = useState(0)

  async function setupMonths () {
    return new Promise(async (resolve, reject) => {
      try {
        const newMonths = await attndMonths.map((month, idx) => {
          const monthNum = Number(month.slice(0, 2))
          const yearNum = Number(month.slice(3, 7))
          return {
            str: `${monthNames[monthNum - 1]}, ${yearNum}`,
            num: monthNum,
            idx: idx
          }
        })
        setMonths(newMonths)
        resolve(newMonths)
      } catch (err) {
        reject(err)
        return null
      }
    })
  }
  async function setupAttnd () {
    try {
      const fetchedMonths = await setupMonths()
      setSelectedMonth(fetchedMonths[active])
      handleMonthChange('I')
    } catch (err) {
      console.log(err)
    }
  }

  async function handleMonthChange (dir) {
    let currActive = active
    if (dir === 'N') {
      setActive(prev => prev++)
      currActive++
    } else if (dir === 'P') {
      setActive(prev => prev--)
      currActive--
    }
    setSelectedMonth(months[currActive])
    setFormatingPopup(false)
  }
  console.log(months)
  useEffect(() => {
    setAttndDates(selectedMonth?.num)
    setFormatingPopup(false)
  }, [selectedMonth])

  return isFormatingPopup ? (
    <div className=' bg-white text-center shadow-md px-6 py-6 rounded-md border-1 border-gray-200'>
      <DataTable />
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
            {selectedMonth?.idx >= 1 && (
              <button
                type='button'
                onClick={() => handleMonthChange('P')}
                className='-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500'
              >
                <span className='sr-only'>Previous month</span>
                <ChevronLeftIcon className='h-5 w-5' aria-hidden='true' />
              </button>
            )}

            <div className='flex-auto font-semibold'>{selectedMonth?.str}</div>
            {selectedMonth?.idx < months?.length && (
              <button
                type='button'
                onClick={() => handleMonthChange('N')}
                className='-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500'
              >
                <span className='sr-only'>Next month</span>
                <ChevronRightIcon className='h-5 w-5' aria-hidden='true' />
              </button>
            )}
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
