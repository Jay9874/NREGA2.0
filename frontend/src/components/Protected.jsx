import { Outlet, Navigate, useLocation } from 'react-router-dom'

export default function Protected () {
  const location = useLocation()
  const newLocation = location.pathname.slice(1)
  const path = newLocation.slice(0, newLocation.lastIndexOf('/'))
  const token = JSON.parse(
    localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN)
  )
  return token?.userType === path ? <Outlet /> : <Navigate to='/auth/login' />
}
