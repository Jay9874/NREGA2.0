import { Disclosure } from '@headlessui/react'
import { Link } from 'react-router-dom'
import logo from '../assets/images/logo.png'

export default function CommonNav () {
  return (
    <>
      <Disclosure
        as='nav'
        className='fixed top-0 left-0 right-0 z-50 bg-white shadow'
      >
        {() => (
          <>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
              <div className='flex h-16 justify-between'>
                <div className='flex'>
                  <div className='flex flex-shrink-0 items-center'>
                    <Link to='/'>
                      <img
                        className='block h-8 w-auto lg:hidden'
                        src={logo}
                        alt='Your Company'
                      />
                    </Link>
                    <Link to='/'>
                      <img
                        className='hidden h-8 w-auto lg:block'
                        src={logo}
                        alt='Your Company'
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Disclosure>
    </>
  )
}
