import React from 'react'

export default function TabHighlight () {
  return (
    <div className=' bg-white pb-1 sm:pb-4 border-gray-200'>
      <div className='relative'>
        <div className='relative mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='mx-auto max-w-100 px-6'>
            <div className='sm:[&>*:nth-child(2)]:rounded-tr-2xl lg:[&>*:nth-child(3)]:rounded-none lg:[&>*:nth-child(2)]:rounded-none sm:[&>*:nth-child(3)]:rounded-bl-2xl mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-4'>
              {[0, 0, 0, 0].map(index => (
                <div
                  key={index}
                  className='first:rounded-t-2xl sm:first:rounded-tr-none last:rounded-b-2xl sm:last:rounded-bl-none sm:first:rounded-tl-2xl lg:first:rounded-l-2xl sm: lg:last:rounded-r-2xl sm:last:rounded-br-2xl flex flex-col items-center bg-white border p-6'
                >
                  <p className='text-center w-1/2 h-3 bg-gray-200 rounded-full dark:bg-gray-700 me-3' />
                  <p className='w-1/2 h-3 mt-2 bg-gray-200 rounded-full dark:bg-gray-700 me-3' />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
