import { Worker, Auth, Home, Admin } from './pages'
import { Protected, NotFound, ValidLink } from './components'
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import { socket } from './api/socket.js'
import { useEffect } from 'react'

// Admin Components
import {
  AdminDashboard,
  AdminAttendance,
  JobAttendance,
  Jobs as AdminJobs,
  Progress,
  ViewEmployees,
  EditEmployee,
  Employee,
  Payout,
  AdminProfile,
  ViewJobs,
  AddJob
} from './components/Admin'

// Worker Components
import {
  Profile,
  Jobs,
  Payment,
  Attendance,
  Dashboard
} from './components/Worker'

// Auth components
import { SignInForm, ForgotPass, ResetPass } from './components/Auth'

export default function App () {

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(value) {
      setFooEvents(previous => [...previous, value]);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('foo', onFooEvent);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('foo', onFooEvent);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/auth' element={<Auth />}>
          <Route path='login' element={<SignInForm />} />
          <Route path='recovery' element={<ForgotPass />} />
          <Route element={<ValidLink />}>
            <Route path='reset' element={<ResetPass />} />
          </Route>
          <Route path='*' element={<NotFound path='auth' />} />
        </Route>
        <Route element={<Protected />}>
          <Route path='worker' element={<Worker />}>
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='profile' element={<Profile />} />
            <Route path='jobs' element={<Jobs />} />
            <Route path='payment' element={<Payment />} />
            <Route path='attendance' element={<Attendance />} />
            <Route path='*' element={<NotFound path='worker' />} />
          </Route>
          <Route path='admin' element={<Admin />}>
            <Route path='dashboard' element={<AdminDashboard />} />
            <Route path='jobs' element={<AdminJobs />}>
              <Route index element={<ViewJobs />} />
              <Route path='add' element={<AddJob />} />
            </Route>
            <Route path='attendance' element={<AdminAttendance />}>
              <Route path='job/:jobId' element={<JobAttendance />} />
            </Route>
            <Route path='workers' element={<Employee />}>
              <Route index element={<ViewEmployees />} />
              <Route path='add' element={<Progress />} />
              <Route path='edit/:id' element={<EditEmployee />} />
            </Route>
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
