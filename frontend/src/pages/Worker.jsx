import { Outlet } from 'react-router-dom'
import { useState } from 'react'
// Importing all the components
import { Sidebar, TopNavbar } from '../components'

// Constants imports
import { workerNavigation } from '../utils/sidelinks'
import { workerTopNavigation } from '../utils/dashboard_toplink'


export const Worker = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} navigation={workerNavigation} />
      <div className='flex flex-1 flex-col md:pl-64'>
        <TopNavbar setSidebarOpen={setSidebarOpen} userNavigation={workerTopNavigation} />
        <Outlet />
      </div>
    </>
  )
}
