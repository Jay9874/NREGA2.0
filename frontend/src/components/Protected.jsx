import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { authStore } from '../api/store/authStore'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function Protected () {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const { checkUser } = authStore()
  const location = useLocation()
  
  const newLocation = location.pathname.slice(1)
  var path
  if (newLocation.indexOf('/') < 1) {
    path = newLocation
  } else {
    path = newLocation.slice(0, newLocation.indexOf('/'))
  }

  async function validateRequest () {
    try {
      const user = await checkUser()
      setLoading(false)
      if (user.type == path) setIsAuthorized(true)
      else setIsAuthorized(false)
    } catch (err) {
      localStorage.removeItem('suid')
      toast.error('You are unauthorized, please login first.')
      navigate('/auth/login')
      setLoading(true)
    }
  }
  useEffect(() => {
    validateRequest()
  }, [])

  return !loading && (isAuthorized ? <Outlet /> : <Navigate to='/auth/login' />)
}
