import { Worker, Auth, Home, Admin } from './pages'
import { authStore } from './api/store'
import { Protected, NotFound } from './components'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
// Admin Components
import {
  AdminDashboard,
  AdminAttendance,
  Addjobs,
  Employee,
  Payout,
  AdminProfile
} from './components/Admin'

// Worker Components
import {
  Profile,
  Jobs,
  Payment,
  Attendance,
  Dashboard
} from './components/Worker'
import { useEffect, useState } from 'react'
import { Toaster } from 'sonner'

export default function App () {
  const { checkUser, user } = authStore()
  const [loggedUser, setLoggedUser] = useState(user)

  useEffect(() => {
    checkUser()
    setLoggedUser(user)
  }, [checkUser])
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/auth' element={<Auth />} />
        <Route element={<Protected user={loggedUser} />}>
          <Route path='/worker' element={<Worker />}>
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='profile' element={<Profile />} />
            <Route path='jobs' element={<Jobs />} />
            <Route path='payment' element={<Payment />} />
            <Route path='attendance' element={<Attendance />} />
            <Route path='*' element={<NotFound path='worker' />} />
          </Route>
          <Route path='/admin' element={<Admin />}>
            <Route path='dashboard' element={<AdminDashboard />} />
            <Route path='addjob' element={<Addjobs />} />
            <Route path='attendance' element={<AdminAttendance />} />
            <Route path='employee' element={<Employee />} />
            <Route path='payout' element={<Payout />} />
            <Route path='profile' element={<AdminProfile />} />
            <Route path='*' element={<NotFound path='admin' />} />
          </Route>
        </Route>
        <Route path='*' element={<NotFound path='*' />} />
      </Routes>
    </BrowserRouter>
  )
}
