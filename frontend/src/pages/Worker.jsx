import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { authStore, useWorkerStore } from '../api/store'
import { socket } from '../api/socket'
// Importing all the components
import { Sidebar, TopNavbar } from '../components'

// Constants imports
import { workerNavigation } from '../utils/sidelinks'
import { workerTopNavigation } from '../utils/dashboard_toplink'
import HomeLoading from '../components/Skeleton/HomeLoading'
import NotificationPanel from '../components/NotificationPanel'
import { toast } from 'sonner'

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

  const { user, notifications, setNotifications } = authStore()

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
      await setNotifications()
      setLoading(false)
      setDataLoaded(true)
    } catch (error) {
      return error
    }
  }

  useEffect(() => {
    handleSetup()
    socket.connect()
    socket.emit('join', user.id)
  }, [])

  socket.on('error', error => {
    console.log('error occurred: ', error)
    toast.error(error.message)
  })

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
