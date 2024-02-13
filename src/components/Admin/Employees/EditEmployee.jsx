import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLongLeftIcon } from '@heroicons/react/24/solid'

export default function EditEmployee () {
  const { id } = useParams()
  return (
    <>
      <Link to='..'>
        <span className='px-24'>
          <ArrowLongLeftIcon
            className='h-12 w-12 text-indigo-600'
            aria-hidden='true'
            title='Back to Employees List'
          />
        </span>
      </Link>
      <div>EditEmployee</div>
    </>
  )
}
