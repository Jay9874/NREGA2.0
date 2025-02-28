import React, { useState } from 'react'

export default function InputWithButton ({
  label,
  type,
  name,
  value,
  id,
  placeholder,
  loading,
  onChange,
  srOnly,
  title,
  hint,
  onChange,
  buttonLabel,
  buttonClick
}) {
  const [demo, setDemo] = useState(false)
  async function handleDemoToggle (e) {
    try {
      if (!demo) {
        buttonClick()
        setDemo(true)
      } else {
        setDemo(false)
      }
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div className='lg:col-span-1 col-span-2 col-start-1 lg:col-start-2'>
      <div className='sm:max-w-md'>
        <div className='flex justify-between items-center'>
          <label
            htmlFor={id}
            className='block text-sm font-medium leading-6 text-gray-900 whitespace-nowrap'
          >
            {label}
          </label>

          {/* Demo toggler */}
          <div className='flex items-center gap-2'>
            <span className='text-sm font-normal text-gray-600'>Random</span>
            <Switch
              checked={demo}
              onChange={handleDemoToggle}
              className='group relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
            >
              <span className='sr-only'>{srOnly}</span>
              <span
                aria-hidden='true'
                className='pointer-events-none absolute h-full w-full rounded-md bg-white'
              />
              <span
                aria-hidden='true'
                className={classNames(
                  demo ? 'bg-green-600' : 'bg-gray-200',
                  'pointer-events-none absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out'
                )}
              />
              <span
                aria-hidden='true'
                className={classNames(
                  demo ? 'translate-x-5' : 'translate-x-0',
                  'pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full border border-gray-200 bg-white shadow ring-0 transition-transform duration-200 ease-in-out'
                )}
              />
            </Switch>
          </div>
        </div>
        <div className='mt-2'>
          <div className='mt-1 flex rounded-md shadow-sm'>
            <div className='relative flex flex-grow items-stretch focus-within:z-10'>
              <input
                type={type}
                name={name}
                id={id}
                value={value}
                onChange={() => onChange(e)}
                className='block w-full border-gray-300 rounded-none rounded-l-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                placeholder={placeholder}
                required
                title={title}
              />
            </div>
            <button
              type='button'
              disabled={loading ? true : false}
              onClick={buttonClick}
              className={
                loading
                  ? 'cursor-not-allowed'
                  : 'relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
              }
            >
              <CloudArrowDownIcon
                className='h-5 w-5 text-green-600'
                aria-hidden='true'
              />
              <span>{buttonLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
