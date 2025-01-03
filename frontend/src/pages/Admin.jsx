import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Sidebar, TopNavbar, Banner } from '../components'
import { useAdminStore } from '../api/store'
import { socket } from '../api/socket'
// Constants imports
import { adminTopNavigation } from '../utils/dashboard_toplink'
import { adminNavigation } from '../utils/sidelinks'
import HomeLoading from '../components/Skeleton/HomeLoading'

export const Admin = () => {
  const {
    setProfile,
    setEmployees,
    setDashboard,
    loading,
    setLoading,
    payout
  } = useAdminStore()

  const [isConnected, setIsConnected] = useState(socket.connected)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  async function handleSetup () {
    try {
      setLoading(true)
      await setProfile()
      await setDashboard()
      await setEmployees()
      await payout()
      setLoading(false)
    } catch (error) {
      return error
    }
  }
  useEffect(() => {
    handleSetup()
    function onConnect () {
      setIsConnected(true)
    }

    function onDisconnect () {
      setIsConnected(false)
    }

    function onFooEvent (value) {
      setFooEvents(previous => [...previous, value])
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('foo', onFooEvent)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('foo', onFooEvent)
    }
  }, [])
  return (
    <>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navigation={adminNavigation}
      />
      <div className='flex flex-1 flex-col md:ml-64'>
        <Banner text='The admin panel is being built.' />
        <TopNavbar
          setSidebarOpen={setSidebarOpen}
          userNavigation={adminTopNavigation}
        />
        {loading ? <HomeLoading /> : <Outlet />}
      </div>
    </>
  )
}
