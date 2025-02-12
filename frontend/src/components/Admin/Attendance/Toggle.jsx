import { useState } from 'react'
import { Switch } from '@headlessui/react'
import { toast } from 'sonner'

function classNames (...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Toggle ({id, onToggle}) {
  const [scanning, setScanning] = useState(false)
  const [enabled, setEnabled] = useState(false)
  function onSwitch () {
    if (!enabled) {
      setScanning(true)
      toast.loading('Scanning fingerprint...')
      setTimeout(() => {
        setEnabled(true)
        onToggle('present', id)
        setScanning(false)
        toast.dismiss()
      }, 2000)
    } else{
      setEnabled(false)
      onToggle('absent', id)
      toast.dismiss()
    } 
  }
  return (
    <div className='flex items-center gap-1'>
      {scanning && <ion-icon name='finger-print-outline'></ion-icon>}
      <Switch
        checked={enabled}
        onChange={onSwitch}
        className={classNames(
          enabled ? 'bg-green-600' : scanning ? 'bg-gray-400' : 'bg-red-600',
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent ease-in-out'
        )}
      >
        <span className='sr-only'>Attendance Status</span>
        <span
          className={classNames(
            enabled ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
          )}
        >
          <span
            className={classNames(
              enabled
                ? 'opacity-0 ease-out duration-100'
                : 'opacity-100 ease-in duration-200',
              'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
            )}
            aria-hidden='true'
          >
            <svg
              className={classNames(
                'h-3 w-3',
                scanning ? 'text-gray-600' : 'text-red-600'
              )}
              fill='none'
              viewBox='0 0 12 12'
            >
              <path
                d='M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2'
                stroke='currentColor'
                strokeWidth={2}
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </span>
          <span
            className={classNames(
              enabled
                ? 'opacity-100 ease-in duration-200'
                : 'opacity-0 ease-out duration-100',
              'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
            )}
            aria-hidden='true'
          >
            <svg
              className='h-3 w-3 text-green-600'
              fill='currentColor'
              viewBox='0 0 12 12'
            >
              <path d='M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z' />
            </svg>
          </span>
        </span>
      </Switch>
    </div>
  )
}
