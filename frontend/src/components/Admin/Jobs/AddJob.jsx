import React from 'react'
import { ArrowLongLeftIcon } from '@heroicons/react/20/solid'
import { Link } from 'react-router-dom'

export default function AddJob() {
  return (
    <main>
      {/* Bread crumbing to last url */}
      <Link to='..' className='w-fit'>
        <ArrowLongLeftIcon
          className='h-12 w-12 text-indigo-600'
          aria-hidden='true'
          title='Back to Employees List'
        />
      </Link>
      <div>Add a new Job</div>
    </main>
  )
}
