import React from 'react'
import TabHighlight from './TabHighlight'
import AdminCard from './AdminCard'

export default function PaymentTab () {
  return (
    <div>
      <div className='pb-4'>
        <div className='w-1/3 h-3 bg-gray-200 rounded-full dark:bg-gray-700 me-3' />
        <div className='w-2/3 h-2 mt-2 bg-gray-200 rounded-full dark:bg-gray-700 me-3' />
        <div className='w-full h-2 mt-2 bg-gray-200 rounded-full dark:bg-gray-700 me-3' />
      </div>
      <TabHighlight />
      <div className='recent-payments pt-12'>
        <div className='w-1/3 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 me-3' />
        <div className='w-2/3 h-2 mt-2 bg-gray-200 rounded-full dark:bg-gray-700 me-3' />
        <div className='payment-load-cont pt-4 w-full'>
          <AdminCard />
        </div>
      </div>
    </div>
  )
}
