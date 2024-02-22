import React from 'react'

export default function Input ({
  colValue,
  label,
  type,
  name,
  value,
  id,
  hint,
  placeholder,
  onChange,
  disabled
}) {
  return (
    <div className={colValue}>
      <label
        htmlFor={id}
        className='block text-sm font-medium leading-6 text-gray-900'
      >
        {label}
      </label>
      <div className='mt-2 w-full'>
        <input
          type={type}
          name={name}
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className='peer block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm'
          required
        />
        {disabled && (
          <p className='mt-2 invisible peer-disabled:visible text-gray-400 text-sm'>
            {hint}
          </p>
        )}
      </div>
    </div>
  )
}
