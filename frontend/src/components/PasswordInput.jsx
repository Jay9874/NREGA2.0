import { useState, useEffect, useRef } from 'react'

export default function PasswordInput ({
  label,
  name,
  value,
  hint,
  id,
  placeholder,
  onChange,
  disabled,
  parentClass
}) {
  const [showPassword, setShowPassword] = useState(false)
  const crossRef = useRef(null)
  useEffect(() => {
    if (crossRef.current) {
      const len = crossRef.current.getTotalLength()
      crossRef.current.style.strokeDasharray = len
    }
  }, [])

  function handleEyeBtn (e) {
    if (showPassword) {
      setShowPassword(false)
    } else {
      setShowPassword(true)
    }
  }

  return (
    <div className={parentClass}>
      <label
        htmlFor='password'
        className='block text-sm font-medium text-gray-700'
      >
        {label}
      </label>
      <div className='mt-1 flex rounded-md shadow-sm'>
        <div className='relative flex flex-grow items-stretch focus-within:z-10'>
          <input
            className='block w-full rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            type={`${showPassword ? 'text' : 'password'}`}
            name={name}
            id={id}
            disabled={disabled}
            required
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            aria-describedby='password-description'
            autoComplete='new-password'
            title={hint}
          />
        </div>
        <button
          type='button'
          onClick={handleEyeBtn}
          className='relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
        >
          <svg width='20' height='15' xmlns='http://www.w3.org/2000/svg'>
            <path
              className='stroke-gray-400'
              d='M2.5 7.5 a 8.5 8.5 0 0 1 15 0 a 8.5 8.5 0 0 1 -15 0 z'
              fill='transparent'
            />

            <circle className='fill-gray-400' cx='10' cy='7.5' r={3} />
            {/* the indicator */}
            <path
              ref={crossRef}
              className={`eye-btn ${
                showPassword ? 'strike-off' : 'strike'
              } fill-gray-400 stroke-gray-400`}
              d='M3 0.5 l 14 14'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
