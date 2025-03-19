import { ScaleIcon } from '@heroicons/react/24/outline'
import RecentPayment from '../RecentPayment'
import { useWorkerStore } from '../../api/store'
import { GreetUserWithTime } from '../../api'
import { useEffect, useState } from 'react'
import {
  MapPinIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  CalendarDaysIcon
} from '@heroicons/react/20/solid'
import { Link } from 'react-router-dom'
import OverviewCards from '../OverviewCards'

export default function Dashboard () {
  const { profile, payment, lastAttendance, totalPresent } = useWorkerStore()
  const [balance, setBalance] = useState(0)

  const cards = [
    {
      name: 'Attendance',
      href: '/worker/attendance',
      icon: CalendarDaysIcon,
      value: `${totalPresent}/100 Day`
    },
    {
      name: 'Working on',
      href: '/worker/jobs',
      icon: BuildingOfficeIcon,
      value: `${lastAttendance.work_name} at ${lastAttendance.location}`
    },
    {
      name: 'Account balance',
      href: '/worker/payment',
      icon: ScaleIcon,
      value: `₹${balance?.toFixed(2)}`
    }
  ]
  useEffect(() => {
    setBalance(() => {
      return payment.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.amount
      }, 0)
    })
  }, [payment])
  return (
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
                  src={profile.photo}
                  alt='profile_image'
                />
                <div>
                  <div className='flex items-center'>
                    <img
                      className='h-16 w-16 rounded-full sm:hidden'
                      src={profile.photo}
                      alt='profile_image'
                    />
                    <h1 className='break-keep ml-3 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9'>
                      <span className='break-keep'>{GreetUserWithTime()},</span>{' '}
                      {profile.first_name}
                    </h1>
                  </div>
                  <dl className='mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap'>
                    <dt className='sr-only'>Location</dt>
                    <dd className='flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6'>
                      <MapPinIcon
                        className='mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400'
                        aria-hidden='true'
                      />
                      {profile?.address?.panchayat}
                      {', '}
                      {profile?.address?.district}
                      {', '}
                      {profile?.address?.state}
                    </dd>
                    <dt className='sr-only'>Account status</dt>
                    <dd className='mt-3 flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6 sm:mt-0'>
                      <CheckCircleIcon
                        className='mr-1.5 h-5 w-5 flex-shrink-0 text-green-400'
                        aria-hidden='true'
                      />
                      {profile.mgnrega_id}
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
          {/* overview of Dashboard */}
          <OverviewCards cards={cards} />
        </div>

        {/* Recent activity */}
        <h2 className='mx-auto flex justify-between items-center mt-8 mb-4 max-w-6xl px-4 text-lg font-medium leading-6 text-gray-900 sm:px-6 lg:px-8'>
          <span>Recent payments</span>
          <Link
            to='/worker/payment'
            className='text-sm text-cyan-700 hover:text-cyan-900 font-semibold'
          >
            View all
          </Link>
        </h2>
        <RecentPayment heading={'Recent Activity'} recentActivity={payment} />
      </div>
    </main>
  )
}
