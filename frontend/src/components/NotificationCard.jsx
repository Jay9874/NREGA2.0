import { Fragment, useState } from 'react'
import { Transition } from '@headlessui/react'
import { timestampToDate } from '../utils/dataFormating'
import { authStore, useAdminStore } from '../api/store'

export default function NotificationCard ({ notification, type }) {
  const [show, setShow] = useState(true)
  const { enrollWorker, rejectApplication } = useAdminStore()
  const { clearANotification } = authStore()
  const [rejectionRemark, setRejectionRemark] = useState('')

  async function reject (e) {
    e.preventDefault()
    const data = await rejectApplication(notification, rejectionRemark)
    await clearANotification(notification.id)
  }

  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live='assertive'
        className='pointer-events-none flex items-end px-4 py-2 sm:items-start sm:p-2'
      >
        <div className='flex w-full flex-col items-center space-y-4 sm:items-end'>
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={show}
            as={Fragment}
            enter='transform ease-out duration-300 transition'
            enterFrom='translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2'
            enterTo='translate-y-0 opacity-100 sm:translate-x-0'
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='pointer-events-auto flex flex-col w-full max-w-md divide-y divide-gray-200 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5'>
              <div className='flex divide-x divide-gray-200'>
                <div className='flex w-0 flex-1 items-center p-4'>
                  <div className='w-full'>
                    <p className='text-sm font-medium text-gray-900'>
                      {notification.tagline}
                    </p>
                    {Object.keys(notification.details).map((header, index) => (
                      <p key={index} className='mt-1 text-sm text-gray-500'>
                        <span>{`${header}: `}</span>
                        <span>{notification?.details[header]}</span>
                      </p>
                    ))}
                    <div className='mt-1 text-sm text-gray-500 flex items-center gap-1'>
                      <ion-icon name='calendar-outline'></ion-icon>
                      {timestampToDate(notification?.created_at)}
                    </div>
                  </div>
                </div>
                <div className='flex'>
                  <div className='flex flex-col divide-y divide-gray-200'>
                    {type == 'admin' && (
                      <div className='flex h-0 flex-1'>
                        <button
                          type='button'
                          className='flex w-full items-center justify-center rounded-none rounded-tr-lg border border-transparent px-4 py-3 text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:z-10 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                          onClick={async () => {
                            await enrollWorker(
                              notification?.application_id,
                              notification
                            )
                            await clearANotification(notification.id)
                          }}
                        >
                          Accept
                        </button>
                      </div>
                    )}
                    {type == 'worker' && (
                      <div className='flex h-0 flex-1'>
                        <button
                          type='button'
                          className='flex w-full items-center justify-center rounded-none rounded-br-lg border border-transparent px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                          onClick={async () => {
                            await clearANotification(notification.id)
                          }}
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {type == 'admin' && (
                <div>
                  {/* Rejection form */}
                  <form
                    className='flex justify-between items-center h-fit'
                    onSubmit={reject}
                  >
                    <div className='md:w-1/2 h-full flex-grow'>
                      <label
                        htmlFor='remark'
                        className='block text-sm font-medium text-gray-700'
                      ></label>
                      <div className='relative'>
                        <input
                          type='text'
                          required
                          name='remark'
                          id='remark'
                          value={rejectionRemark}
                          onChange={e => setRejectionRemark(e.target.value)}
                          className='w-full ml-1 rounded-md bg-transparent focus:outline-none outline-none border-none sm:text-sm'
                          placeholder='write remark to reject...'
                          aria-invalid='true'
                          aria-describedby='remark-error'
                        />
                      </div>
                    </div>
                    <button
                      type='submit'
                      className='flex w-[78.58px] items-center justify-center rounded-none rounded-br-lg border border-transparent px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    >
                      Reject
                    </button>
                  </form>
                </div>
              )}
            </div>
          </Transition>
        </div>
      </div>
    </>
  )
}
