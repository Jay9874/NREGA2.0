import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { useEffect, useRef, useState } from 'react'
import './svg_styles.css'
const features = [
  {
    name: 'Job Application: ',
    description: 'for the works around the Panchayat.',
    icon: CheckCircleIcon
  },
  {
    name: 'Attendance with Filtration: ',
    description:
      'for sorting out attendances spreaded in States, Districts, Blocks and Panchayats.',
    icon: CheckCircleIcon
  },
  {
    name: 'Payment Status: ',
    description: 'for daily wages paid on certain work.',
    icon: CheckCircleIcon
  }
]
// Admin features
const adminFeatures = [
  {
    name: 'Add Worker: ',
    description: 'by fetching biometric data from Aadhaar database directly.',
    icon: CheckCircleIcon
  },
  {
    name: 'Give Attendance: ',
    description:
      'to enrolled workers with live location and fingerprint scanning.',
    icon: CheckCircleIcon
  },
  {
    name: 'Auto Credit: ',
    description: 'wages to all job attendees for a day.',
    icon: CheckCircleIcon
  },
  {
    name: 'Job Application: ',
    description: 'addressal with real time notification.',
    icon: CheckCircleIcon
  }
]

export default function Feature () {
  const [activeIndex, setActiveIndex] = useState(0)
  const [pathLength, setPathLength] = useState(null)
  const pathRef = useRef()

  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength()
      console.log(len)
      setPathLength(len)
      pathRef.current.style.strokeDasharray = len
      pathRef.current.style.strokeDashoffset = 2 * len
    }
  }, [])

  return (
    <div className='relative bg-white py-24 sm:py-32'>
      <div className='px-4 lg:px-6 flex justify-between text-base w-full'>
        <button
          className={`${
            activeIndex == 0 ? 'move-down' : ''
          } svg-cont transition-all duration-700 ease-in-out relative text-base whitespace-nowrap font-semibold leading-7 text-indigo-600`}
        >
          <svg className='creative_btn' width={140} height={32}>
            <path
              className={`border ${activeIndex == 1 ? 'link' : ''}`}
              // id='border'
              ref={pathRef}
              d='m 16 31  
                  a 15 15 0 0 1 -15 -15  
                  a 15 15 0 0 1 15 -15  
                  h 108  
                  a 15 15 0 0 1 15 15  
                  a 15 15 0 0 1 -15 15 
                  h -108 
                  '
              strokeLinejoin='round'
              fill='transparent'
              stroke='#4f46e5'
              strokeWidth='1'
              strokeLinecap='round'
            />
          </svg>
          <p className=''>Worker Panel</p>
        </button>
        <h2 className='text-base whitespace-nowrap w-fit font-semibold leading-7 text-indigo-600'>
          <span>Sachiv Panel</span>
        </h2>
      </div>
      <div className='feature-container relative flex'>
        {/* First feature */}
        <div
          className={`mx-auto max-w-7xl px-6 lg:px-8 flex-shrink-0 transition-all duration-700 ease-in-out ${
            activeIndex == 1 ? 'feature-1-active' : ''
          }`}
        >
          <div className='mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2'>
            <div className='lg:pr-8 lg:pt-4'>
              {/* <div className='lg:max-w-lg'> */}
              <div className='lg:max-w-lg w-[90vw]'>
                {/* <h2
                  className={`${
                    activeIndex == 1 ? 'sticky top-48 left-0' : ''
                  } text-base px-4 ring-indigo-600 rounded-full ring-1 w-fit font-semibold leading-7 text-indigo-600`}
                >
                  Worker Panel
                </h2> */}
                <p className='mt-8 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
                  A transparency in whole
                </p>
                <p className='mt-6 text-lg leading-8 text-gray-600'>
                  It was never before available for a normal worker to access
                  their records by the Gram Panchayat Officer, "Sachiv". Thus
                  bringing credibility and connect amongst Government and
                  People.
                </p>
                <dl className='mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none'>
                  {features.map(feature => (
                    <div key={feature.name} className='relative pl-9'>
                      <dt className='inline font-semibold text-gray-900'>
                        <feature.icon
                          className='absolute left-1 top-1 h-5 w-5 text-indigo-600'
                          aria-hidden='true'
                        />
                        {feature.name}
                      </dt>{' '}
                      <dd className='inline'>{feature.description}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            <div className='pt-12'>
              <img
                src='./feature.png'
                alt='Product screenshot'
                className='w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0'
                width={2432}
                height={1442}
              />
            </div>
          </div>
        </div>
        {/* Second Feature */}
        {/* <div
        className={`mx-auto max-w-7xl px-6 lg:px-8 flex-shrink-0 transition-all duration-200 ease-linear ${
          activeIndex == 1 ? '-translate-x-full' : ''
        }`}
      > */}
        <div
          className={`ml-72 max-w-7xl px-6 lg:px-8 flex-shrink-0 transition-all duration-700 ease-in-out ${
            activeIndex == 1 ? 'feature-2-active' : ''
          }`}
        >
          <div className='mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2'>
            <div className='lg:pr-8 lg:pt-4'>
              {/* <div className='lg:max-w-lg'> */}
              <div className='lg:max-w-lg w-[90vw]'>
                {/* <h2 className='text-base w-fit font-semibold leading-7 text-indigo-600'>
                  Sachiv Panel
                </h2> */}
                <p className='mt-8 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
                  Managing like ease
                </p>
                <p className='mt-6 text-lg leading-8 text-gray-600'>
                  No more cluttering user interface to track the progress.
                  Simplifying constraints and automating procedures, the backend
                  you can rely upon.
                </p>
                <dl className='mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none'>
                  {adminFeatures.map(feature => (
                    <div key={feature.name} className='relative pl-9'>
                      <dt className='inline font-semibold text-gray-900'>
                        <feature.icon
                          className='absolute left-1 top-1 h-5 w-5 text-indigo-600'
                          aria-hidden='true'
                        />
                        {feature.name}
                      </dt>{' '}
                      <dd className='inline'>{feature.description}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            <div className='pt-12'>
              <img
                src='./admin_feat.png'
                alt='Product screenshot'
                className='w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0'
                width={2432}
                height={1442}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className='absolute z-30 flex -translate-x-1/2 space-x-6 rtl:space-x-reverse bottom-5 left-1/2'>
        <button
          type='button'
          className={`w-3 h-3 rounded-full ${
            activeIndex == 0 ? 'bg-indigo-700' : 'bg-gray-300'
          }`}
          aria-current='true'
          aria-label='Slide 1'
          data-carousel-slide-to='0'
          onClick={() => setActiveIndex(0)}
        ></button>
        <button
          type='button'
          className={`w-3 h-3 rounded-full ${
            activeIndex == 1 ? 'bg-indigo-700' : 'bg-gray-300'
          }`}
          aria-current='false'
          aria-label='Slide 2'
          data-carousel-slide-to='1'
          onClick={() => setActiveIndex(1)}
        ></button>
      </div>
    </div>
  )
}

{
  /* <text
                id='greet'
                dominant-baseline='middle'
                x='20'
                y='50%'
                font-size='1rem'
                text-anchor='start'
                fill='#4f46e5'
              >
                Worker Panel
              </text> */
}
