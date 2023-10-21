import { Navigate } from 'react-router-dom'

export default function NotFound ({ path }) {
  if (path == 'worker') return <Navigate to='/worker/dashboard' />
  else if (path == 'admin') return <Navigate to='/admin/dashboard' />
  return <Navigate to='/' />
}
