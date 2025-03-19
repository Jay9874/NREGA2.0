import React from 'react'
import { Link } from 'react-router-dom'

export default function OverviewCards ({ cards }) {
  return (
    <div className='mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
      {cards.map(card => (
        <div
          key={card.name}
          className='overflow-hidden rounded-lg bg-white shadow flex flex-col justify-between'
        >
          <div className='p-5'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <card.icon
                  className='h-6 w-6 text-gray-400'
                  aria-hidden='true'
                />
              </div>
              <div className='ml-5 w-0 flex-1'>
                <dl>
                  <dd>
                    <div className='truncate text-lg font-bold text-gray-900'>
                      {card.value}
                    </div>
                  </dd>
                  <dt className='truncate text-sm text-gray-600'>
                    {card.name}
                  </dt>
                </dl>
              </div>
            </div>
          </div>
          <div className='bg-gray-50 px-5 py-3'>
            <div className='text-sm'>
              <Link
                to={card.href}
                className='font-medium text-cyan-700 hover:text-cyan-900'
              >
                View all
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
