import React, { useRef, useEffect } from 'react'

export default function EyeButton ({ showPassword, handleEyeBtn }) {
  

  return (
    <button
      type='button'
      onClick={handleEyeBtn}
      className='relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
    >
      <svg width='20' height='15' xmlns='http://www.w3.org/2000/svg'>
        {/* The eye lids */}
        <path
          className='stroke-gray-400'
          d='M2.5 7.5 a 8.5 8.5 0 0 1 15 0 a 8.5 8.5 0 0 1 -15 0 z'
          fill='transparent'
        />
        {/* the pupil */}
        <circle className='fill-gray-400' cx='10' cy='7.5' r={3} />
        {/* the indicator */}
        <path
          className={`eye-btn ${
            showPassword ? 'strike-off' : 'strike'
          } fill-gray-400 stroke-gray-400`}
          d='M3 0.5 l 14 14'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </button>
  )
}
