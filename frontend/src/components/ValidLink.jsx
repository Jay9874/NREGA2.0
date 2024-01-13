import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export default function ValidLink () {
  const navigate = useNavigate()

  useEffect(() => {
    const url = new URL(window.location.href)
    if (url.hash !== '') {
      const hash = url.hash?.slice(1)
      const params = hash?.split('&')
      let uriObj = {}
      params.forEach(param => {
        let [key, value] = param.split('=')
        value = value.replace(/\+/g, ' ')
        uriObj[key] = value
      })
      if (uriObj.error === 'unauthorized_client') {
        console.log(uriObj.error)
        toast.error(uriObj.error_description, { duration: 3000 })
        return navigate('/auth/login')
      }
    }
  }, [])

  return <Outlet />
}
