import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useWorkerStore } from '../api/store'
// Importing all the components
import { Sidebar, TopNavbar } from '../components'

// Constants imports
import { workerNavigation } from '../utils/sidelinks'
import { workerTopNavigation } from '../utils/dashboard_toplink'
import HomeLoading from '../components/Skeleton/HomeLoading'

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
      await setProfile(navigate)
      await setPayment()
      await setLocations()
      await setLastWork()
      await setLastAttendance()
      await setAllJobs()
      await setNearbyJobs()
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
      <div className='flex flex-1 flex-col md:ml-64'>
        <TopNavbar
          setSidebarOpen={setSidebarOpen}
          userNavigation={workerTopNavigation}
        />
        {loading === true ? <HomeLoading /> : <Outlet />}
      </div>
    </>
  )
}
