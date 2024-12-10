import RecentPayment from '../RecentPayment'
import { useAdminStore } from '../../api/store'
import { GreetUserWithTime } from '../../api'
import {
  MapPinIcon,
  CheckCircleIcon,
  CalendarIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/20/solid'
import { Link } from 'react-router-dom'
import { jobDuration } from '../../utils/dataFormating'
import HomeLoading from '../Skeleton/HomeLoading'

export default function Dashboard () {
  const { profile, employees, jobs, payments, loading} = useAdminStore()
  const totalJobDays = jobs.reduce((acc, curr) => {
    const { created_at, job_deadline } = curr
    const duration = jobDuration(created_at, job_deadline).days
    acc += duration
    return acc
  }, 0)
  const updatedPayment = payments.map((itm, indx) => {
    const payment_title = itm.payment_title + ' To ' + itm.payment_to.first_name
    const newItm = {
      ...itm,
      payment_title: payment_title
    }
    return newItm
  })

  const cards = [
    {
      name: 'Workers Count',
      href: '/admin/workers',
      icon: UserGroupIcon,
      amount: employees.length
    },
    {
      name: 'Jobs in Gram Panchayat',
      href: '/admin/jobs',
      icon: WrenchScrewdriverIcon,
      amount: jobs.length
    },
    {
      name: 'Total Job Days',
      href: '/admin/attendance',
      icon: CalendarIcon,
      amount: totalJobDays
    }
  ]
  return loading ? (
    <HomeLoading />
  ) : (
    <main className='flex-1 pb-8'>
      {/* Page header */}
      <div className='bg-white shadow'>
        <div className='px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8'>
          <div className='py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200'>
            <div className='min-w-0 flex-1'>
              {/* Profile */}
              <div className='flex items-center'>
                <img
                  className='hidden h-16 w-16 rounded-full sm:block'
                  src={profile?.photo}
                  alt='profile_image'
                />
                <div>
                  <div className='flex items-center'>
                    <img
                      className='h-16 w-16 rounded-full sm:hidden'
                      src={profile?.photo}
                      alt='profile_image'
                    />
                    <h1 className='break-keep ml-3 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9'>
                      <span className='break-keep'>{GreetUserWithTime()},</span>{' '}
                      {profile?.first_name}
                    </h1>
                  </div>
                  <dl className='mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap'>
                    <dt className='sr-only'>Location</dt>
                    <dd className='flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6'>
                      <MapPinIcon
                        className='mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400'
                        aria-hidden='true'
                      />
                      {profile?.location_id?.panchayat}
                      {', '}
                      {profile?.location_id?.district}
                      {', '}
                      {profile?.location_id?.state}
                    </dd>
                    <dt className='sr-only'>Account status</dt>
                    <dd className='mt-3 flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6 sm:mt-0'>
                      <CheckCircleIcon
                        className='mr-1.5 h-5 w-5 flex-shrink-0 text-green-400'
                        aria-hidden='true'
                      />
                      {profile?.sachiv_id}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-8'>
        <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
          <h2 className='text-lg font-medium leading-6 text-gray-900'>
            Overview
          </h2>
          <div className='mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
            {/* Card */}
            {cards.map(card => (
              <div
                key={card.name}
                className='overflow-hidden rounded-lg bg-white shadow flex flex-col justify-between'
              >
                <div className='p-5'>
                  <div className='flex items-center'>
                    <div className='flex-shrink-0'>
                      <card.icon
                        className='h-6 w-6 text-gray-400'
                        aria-hidden='true'
                      />
                    </div>
                    <div className='ml-5 w-0 flex-1'>
                      <dl>
                        <dt className='truncate text-sm font-medium text-gray-500'>
                          {card.name}
                        </dt>
                        <dd>
                          <div className='text-lg font-medium text-gray-900'>
                            {card.amount}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className='bg-gray-50 px-5 py-3'>
                  <div className='text-sm'>
                    <Link
                      to={card.href}
                      className='font-medium text-cyan-700 hover:text-cyan-900'
                    >
                      View all
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <h2 className='mx-auto flex justify-between items-center mt-8 mb-4 max-w-6xl px-4 text-lg font-medium leading-6 text-gray-900 sm:px-6 lg:px-8'>
          <span>Recent payments</span>
          <Link
            to='/admin/payout'
            className='text-sm text-cyan-700 hover:text-cyan-900 font-medium'
          >
            View all
          </Link>
        </h2>
        {/* Recent activity */}
        <RecentPayment
          heading={'Recent payments'}
          recentActivity={updatedPayment}
        />
      </div>
    </main>
  )
}
