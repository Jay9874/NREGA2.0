import { Navigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { authStore } from '../../api/store'

export default function Verify () {
  const [searchParams] = useSearchParams()
  const [params, setParams] = useState({})
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const { verify } = authStore()
  const [redirectTo, setRedirectTo] = useState('')

  async function verifyLink (searchParams) {
    try {
      if (!params) throw new Error('Link is not valid, create a new one.')
      const data = await verify(searchParams)
      setRedirectTo(`/${data.type}/dashboard`)
      toast.dismiss()
      toast.success('Email verified and logged in successfully!', {
        duration: 500
      })
      setIsAuthorized(true)
      setLoading(true)
    } catch (err) {
      console.log(err)
      loading(false)
      toast.error(err)
      setIsAuthorized(false)
    }
  }

  useEffect(() => {
    const token_hash = searchParams.get('token_hash')
    const error = searchParams.get('error')
    if (error) {
      const error_desc = searchParams.get('error_description')
      toast.error(error_desc)
      setToken('')
    } else if (!token_hash) {
      toast.error('Link is invalid, sign up again')
      setToken('')
    } else if (token_hash !== '') {
      const token_hash = searchParams.get('token_hash')
      const email = searchParams.get('email')
      const type = searchParams.get('type')
      setParams({ token_hash, email, type})
      verifyLink(searchParams)
    }
  }, [searchParams])

  return (
    !loading &&
    (isAuthorized ? (
      <Navigate to={redirectTo} />
    ) : (
      <Navigate to='/auth/login' />
    ))
  )
}
