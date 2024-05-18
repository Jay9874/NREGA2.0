import React, { useState } from 'react'

export default function FeatureToggler({ handleToggler }) {
  const [active, setActive] = useState(0)
  return (
    <div className='feature-toggler'>
      <button
        onClick={() => setActive(0)}
        className={active === 0 ? 'active' : ''}
      >
        <p>Worker Panel</p>
      </button>
      <button
        name='live'
        value={1}
        onClick={() => setActive(1)}
        className={active === 1 ? 'active' : ''}
      >
        <p>Admin Panel</p>
      </button>
      <div className='toggle-activator'></div>
    </div>
  )
}
