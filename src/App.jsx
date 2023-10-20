import { Worker, Auth, Home, Admin } from './pages'
import { authLoader, workerLoader, adminLoader } from './routes/loaders'
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
  Routes
} from 'react-router-dom'
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

/*const router = createBrowserRouter([
  {
    path: '/',
    Component: Home
  },
  {
    path: '/auth',
    Component: Auth
  },
  {
    path: '/worker',
    Component: Worker,
    loader: workerLoader,
    children: [
      { path: 'dashboard', Component: Dashboard, loader: authLoader },
      { path: 'profile', Component: Profile, loader: authLoader },
      { path: 'jobs', Component: Jobs, loader: authLoader },
      { path: 'payment', Component: Payment, loader: authLoader },
      { path: 'attendance', Component: Attendance, loader: authLoader },
      {
        path: '*',
        Component: Dashboard,
        loader: () => {
          return redirect('/worker/dashboard')
        }
      }
    ]
  },
  {
    path: '/admin',
    Component: Admin,
    loader: adminLoader,
    children: [
      { path: 'dashboard', Component: AdminDashboard, loader: authLoader },
      { path: 'addjob', Component: Addjobs, loader: authLoader },
      { path: 'attendance', Component: AdminAttendance, loader: authLoader },
      { path: 'employee', Component: Employee, loader: authLoader },
      { path: 'payout', Component: Payout, loader: authLoader },
      { path: 'profile', Component: AdminProfile, loader: authLoader },
      {
        path: '*',
        Component: Dashboard,
        loader: () => {
          return redirect('/admin/dashboard')
        }
      }
    ]
  },
  {
    path: '*',
    Component: Root,
    loader: () => {
      return redirect('/')
    }
  }
])*/
export default function App () {
  return (
        <BrowserRouter>
          <Routes>
            <Route element={>
            </Route>
          </Routes>
        </BrowserRouter>
    )
}
