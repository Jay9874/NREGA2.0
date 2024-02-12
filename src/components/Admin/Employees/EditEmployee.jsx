import React from 'react'
import { Link, useParams } from 'react-router-dom'

export default function EditEmployee () {
  const { id } = useParams()
  return (
    <>
      <Link to='..'>Back</Link>
      <div>EditEmployee</div>
    </>
  )
}
