import { create } from 'zustand'
import { supabase } from '..'
import { toast } from 'sonner'
export const authStore = create((set, get) => ({
  user: { email: '', type: '', id: '', photo: '' },
  captchaToken: '',
  loading: false,
  setCaptchaToken: token => set({ captchaToken: token }),
  checkUser: async () => {
    await supabase.auth
      .getSession()
      .then(async ({ data }) => {
        if (!data.session) {
          localStorage.setItem(import.meta.env.VITE_AUTH_TOKEN, null)
          return null
        }
        const authEmail = data.session.user.email
        const userId = data.session.user.id
        const userType = data.session.userType
        await supabase
          .from('profiles')
          .select('avatar')
          .eq('id', data.session.user.id)
          .then(({ data }) => {
            let token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN)
            token = token ? JSON.parse(token) : {}
            token['userType'] = userType
            localStorage.setItem(
              import.meta.env.VITE_AUTH_TOKEN,
              JSON.stringify(token)
            )
            set({
              user: {
                email: authEmail,
                type: userType,
                id: userId,
                photo: data[0].avatar
              }
            })
            return get().user
          })
      })
      .catch(err => {
        toast.error(err.message)
        return null
      })
  },
  loginUser: async (email, password, navigate) => {
    const verTID = toast.loading('Verifying')
    await supabase.auth
      .signInWithPassword({
        email: email,
        password: password,
        options: { captchaToken: get().captchaToken }
      })
      .then(async authRes => {
        if (authRes.error) return toast.error(`${authRes.error.message}`)
        const authEmail = authRes.data.user.email
        const userId = authRes.data.user.id
        await supabase
          .from('profiles')
          .select('*')
          .eq('id', authRes.data.user.id)
          .then(({ data }) => {
            const userType = data[0].user_type
            const avatar = data[0].avatar
            let token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN)
            token = token ? JSON.parse(token) : {}
            token['userType'] = userType
            localStorage.setItem(
              import.meta.env.VITE_AUTH_TOKEN,
              JSON.stringify(token)
            )
            set({
              user: {
                email: authEmail,
                type: userType,
                id: userId,
                photo: avatar
              }
            })
            toast.dismiss(verTID)
            toast.success('Login successful!', { duration: 500 })
            navigate(`/${userType}/dashboard`)
            return data
          })
        return authRes.data
      })
      .catch(err => {
        console.log(err)
        return toast.error(err.message)
      })
  },
  checkSession: async navigate => {
    const user = get().user
    if (user.email !== '') {
      navigate(`/${user.type}/dashboard`)
      toast.success('Login successful!', { duration: 500 })
      return null
    }
    navigate('/auth/login')
    return null
  },
  logoutUser: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) return toast.error(error.message)
    else {
      set({ user: { email: '', type: '', id: '', photo: null } })
      localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN)
      toast.success('Logout successful!', { duration: 750 })
      return null
    }
  },
  recoverUser: async (email, navigate) => {
    set({ loading: true })
    const redirectURL = 'https://nrega-2-0.vercel.app/auth/reset'
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectURL
    })
    if (error) {
      console.log(error)
      return toast.error(error.message)
    } else {
      console.log(data)
      set({ loading: false })
      toast.success('Recovery email sent!', { duration: 750 })
      navigate('/')
      return null
    }
  },
  resetPassword: async (new_password, navigate) => {
    const { data, error } = await supabase.auth.updateUser({
      password: new_password
    })
    if (error) return toast.error(error.message)
    else {
      console.log(data)
      toast.success('Password reset successful!', { duration: 750 })
      const user = get().user
      navigate(`/${user.type}/dashboard`)
      return null
    }
  },
  demoLogin: async (email, type, navigate) => {
    const loginUser = get().loginUser
    let password = ''
    if (type === 'worker') {
      password = import.meta.env.VITE_WORKER_PASSWORD
    } else if (type === 'admin') {
      password = import.meta.env.VITE_ADMIN_PASSWORD
    }
    await loginUser(email, password, navigate)
  }
}))
