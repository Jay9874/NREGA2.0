import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Sidebar, TopNavbar } from '../components'
import { authStore, useAdminStore } from '../api/store'
// Constants imports
import { adminTopNavigation } from '../utils/dashboard_toplink'
import { adminNavigation } from '../utils/sidelinks'
import HomeLoading from '../components/Skeleton/HomeLoading'
import NotificationPanel from '../components/NotificationPanel'

export const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { setProfile, setEmployees, setDashboard, loading, setLoading } =
    useAdminStore()
  const { user, notifications, setNotifications, subscribeRealtime } =
    authStore()

  async function handleSetup () {
    try {
      setLoading(true)
      await setProfile()
      await setDashboard()
      await setEmployees()
      await setPayout()
      await setNotifications()
      await subscribeRealtime('sachiv_notifications')
      setLoading(false)
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
        navigation={adminNavigation}
      />
      <div className='flex flex-1 flex-col md:ml-64'>
        <TopNavbar
          setSidebarOpen={setSidebarOpen}
          userNavigation={adminTopNavigation}
        />
        {loading ? <HomeLoading /> : <Outlet />}
        <NotificationPanel type={user.type} notifications={notifications} />
      </div>
    </>
  )
}
