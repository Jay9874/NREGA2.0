import { Outlet, Navigate, useLocation } from 'react-router-dom'

export default function Protected() {
  const location = useLocation()
  const newLocation = location.pathname.slice(1)
  var path
  if (newLocation.indexOf('/') < 1) {
    path = newLocation
  } else {
    path = newLocation.slice(0, newLocation.indexOf('/'))
  }
  const token = JSON.parse(
    localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN)
  )
  return token?.userType === path ? <Outlet /> : <Navigate to='/auth/login' />
}
