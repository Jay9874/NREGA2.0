import img1 from '../assets/images/bg.jpg'
import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import logo from '../assets/images/logo.png'
import { authStore } from '../api/store'
import { useNavigate } from 'react-router-dom'
import { Feature, Contact, Footer } from '../components/Home'

const navigation = [
  { name: 'Features', href: '#feature' },
  { name: 'Contact', href: '#contact' },
  { name: 'About', href: '#footer' }
]

export default function Home () {
  const navigate = useNavigate()
  const { checkSession } = authStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <div className='relative isolate overflow-hidden bg-gray-900'>
        <div className='min-h-[100vh]'>
          <div className='relative px-6 min-h-[100vh]'>
            <img
              src={img1}
              alt=''
              className='absolute inset-0 -z-10 h-full w-full object-cover brightness-50'
            />
            <nav
              className='flex items-center justify-between pt-6'
              aria-label='Global'
            >
              <div className='flex lg:flex-1'>
                <Link to='/' className='-m-1.5 p-1.5'>
                  <span className='sr-only'>Your Company</span>
                  <img className='h-8' src={logo} alt='logo' />
                </Link>
              </div>
              <div className='flex lg:hidden'>
                <button
                  type='button'
                  className='-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400'
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <span className='sr-only'>Open main menu</span>
                  <Bars3Icon className='h-6 w-6' aria-hidden='true' />
                </button>
              </div>
              <div className='hidden lg:flex lg:gap-x-12'>
                {navigation.map(item => (
                  <a
                    key={item.name}
                    href={item.href}
                    className='text-sm font-semibold leading-6 text-white'
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className='hidden lg:flex lg:flex-1 lg:justify-end'>
                <button
                  onClick={() => checkSession(navigate)}
                  className='text-sm font-semibold leading-6 text-white'
                >
                  Log in <span aria-hidden='true'>&rarr;</span>
                </button>
              </div>
            </nav>
            <Dialog as='div' open={mobileMenuOpen} onClose={setMobileMenuOpen}>
              <Dialog.Panel
                focus='true'
                className='fixed inset-0 z-10 overflow-y-auto bg-gray-900 px-6 py-6 lg:hidden'
              >
                <div className='flex items-center justify-between'>
                  <Link to='/' className='-m-1.5 p-1.5'>
                    <span className='sr-only'>Your Company</span>
                    <img className='h-8' src={logo} alt='logo' />
                  </Link>
                  <button
                    type='button'
                    className='-m-2.5 rounded-md p-2.5 text-gray-400'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className='sr-only'>Close menu</span>
                    <XMarkIcon className='h-6 w-6' aria-hidden='true' />
                  </button>
                </div>
                <div className='mt-6 flow-root'>
                  <div className='-my-6 divide-y divide-gray-500/25'>
                    <div className='space-y-2 py-6'>
                      {navigation.map(item => (
                        <a
                          key={item.name}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className='-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-white hover:bg-gray-400/10'
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                    <div className='py-6'>
                      <button
                        onClick={() => {
                          checkSession(navigate)
                          setMobileMenuOpen(false)
                        }}
                        className='-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-6 text-white hover:bg-gray-400/10'
                      >
                        Log in
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Dialog>
            {/* The intro section */}
            <div className='mx-auto max-w-2xl py-32 py-56 overflow-auto'>
              <div className='hidden sm:mb-8 sm:flex sm:justify-center'>
                <div className='relative rounded-full py-1 px-3 text-sm leading-6 text-gray-400 ring-1 ring-white/10 hover:ring-white/20'>
                  Launching redefined way of.{' '}
                  <Link
                    to='https://nrega.nic.in/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='font-semibold text-white'
                  >
                    <span className='absolute inset-0' aria-hidden='true' />
                    MGNREGA<span aria-hidden='true'>&rarr;</span>
                  </Link>
                </div>
              </div>
              <div className='text-center'>
                <h1 className='text-4xl font-bold tracking-tight text-white sm:text-6xl'>
                  Empowering people who help people
                </h1>
                <p className=' text-left mt-6 text-lg min-w-20 overflow-hidden text-gray-300'>
                  An Act to provide for the enhancement of livelihood security
                  of the households in rural areas of the country by providing
                  at least one hundred days of guaranteed wage employment in
                  every financial year to every household whose adult members
                  volunteer to do unskilled manual work and for matters
                  connected therewith or incidental thereto.
                </p>
                <div className='mt-10 flex-wrap flex items-center justify-center gap-x-6'>
                  <Link
                    to='/auth/login'
                    className='rounded-3xl bg-green-500 px-8 py-1.5 text-base font-semibold leading-7  shadow-sm hover:bg-green-400 text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400'
                  >
                    Get started
                  </Link>
                  <a
                  href='#feature'
                  className='text-base font-semibold leading-7 text-white'
                >
                  Learn more <span aria-hidden='true'>→</span>
                </a>
                </div>
              </div>
            </div>
          </div>

          {/* The feature section */}
          <div id='feature'>
            <Feature />
          </div>
          {/* The contact section */}
          <div id='contact'>
            <Contact />
          </div>
          {/* Footer section */}
          <div id='footer'>
            <Footer />
          </div>
        </div>
      </div>
    </>
  )
}
