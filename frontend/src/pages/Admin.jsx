import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Sidebar, TopNavbar, Banner } from '../components'
import { useAdminStore } from '../api/store'
// Constants imports
import { adminTopNavigation } from '../utils/dashboard_toplink'
import { adminNavigation } from '../utils/sidelinks'

export const Admin = () => {
  const { setProfile, setEmployees, loading, setLoading } = useAdminStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  async function handleSetup () {
    try {
      setLoading(true)
      await setProfile()
      await setEmployees()
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
      <div className='flex flex-1 flex-col md:pl-64'>
        <Banner text='The admin panel is being built.' />
        <TopNavbar
          setSidebarOpen={setSidebarOpen}
          userNavigation={adminTopNavigation}
        />
        {loading == true ? (
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
