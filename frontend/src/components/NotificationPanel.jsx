import { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { authStore } from '../api/store'

export default function NotificationPanel () {
  const { notificationPanel, setNotificationPanel } = authStore()
  return (
    // <Dialog
    //   open={notificationPanel}
    //   onClose={() => setNotificationPanel(false)}
    //   className='relative z-50 mt-[65px]'
    // >
    //   <Dialog.Backdrop
    //     transition={notificationPanel.toString()}
    //     className='fixed inset-0 top-[65px] bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0'
    //   />

    //   <div className='fixed mt-[65px] inset-0 overflow-hidden'>
    //     <div className='absolute inset-0 overflow-hidden'>
    //       <div className='mt-[65px] pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10'>
    //         <Dialog.Panel
    //           transition={notificationPanel.toString()}
    //           className='pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700'
    //         >
    //           <Transition show={notificationPanel}>
    //             <Transition.Child>
    //               <div className='absolute top-0 left-0 -ml-8 flex pt-4 pr-2 duration-500 ease-in-out data-closed:opacity-0 sm:-ml-10 sm:pr-4'>
    //                 <button
    //                   type='button'
    //                   onClick={() => setNotificationPanel(false)}
    //                   className='relative rounded-md text-gray-300 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden'
    //                 >
    //                   <span className='absolute -inset-2.5' />
    //                   <span className='sr-only'>Close panel</span>
    //                   <XMarkIcon aria-hidden='true' className='size-6' />
    //                 </button>
    //               </div>
    //             </Transition.Child>
    //           </Transition>
    //           <div className='flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl'>
    //             <div className='px-4 sm:px-6'>
    //               <Dialog.Title className='text-base font-semibold text-gray-900'>
    //                 Panel title
    //               </Dialog.Title>
    //             </div>
    //             <div className='relative mt-6 flex-1 px-4 sm:px-6'>
    //               {/* Your content */}
    //             </div>
    //           </div>
    //         </Dialog.Panel>
    //       </div>
    //     </div>
    //   </div>
    // </Dialog>
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
            <Dialog.Panel className='relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4'>
              <Transition.Child
                as={Fragment}
                enter='ease-in-out duration-300'
                enterFrom='opacity-0'
                enterTo='opacity-100'
                leave='ease-in-out duration-300'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
              >
                <div className='absolute pt-3 top-0 left-0 -mr-12 pt-2'>
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
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

//   <div
//     className='absolute top-0 z-20 w-full min-h-[calc(100vh-64px)]'
//     role='dialog'
//     aria-modal='true'
//   >
//     {/* <!--
//   Background backdrop, show/hide based on slide-over state.

//   Entering: "ease-in-out duration-500"
//     From: "opacity-0"
//     To: "opacity-100"
//   Leaving: "ease-in-out duration-500"
//     From: "opacity-100"
//     To: "opacity-0"
// --> */}
//     <div
//       className='absolute inset-0 bg-gray-500/75 transition-opacity'
//       aria-hidden='true'
//     ></div>

//     <div className='absolute inset-0 overflow-hidden'>
//       <div className='absolute inset-0 overflow-hidden'>
//         <div className='pointer-events-none absolute inset-y-0 right-0 flex pl-10'>
//           {/* <!--
//         Slide-over panel, show/hide based on slide-over state.

//         Entering: "transform transition ease-in-out duration-500 sm:duration-700"
//           From: "translate-x-full"
//           To: "translate-x-0"
//         Leaving: "transform transition ease-in-out duration-500 sm:duration-700"
//           From: "translate-x-0"
//           To: "translate-x-full"
//       --> */}

//           {/* <!--
//           Close button, show/hide based on slide-over state.

//           Entering: "ease-in-out duration-500"
//             From: "opacity-0"
//             To: "opacity-100"
//           Leaving: "ease-in-out duration-500"
//             From: "opacity-100"
//             To: "opacity-0"
//         --> */}

//           <div className='flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl'>
//             {/* <div className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4"> */}
//             <button
//               type='button'
//               className='rounded-md w-fit text-gray-400 hover:text-gray-500'
//             >
//               {/* <span className="absolute -inset-2.5"></span> */}
//               <span className='sr-only'>Close panel</span>
//               <svg
//                 className='size-6'
//                 fill='none'
//                 viewBox='0 0 24 24'
//                 strokeWidth='1.5'
//                 stroke='currentColor'
//                 aria-hidden='true'
//                 data-slot='icon'
//               >
//                 <path
//                   strokeLinecap='round'
//                   strokeLinejoin='round'
//                   d='M6 18 18 6M6 6l12 12'
//                 />
//               </svg>
//             </button>
//             {/* </div> */}
//             <div className='px-4 sm:px-6'>
//               <h2
//                 className='text-base font-semibold text-gray-900'
//                 id='slide-over-title'
//               >
//                 Panel title
//               </h2>
//             </div>
//             <div className='relative mt-6 flex-1 px-4 sm:px-6'>
//               {/* <!-- Your content --> */}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
