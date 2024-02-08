import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useWorkerStore } from '../api/store'
// Importing all the components
import { Sidebar, TopNavbar } from '../components'

// Constants imports
import { workerNavigation } from '../utils/sidelinks'
import { workerTopNavigation } from '../utils/dashboard_toplink'

export const Worker = () => {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const {
    setProfile,
    setPayment,
    setAllJobs,
    setNearbyJobs,
    loading,
    setLoading,
    setDataLoaded,
    setLastWork,
    setLocations,
    setLastAttendance
  } = useWorkerStore()

  async function handleSetup () {
    try {
      setLoading(true)
      const profile = await setProfile(navigate)
      const payment = await setPayment()
      const location = await setLocations()
      const lastWork = await setLastWork()
      const lastAttendance = await setLastAttendance()
      const allJobs = await setAllJobs()
      const nearbyJobs = await setNearbyJobs()
      setLoading(false)
      setDataLoaded(true)
    } catch (error) {
      return error
    }
  }

  useEffect(() => {
    handleSetup()
  }, [])

  return (
    <>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navigation={workerNavigation}
      />
      <div className='flex flex-1 flex-col md:pl-64'>
        <TopNavbar
          setSidebarOpen={setSidebarOpen}
          userNavigation={workerTopNavigation}
        />
        {loading === true ? (
          <div className='mx-auto max-w-7xl px-6 text-center pt-4'>
            <div className='rounded-xl ring-gray-100 h-24 flex items-center justify-center'>
              <p className='mt-2 text-lg font-medium text-black text-opacity-50'>
                Loading...
              </p>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </div>
    </>
  )
}
