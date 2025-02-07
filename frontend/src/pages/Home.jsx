import img1 from '../assets/images/bg.jpg'
import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import logo from '../assets/images/logo.png'
import { authStore } from '../api/store'
import { useNavigate } from 'react-router-dom'
import { Feature, Contact, Footer } from '../components/Home'
import { toast } from 'sonner'

const navigation = [
  { name: 'Features', href: '#feature' },
  { name: 'Contact', href: '#contact' },
  { name: 'About', href: '#footer' }
]

export default function Home () {
  const navigate = useNavigate()
  const { checkUser, demoLogin } = authStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedActionBtn, setExpandedActionBtn] = useState(false)
  async function checkSession () {
    try {
      const token = JSON.parse(localStorage.getItem('suid'))
      console.log(token)
      if (token) {
        const user = await checkUser()
        navigate(`/${user.type}/dashboard`)
        toast.success('Login successful!', { duration: 500 })
        return null
      } else throw new Error('No session found.')
    } catch (err) {
      navigate('/auth/login')
      return null
    }
  }
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
                  onClick={checkSession}
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
                          checkSession()
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
            <div className='mx-auto max-w-2xl pb-52 pt-40 sm:py-52 overflow-auto'>
              {/* <div className='hidden sm:mb-8 sm:flex sm:justify-center'> */}
              <div className='mb-8 flex justify-center'>
                {/* <div className='relative rounded-full py-1 px-3 text-sm leading-6 text-gray-400 ring-1 ring-white/10 hover:ring-white/20'> */}
                <div className='lg:flex lg:justify-center relative rounded-full py-1 px-3 text-sm leading-6 text-gray-400 ring-1 ring-white/10 hover:ring-white/20'>
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
                <div className='mt-10 flex-wrap flex justify-center gap-x-6'>
                  <div
                    className={`${
                      expandedActionBtn ? 'rounded-b-none' : ''
                    } relative w-[200px] transition-all duration-100 ease-in-out rounded-[20px] bg-green-500  text-base font-semibold leading-7  shadow-sm text-black`}
                  >
                    <button
                      onClick={() => setExpandedActionBtn(!expandedActionBtn)}
                      className={`flex items-center justify-center z-20 px-2 py-1.5 h-[40px] w-full`}
                    >
                      <span className='px-1.5'>Try a Demo</span>
                      <span
                        className={`flex items-center transition-all duration-200 ease-in-out ${
                          expandedActionBtn ? 'rotate-180' : ''
                        }`}
                      >
                        <ion-icon
                          color='dark'
                          name='caret-down-outline'
                        ></ion-icon>
                      </span>
                    </button>
                    <div
                      className={`${
                        expandedActionBtn ? '' : 'hidden'
                      } absolute z-10 -bottom-50 w-full py-1.5`}
                    >
                      <button
                        onClick={() =>
                          demoLogin(
                            'jayprakashsharma225@gmail.com',
                            'admin',
                            navigate
                          )
                        }
                        className='bg-green-500 py-1.5 w-full flex justify-between items-center pl-3.5 pr-2'
                      >
                        <span>Demo as Sachiv</span>
                        <ion-icon
                          color='light'
                          name='arrow-forward-outline'
                        ></ion-icon>
                      </button>
                      <button
                        onClick={() =>
                          demoLogin('jay.gdsc@gmail.com', 'worker', navigate)
                        }
                        className='bg-green-500 w-full mt-[1px] py-1.5 flex justify-between items-center pl-3.5 pr-2'
                      >
                        <span>Demo as Worker</span>
                        <ion-icon
                          color='light'
                          name='arrow-forward-outline'
                        ></ion-icon>
                      </button>
                      <button
                        onClick={checkSession}
                        className='bg-green-500 mt-[1px] w-full rounded-b-[20px] py-1.5 flex justify-between items-center pl-3.5 pr-2'
                      >
                        <span>Normal Login</span>
                        <ion-icon
                          color='light'
                          name='arrow-forward-outline'
                        ></ion-icon>
                      </button>
                    </div>
                  </div>
                  <a
                    href='#feature'
                    className={`text-base flex items-center font-semibold leading-7 text-white`}
                  >
                    <span aria-hidden='true'>Learn more →</span>
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
