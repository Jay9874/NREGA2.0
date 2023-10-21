import img1 from '../assets/images/bg.jpg'
import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import logo from '../assets/images/logo.png'
import { authStore } from '../api/store'
import { useNavigate } from 'react-router-dom'

const navigation = [
  { name: 'Features', href: '#feature' },
  { name: 'Contact', href: '#contact' }
]
const features = [
  {
    name: 'Sleek design',
    description:
      'The machined kettle has a smooth black finish and contemporary shape that stands apart from most plastic appliances.'
  },
  {
    name: 'Comfort handle',
    description: 'Shaped for steady pours and insulated to prevent burns.'
  },
  {
    name: 'One-button control',
    description:
      'The one button control has a digital readout for setting temperature and turning the kettle on and off.'
  },
  {
    name: 'Long spout',
    description:
      "Designed specifically for controlled pour-overs that don't slash or sputter."
  }
]

export default function Home () {
  const navigate = useNavigate()
  const { checkSession } = authStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <div className='relative isolate overflow-hidden bg-gray-900'>
        <img
          src={img1}
          alt=''
          className='absolute inset-0 -z-10 h-full w-full object-cover brightness-50'
        />

        <div className='px-6 lg:px-8'>
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
                      <Link
                        key={item.name}
                        href={item.href}
                        className='-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-white hover:bg-gray-400/10'
                      >
                        {item.name}
                      </Link>
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
          <div className='mx-auto max-w-2xl py-32 sm:py-48 lg:py-56'>
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
                  MGNREGA 2.0 <span aria-hidden='true'>&rarr;</span>
                </Link>
              </div>
            </div>
            <div className='text-center'>
              <h1 className='text-4xl font-bold tracking-tight text-white sm:text-6xl'>
                Empowering people who help people
              </h1>
              <p className=' text-left mt-6 text-lg min-w-20 overflow-hidden text-gray-300'>
                An Act to provide for the enhancement of livelihood security of
                the households in rural areas of the country by providing at
                least one hundred days of guaranteed wage employment in every
                financial year to every household whose adult members volunteer
                to do unskilled manual work and for matters connected therewith
                or incidental thereto.
              </p>
              <div className='mt-10 flex items-center justify-center gap-x-6'>
                <Link
                  to='/auth'
                  className='rounded-md bg-indigo-500 px-3.5 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400'
                >
                  Get started
                </Link>
                <Link
                  to='#feature'
                  className='text-base font-semibold leading-7 text-white'
                >
                  Learn more <span aria-hidden='true'>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className='bg-white'>
        <div className='mx-auto max-w-2xl py-24 px-4 sm:py-32 sm:px-6 lg:max-w-7xl lg:px-8'>
          <div className='grid grid-cols-1 items-center gap-y-16 gap-x-8 lg:grid-cols-2'>
            <div>
              <div className='border-b border-gray-200 pb-10'>
                <h2 className='font-medium text-gray-500'>Machined Kettle</h2>
                <p className='mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
                  Elegant simplicity
                </p>
              </div>

              <dl className='mt-10 space-y-10'>
                {features.map(feature => (
                  <div key={feature.name}>
                    <dt className='text-sm font-medium text-gray-900'>
                      {feature.name}
                    </dt>
                    <dd className='mt-3 text-sm text-gray-500'>
                      {feature.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <div className='aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-100'>
                <img
                  src='https://tailwindui.com/img/ecommerce-images/product-feature-09-main-detail.jpg'
                  alt='Black kettle with long pour spot and angled body on marble counter next to coffee mug and pour-over system.'
                  className='h-full w-full object-cover object-center'
                />
              </div>
              <div className='mt-4 grid grid-cols-2 gap-4 sm:mt-6 sm:gap-6 lg:mt-8 lg:gap-8'>
                <div className='aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-100'>
                  <img
                    src='https://tailwindui.com/img/ecommerce-images/product-feature-09-detail-01.jpg'
                    alt='Detail of temperature setting button on kettle bass with digital degree readout.'
                    className='h-full w-full object-cover object-center'
                  />
                </div>
                <div className='aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-100'>
                  <img
                    src='https://tailwindui.com/img/ecommerce-images/product-feature-09-detail-02.jpg'
                    alt='Kettle spout pouring boiling water into coffee grounds in pour-over mug.'
                    className='h-full w-full object-cover object-center'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  )
}
