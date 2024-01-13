import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { Sidebar, TopNavbar } from '../components'
// Constants imports
import { adminTopNavigation } from '../utils/dashboard_toplink'
import { adminNavigation } from '../utils/sidelinks'

export const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navigation={adminNavigation}
      />
      <div className='flex flex-1 flex-col md:pl-64'>
        <TopNavbar
          setSidebarOpen={setSidebarOpen}
          userNavigation={adminTopNavigation}
        />
        <Outlet />
      </div>
    </>
  )
}
