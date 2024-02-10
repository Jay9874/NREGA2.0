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
                  <ion-icon size='large' name='git-branch-outline'></ion-icon>
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
                  <ion-icon size='large' name='mail-outline'></ion-icon>
                  <span className='ml-3'>jayprakashsharma225@gmail.com</span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div className='bg-white py-16 px-6 lg:col-span-3 lg:py-24 lg:px-8 xl:pl-12'>
          <div className='mx-auto max-w-lg lg:max-w-none'>
            <form
              action='mailto:jayprakashsharma225@gmail.com'
              method='POST'
              className='grid grid-cols-1 gap-y-6'
              enctype='text/plain'
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
