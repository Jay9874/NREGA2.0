import { create } from 'zustand'
import { supabase } from '..'
import { toast } from 'sonner'
const NODE_ENV = import.meta.env.MODE

export const authStore = create((set, get) => ({
  user: { email: '', type: '', id: '', photo: '' },
  notifications: [],
  base: NODE_ENV === 'development' ? 'http://localhost:8080' : '',
  captchaToken: '',
  loading: false,
  notificationPanel: false,
  setNotificationPanel: status => set({ notificationPanel: status }),
  addToNotifications: notification => {
    set(state => ({ notifications: [...state.notifications, notification] }))
  },
  setCaptchaToken: token => set({ captchaToken: token }),
  checkUser: async () => {
    return new Promise(async (resolve, reject) => {
      try {
        set({ loading: true })
        const options = {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        }
        const url = `${get().base}/api/auth/validate`
        const res = await fetch(url, options)
        const { data, error } = await res.json()
        if (error) throw error
        const { user } = data
        const activeUser = {
          email: user.email,
          type: user.user_metadata.userType,
          id: user.id,
          photo: user.user_metadata.avatar
        }
        set({ user: activeUser })
        localStorage.setItem('suid', JSON.stringify({ user: activeUser }))
        set({ loading: false })
        resolve(activeUser)
      } catch (err) {
        set({ loading: false })
        reject(err)
      }
    })
  },
  loginUser: async (email, password, navigate) => {
    try {
      set({ loading: true })
      const body = { email: email, password: password }
      var headers = new Headers()
      headers.append('Content-Type', 'application/json')
      headers.append('Accept', 'application/json')
      const options = {
        method: 'POST',
        body: JSON.stringify(body),
        credentials: 'include',
        headers: headers
      }
      const url = `${get().base}/api/auth/login`
      const toastId = toast.loading('Logging you in...', { duration: Infinity })
      const res = await fetch(url, options)
      const { data, error } = await res.json()
      if (error) throw error
      const { user } = data
      const activeUser = {
        email: user.email,
        type: user.user_metadata.userType,
        id: user.id,
        photo: user.user_metadata.avatar
      }
      set({ user: activeUser })
      localStorage.setItem('suid', JSON.stringify({ user: activeUser }))
      set({ loading: false })
      toast.dismiss(toastId)
      toast.success('Login successful!')
      navigate(`/${activeUser.type}/dashboard`)
    } catch (err) {
      toast.error(err.message)
      toast.dismiss()
      set({ loading: false })
      return err
    }
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
  logoutUser: async navigate => {
    try {
      set({ loading: true })
      const toastId = toast.loading('Logging you out...')
      const options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      }
      const url = `${get().base}/api/auth/logout`
      const res = await fetch(url, options)
      const { data, error } = await res.json()
      if (error) throw error
      toast.dismiss(toastId)
      toast.success('Logged out successfully!')
      set({
        user: { email: '', type: '', id: '', photo: null },
        loading: false
      })
      localStorage.removeItem('suid')
      navigate('/')
      return data
    } catch (err) {
      set({ loading: false })
      toast.error(err.message)
      toast.dismiss()
      return null
    }
  },
  recoverUser: async (email, navigate) => {
    set({ loading: true })
    const redirectURL = 'https://nrega-2-0.vercel.app/auth/reset'
    toast.loading('Sending recovery email...')
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectURL
    })
    if (error) {
      console.log(error)
      set({ loading: false })
      return toast.error(error.message)
    } else {
      set({ loading: false })
      toast.dismiss()
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
  },
  setNotifications: async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const { id, type } = get().user
        const options = {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'Application/json',
            Accept: 'Application/json'
          },
          body: JSON.stringify({ userId: id, type: type })
        }
        const res = await fetch(`${get().base}/api/auth/notification`, options)
        const { data, error } = await res.json()
        if (error) throw error
        set({ notifications: data })
        resolve(data)
      } catch (err) {
        console.log(err)
        toast.error(err)
        reject(null)
      }
    })
  },
  clearANotification: async notificationId => {
    return new Promise(async (resolve, reject) => {
      try {
        const notifications = get().notifications
        const { type } = get().user
        const options = {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'Application/json',
            Accept: 'Application/json'
          },
          body: JSON.stringify({ notificationId: notificationId, type: type })
        }
        const res = await fetch(
          `${get().base}/api/auth/clear-notification`,
          options
        )
        const { data, error } = await res.json()
        if (error) throw error
        const updatedNotifications = notifications.filter(
          obj => obj.id != notificationId
        )
        set({ notifications: updatedNotifications })
        resolve(data)
      } catch (err) {
        console.log(err)
        reject(err)
      }
    })
  }
}))
