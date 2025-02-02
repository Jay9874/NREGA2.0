import React from 'react'
import AdminCard from './AdminCard'

export default function HomeLoading () {
  return (
    <div className='px-8 sm:px-10 lg:px-12 py-6 animate-pulse'>
      <div className='avatar-loading flex items-center flex-wrap'>
        <div className='avatar-cont pl-4'>
          <svg
            className='w-16 h-16 text-gray-200 dark:text-gray-700'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path d='M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z' />
          </svg>
        </div>

        <div className='pl-4 pt-4'>
          <div className='flex pb-4 flex-wrap gap-2'>
            <div className='w-20 h-3.5 bg-gray-200 rounded-full dark:bg-gray-700 me-3'></div>
            <div className='w-40 h-3.5 bg-gray-200 rounded-full dark:bg-gray-700'></div>
          </div>
          <div className='flex flex-wrap gap-2'>
            <div className='w-40 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 me-3' />
            <div className='w-24 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 me-3' />
          </div>
        </div>
      </div>

      {/* Cards loading */}
      <div className='cards-loading w-full pt-12'>
        <div className='w-40 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 me-3' />
        <div className='pt-6 load-card-cont flex gap-6 w-full justify-evenly items-center flex-wrap lg:flex-nowrap'>
          <AdminCard />
          <AdminCard />
          <AdminCard />
        </div>
      </div>
      {/* Recent payment activity */}
      <div className='recent-payments pt-12'>
        <div className='w-40 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 me-3' />
        <div className='payment-load-cont pt-4 w-full'>
          <AdminCard />
        </div>
      </div>
    </div>
  )
}
