import { useWorkerStore } from '../../api/store'
export default function Profile () {
  const { profile } = useWorkerStore()

  return (
    <main>
      <div className='overflow-hidden bg-white sm:rounded-lg'>
        <div className='px-4 py-5 sm:px-6'>
          <h3 className='text-lg font-medium leading-6 text-gray-900'>
            Your Profile
          </h3>
          <p className='mt-1 max-w-2xl text-sm text-gray-500'>
            Personal, Bank and Contact details.
          </p>
        </div>
        <div className='border-t border-gray-200 px-4 py-5 sm:px-6'>
          <dl className='grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2'>
            <div className='sm:col-span-2'>
              <dt className='text-sm font-medium text-gray-500'>
                Profile Image
              </dt>
              <dd className='mt-1 text-sm text-gray-900'>
                <img
                  className='h-16 w-16 rounded-full'
                  src={profile.photo}
                  alt='profile_image'
                />
              </dd>
            </div>
            <div className='sm:col-span-1'>
              <dt className='text-sm font-medium text-gray-500'>Full name</dt>
              <dd className='mt-1 text-sm text-gray-900'>{`${profile.first_name} ${profile.last_name}`}</dd>
            </div>
            <div className='sm:col-span-1'>
              <dt className='text-sm font-medium text-gray-500'>Age</dt>
              <dd className='mt-1 text-sm text-gray-900'>{profile.age}</dd>
            </div>
            <div className='sm:col-span-1'>
              <dt className='text-sm font-medium text-gray-500'>Sex</dt>
              <dd className='mt-1 text-sm text-gray-900'>{profile.sex}</dd>
            </div>
            <div className='sm:col-span-1'>
              <dt className='text-sm font-medium text-gray-500'>Father Name</dt>
              <dd className='mt-1 text-sm text-gray-900'>
                {profile.father_name}
              </dd>
            </div>
            <div className='sm:col-span-1'>
              <dt className='text-sm font-medium text-gray-500'>Village</dt>
              <dd className='mt-1 text-sm text-gray-900'>
                {profile?.address?.state}, {profile?.address?.district},{' '}
                {profile?.address?.block}, {profile?.address?.panchayat}
              </dd>
            </div>
            <div className='sm:col-span-1'>
              <dt className='text-sm font-medium text-gray-500'>
                Email address
              </dt>
              <dd className='mt-1 text-sm text-gray-900'>{profile.email}</dd>
            </div>
            <div className='sm:col-span-1'>
              <dt className='text-sm font-medium text-gray-500'>MGNREGA ID</dt>
              <dd className='mt-1 text-sm text-gray-900'>
                {profile.mgnrega_id}
              </dd>
            </div>
            <div className='sm:col-span-1'>
              <dt className='text-sm font-medium text-gray-500'>Family ID</dt>
              <dd className='mt-1 text-sm text-gray-900'>
                {profile.family_id}
              </dd>
            </div>
            <div className='sm:col-span-1'>
              <dt className='text-sm font-medium text-gray-500'>
                Bank Account Number
              </dt>
              <dd className='mt-1 text-sm text-gray-900'>
                {profile.bank_account_no}
              </dd>
            </div>
            <div className='sm:col-span-1'>
              <dt className='text-sm font-medium text-gray-500'>
                Aadhaar Number
              </dt>
              <dd className='mt-1 text-sm text-gray-900'>
                {profile.aadhar_no}
              </dd>
            </div>
            <div className='mt-4 sm:col-span-2'>
              <dt className='text-sm font-medium text-gray-500'>
                Please Note*
              </dt>
              <dd className='mt-1 text-sm text-gray-900'>
                If there is any wrong information here, please contact your Gram
                Panchayat Office for correction.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </main>
  )
}
