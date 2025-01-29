import { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { authStore } from '../api/store'
import NotificationCard from './NotificationCard'

export default function NotificationPanel ({ notifications, type }) {
  const { notificationPanel, setNotificationPanel } = authStore()
  // console.log("notifications are: ", notifications)
  return (
    <Transition.Root show={notificationPanel} as={Fragment}>
      <Dialog as='div' className='relative z-40' onClose={setNotificationPanel}>
        <Transition.Child
          as={Fragment}
          enter='transition-opacity ease-linear duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='transition-opacity ease-linear duration-300'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-600 bg-opacity-75' />
        </Transition.Child>

        <div className='fixed inset-0 z-90 flex justify-end'>
          <Transition.Child
            as={Fragment}
            enter='transition ease-in-out duration-300 transform'
            enterFrom='translate-x-full'
            enterTo='-translate-x-0'
            leave='transition ease-in-out duration-300 transform'
            leaveFrom='-translate-x-0'
            leaveTo='translate-x-full'
          >
            <Dialog.Panel className='relative flex w-full max-w-96 flex-1 flex-col bg-white pt-5 pb-4'>
              <Transition.Child
                as={Fragment}
                enter='ease-in-out duration-300'
                enterFrom='opacity-0'
                enterTo='opacity-100'
                leave='ease-in-out duration-300'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
              >
                <div className='absolute pt-3 top-0 right-0 mr-14'>
                  <button
                    type='button'
                    className='ml-1 flex h-10 w-10 items-center justify-center rounded-full outline-none ring-2 ring-inset ring-gray-400 hover:ring-gray-500'
                    onClick={() => setNotificationPanel(false)}
                  >
                    <span className='sr-only'>Close sidebar</span>
                    <XMarkIcon
                      className='h-6 w-6 text-gray-400 hover:text-gray-500'
                      aria-hidden='true'
                    />
                  </button>
                </div>
              </Transition.Child>
              <div className='relative w-full h-fit mt-8 text-lg'>
                <h1 className='text-center'>Notifications</h1>
                <div className='absolute w-full h-6 -bottom-6 bg-linear-to-bl from-violet-500 to-fuchsia-500'></div>
              </div>

              <div className='overflow-scroll py-6'>
                {notifications.map((notification, index) => (
                  <NotificationCard
                    key={index}
                    notification={notification}
                    type={type}
                  />
                ))}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
