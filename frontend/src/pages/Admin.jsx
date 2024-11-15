import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Sidebar, TopNavbar, Banner } from '../components'
import { useAdminStore } from '../api/store'
// Constants imports
import { adminTopNavigation } from '../utils/dashboard_toplink'
import { adminNavigation } from '../utils/sidelinks'
import HomeLoading from '../components/Skeleton/HomeLoading'

export const Admin = () => {
  const { setProfile, setEmployees, dataLoaded, setDataLoaded } =
    useAdminStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  async function handleSetup () {
    try {
      setDataLoaded(false)
      await setProfile()
      await setEmployees()
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
        navigation={adminNavigation}
      />
      <div className='flex flex-1 flex-col md:pl-64'>
        <Banner text='The admin panel is being built.' />
        <TopNavbar
          setSidebarOpen={setSidebarOpen}
          userNavigation={adminTopNavigation}
        />
        {!dataLoaded ? <HomeLoading /> : <Outlet />}
      </div>
    </>
  )
}
