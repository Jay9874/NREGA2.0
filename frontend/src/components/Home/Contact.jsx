export default function Contact () {
  return (
    <div className='relative bg-white'>
      <div className='absolute inset-0'>
        <div className='absolute inset-y-0 left-0 w-1/2 bg-gray-50' />
      </div>
      <div className='relative mx-auto max-w-7xl lg:grid lg:grid-cols-5'>
        <div className='bg-gray-50 py-16 px-6 lg:col-span-2 lg:px-8 lg:py-24 xl:pr-12'>
          <div className='mx-auto max-w-lg'>
            <h2 className='text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl'>
              Get in touch
            </h2>
            <p className='mt-3 text-lg leading-6 text-gray-500'>
              Having issue using this platform? Having Feedback or Report? We
              love listening you back, please connect with us.
            </p>
            <dl className='mt-8 text-base text-gray-500'>
              <div>
                <dt className='sr-only'>Postal address</dt>
                <dd>
                  <p>345 Myfair Place</p>
                  <p>Springfield, IND 700001</p>
                </dd>
              </div>
              <div className='mt-6'>
                <dt className='sr-only'>Phone number</dt>
                <dd className='flex'>
                  <svg
                    className='fill-gray-500'
                    width={36}
                    height={36}
                    viewBox='0 0 512 512'
                  >
                    <path d='M416 160a64 64 0 10-96.27 55.24c-2.29 29.08-20.08 37-75 48.42-17.76 3.68-35.93 7.45-52.71 13.93v-126.2a64 64 0 10-64 0v209.22a64 64 0 1064.42.24c2.39-18 16-24.33 65.26-34.52 27.43-5.67 55.78-11.54 79.78-26.95 29-18.58 44.53-46.78 46.36-83.89A64 64 0 00416 160zM160 64a32 32 0 11-32 32 32 32 0 0132-32zm0 384a32 32 0 1132-32 32 32 0 01-32 32zm192-256a32 32 0 1132-32 32 32 0 01-32 32z' />
                  </svg>
                  <a href='https://github.com/Jay9874/NREGA2.0'>
                    <span className='ml-3 hover:text-gray-600'>
                      Update on GitHub
                    </span>
                  </a>
                </dd>
              </div>
              <div className='mt-3'>
                <dt className='sr-only'>Email</dt>
                <dd className='flex'>
                  <svg
                    height={36}
                    width={36}
                    className='fill-none stroke-gray-500'
                    strokeWidth="28"
                    viewBox='0 0 512 512'
                  >
                    <rect
                      x={48}
                      y={96}
                      width={416}
                      height={320}
                      rx={40}
                      ry={40}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M112 160l144 112 144-112'
                    />
                  </svg>
                  <span className='ml-3'>jayprakashsharma225@gmail.com</span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div className='bg-white py-16 px-6 lg:col-span-3 lg:py-24 lg:px-8 xl:pl-12'>
          <div className='mx-auto max-w-lg lg:max-w-none'>
            <form
              action='https://mailto:jayprakashsharma225@gmail.com'
              method='POST'
              className='grid grid-cols-1 gap-y-6'
              encType='text/plain'
            >
              <div>
                <label htmlFor='full-name' className='sr-only'>
                  Full name
                </label>
                <input
                  type='text'
                  name='full-name'
                  id='full-name'
                  autoComplete='name'
                  className='block w-full rounded-md border-gray-300 py-3 px-4 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                  placeholder='Full name'
                />
              </div>
              <div>
                <label htmlFor='email' className='sr-only'>
                  Email
                </label>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  className='block w-full rounded-md border-gray-300 py-3 px-4 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                  placeholder='Email'
                />
              </div>
              <div>
                <label htmlFor='phone' className='sr-only'>
                  Phone
                </label>
                <input
                  type='text'
                  name='phone'
                  id='phone'
                  autoComplete='tel'
                  className='block w-full rounded-md border-gray-300 py-3 px-4 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                  placeholder='Phone'
                />
              </div>
              <div>
                <label htmlFor='message' className='sr-only'>
                  Message
                </label>
                <textarea
                  id='message'
                  name='message'
                  rows={4}
                  className='block w-full rounded-md border-gray-300 py-3 px-4 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                  placeholder='Message'
                  defaultValue={''}
                />
              </div>
              <div>
                <button
                  type='submit'
                  className='inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-6 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
