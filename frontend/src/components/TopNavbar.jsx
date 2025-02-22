import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Bars3BottomLeftIcon, BellIcon } from '@heroicons/react/24/outline'
import { authStore } from '../api/store'
function classNames (...classes) {
  return classes.filter(Boolean).join(' ')
}

export const TopNavbar = ({ setSidebarOpen, userNavigation }) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const {
    logoutUser,
    user,
    loading,
    setNotificationPanel,
    notificationPanel,
    notifications
  } = authStore()

  return (
    <div className='sticky z-30 top-0 flex h-16 flex-shrink-0 bg-white shadow'>
      <button
        type='button'
        className='border-r border-gray-200 px-4 text-gray-500 md:hidden'
        onClick={() => setSidebarOpen(true)}
      >
        <span className='sr-only'>Open sidebar</span>
        <Bars3BottomLeftIcon className='h-6 w-6' aria-hidden='true' />
      </button>
      <div className='flex flex-1 justify-between px-4'>
        <div className='flex flex-1'>
          <form className='flex w-full md:ml-0' action='#' method='GET'>
            <label htmlFor='search-field' className='sr-only'>
              Search
            </label>
            <div className='relative w-full text-gray-400 focus-within:text-gray-600'>
              <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center'>
                <MagnifyingGlassIcon className='h-5 w-5' aria-hidden='true' />
              </div>
              <input
                id='search-field'
                className='block h-full w-full border-transparent py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm'
                placeholder='Search'
                type='search'
                name='search'
              />
            </div>
          </form>
        </div>
        <div
          className='ml-4 flex items-center md:ml-6'
          title='View Notifications'
        >
          <button
            type='button'
            onClick={() => setNotificationPanel(true)}
            className='relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
          >
            <span className='sr-only'>View notifications</span>
            <BellIcon className='h-6 w-6' aria-hidden='true' />
            {notifications.length != 0 && (
              <span className='absolute top-0 right-0 block h-2 w-2 rounded-full bg-green-400 ring-2 ring-white' />
            )}
          </button>

          {/* Profile dropdown */}
          <Menu as='div' className='relative ml-3'>
            <div className='profile-menu' title='Open Profile Menu'>
              <Menu.Button
                className={classNames(
                  pathname === '/worker/profile' ||
                    pathname === '/admin/profile'
                    ? 'outline-none ring-2 ring-indigo-500 ring-offset-2'
                    : '',
                  'flex max-w-xs items-center rounded-full bg-white text-sm'
                )}
              >
                <span className='sr-only'>Open user menu</span>
                {loading ? (
                  <svg
                    className='w-8 h-8 text-gray-200 animate-pulse dark:text-gray-700'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path d='M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z' />
                  </svg>
                ) : (
                  <img
                    className='h-8 w-8 rounded-full'
                    src={user?.photo}
                    alt='profile_image'
                  />
                )}
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter='transition ease-out duration-100'
              enterFrom='transform opacity-0 scale-95'
              enterTo='transform opacity-100 scale-100'
              leave='transition ease-in duration-75'
              leaveFrom='transform opacity-100 scale-100'
              leaveTo='transform opacity-0 scale-95'
            >
              <Menu.Items className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                {userNavigation.map(item => (
                  <Menu.Item key={item.name}>
                    {({ active }) => (
                      <Link
                        to={item.name == 'Sign Out' ? pathname : item.href}
                        onClick={() => {
                          if (item.to === 'button') {
                            logoutUser(navigate)
                          }
                        }}
                        className={classNames(
                          active ? 'bg-gray-100' : '',
                          'block px-4 py-2 text-sm text-gray-700'
                        )}
                      >
                        {item.name}
                      </Link>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  )
}
