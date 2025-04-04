import React, { useEffect, useState } from 'react'

export default function DynamicCalendarSVG ({ dateObj }) {
  const [date, setDate] = useState({
    day: '',
    month: ''
  })
  useEffect(() => {
    let dt = new Date(dateObj)
    let day = dt.getDate()
    const format = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(
      dt
    )
    setDate({ day: day, month: format })
  }, [dateObj])

  return (
    <svg
      viewBox='0 0 512 512'
      xmlns='http://www.w3.org/2000/svg'
      width={36}
      height={36}
      fill='white'
      className='stroke-gray-500'
    >
      <rect
        x={48}
        y={80}
        width={416}
        height={384}
        rx={48}
        strokeLinejoin='round'
        strokeWidth={24}
      />
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M128 48v32M384 48v32M464 208H48'
        strokeWidth={24}
      />
      <g className='fill-gray-500' fontFamily='arial' textAnchor='middle'>
        <text x={256} y={168} fontSize={96}>
          {date.month}
        </text>
        <text x={256} y={394} fontSize={196} fill='red'>
          {date.day}
        </text>
      </g>
    </svg>
  )
}
