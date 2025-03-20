import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { authStore, useWorkerStore } from '../api/store'
// Importing all the components
import { Sidebar, TopNavbar } from '../components'

// Constants imports
import { workerNavigation } from '../utils/sidelinks'
import { workerTopNavigation } from '../utils/dashboard_toplink'
import HomeLoading from '../components/Skeleton/HomeLoading'
import NotificationPanel from '../components/NotificationPanel'
import { toast } from 'sonner'

export const Worker = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const {
    setProfile,
    setPayment,
    setJobs,
    loading,
    setLoading,
    setDataLoaded,
    setLastWork,
    setAttendance
  } = useWorkerStore()

  const { user, notifications, setNotifications, subscribeRealtime } =
    authStore()

  async function handleSetup () {
    try {
      setLoading(true)
      await setProfile()
      await setLastWork()
      await setJobs()
      await setAttendance()
      await subscribeRealtime('worker_notifications')
      await setPayment()
      await setNotifications()
      setLoading(false)
      setDataLoaded(true)
    } catch (err) {
      setLoading(false)
      setDataLoaded(true)
      toast.error(err)
      return err
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
      <div className='relative flex flex-1 flex-col md:ml-64'>
        <TopNavbar
          setSidebarOpen={setSidebarOpen}
          userNavigation={workerTopNavigation}
        />
        {loading === true ? <HomeLoading /> : <Outlet />}
        <NotificationPanel type={user.type} notifications={notifications} />
      </div>
    </>
  )
}
