import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
const NotFound = ({ path }) => {
  const navigate = useNavigate()
  useEffect(() => {
    if (path == 'worker') navigate('/worker/dashboard')
    else if (path == 'admin') navigate('/admin/dashboard')
    else navigate('/')
    toast.error('Please, put correct url.', { duration: 1000 })
  })
  return null
}

export default NotFound
