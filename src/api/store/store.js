import { create } from 'zustand'
import supabase from '..'
import { toast } from 'sonner'
export const authStore = create((set, get) => ({
  user: { email: '', type: '' },
  checkUser: async () => {
    await supabase.auth
      .getSession()
      .then(async ({ data}) => {
        if (!data.session) {
          return null
        }
        const authEmail = data.session.user.email
        await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', data.session.user.id)
          .then(({ data }) => {
            const userType = data[0].user_type
            let token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN)
            token = token ? JSON.parse(token) : {}
            token['userType'] = userType
            localStorage.setItem(
              import.meta.env.VITE_AUTH_TOKEN,
              JSON.stringify(token)
            )
            set({ user: { email: authEmail, type: userType } })
          })
      })
      .catch(err => {
        return null
      })
  },
  loginUser: async (email, password, navigate) => {
    const verTID = toast.loading('Verifying')
    await supabase.auth
      .signInWithPassword({
        email: email,
        password: password
      })
      .then(async authRes => {
        const authEmail = authRes.data.user.email
        await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', authRes.data.user.id)
          .then(({ data }) => {
            const userType = data[0].user_type
            let token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN)
            token = token ? JSON.parse(token) : {}
            token['userType'] = userType
            localStorage.setItem(
              import.meta.env.VITE_AUTH_TOKEN,
              JSON.stringify(token)
            )
            set({ user: { email: authEmail, type: userType } })
            toast.dismiss(verTID)
            toast.success('Login successful!', { duration: 500 })
            if (userType === 'worker') navigate('/worker/dashboard')
            else if (userType === 'admin') navigate('/admin/dashboard')
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
    navigate('/auth')
    return null
  },
  logoutUser: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) return toast.error(error.message)
    else {
      set({ user: { email: '', type: '' } })
      localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN)
      toast.success('Logout successful!', { duration: 750 })
      return null
    }
  }
}))
