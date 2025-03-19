import React from 'react'
function classNames (...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function HighlightGrid ({ highlights, statusStyles }) {
  return (
    <div className=' bg-white pb-1 sm:pb-4 border-gray-200'>
      <div className='relative'>
        <div className='relative mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='mx-auto max-w-100 px-6'>
            <div className='sm:[&>*:nth-child(2)]:rounded-tr-2xl lg:[&>*:nth-child(3)]:rounded-none lg:[&>*:nth-child(2)]:rounded-none sm:[&>*:nth-child(3)]:rounded-bl-2xl mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-4'>
              {highlights.map((card, index) => (
                <div
                  key={index}
                  className='overflow-scroll first:rounded-t-2xl sm:first:rounded-tr-none last:rounded-b-2xl sm:last:rounded-bl-none sm:first:rounded-tl-2xl lg:first:rounded-l-2xl sm: lg:last:rounded-r-2xl sm:last:rounded-br-2xl flex flex-col bg-white border p-6 text-center'
                >
                  <dd className='text-lg font-bold text-gray-800 tracking-tight'>
                    {card.label == 'Status' ? (
                      <span
                        className={classNames(
                          statusStyles[card.value],
                          'px-3 rounded-3xl capitalize text-md'
                        )}
                      >
                        {card.value}
                      </span>
                    ) : (
                      card.value
                    )}
                  </dd>
                  <dt className='truncate text-sm text-gray-600 mt-1 leading-6 '>
                    {card.label}
                  </dt>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
