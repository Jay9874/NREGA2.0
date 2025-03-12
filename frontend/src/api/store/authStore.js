import { create } from 'zustand'
import { toast } from 'sonner'

export const authStore = create((set, get) => ({
  user: { email: '', type: '', id: '', photo: '' },
  notifications: [],
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
        const res = await fetch('/api/auth/validate', options)
        const { data, error } = await res.json()
        if (error) throw error
        set({ user: data })
        localStorage.setItem('suid', JSON.stringify({ user: data }))
        set({ loading: false })
        resolve(data)
      } catch (err) {
        set({ loading: false })
        reject(err)
      }
    })
  },
  loginUser: async (email, password, navigate) => {
    try {
      if (!window.navigator.onLine)
        return toast.error('No internet connection.')
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
      toast.loading('Logging you in...', { duration: Infinity })
      const res = await fetch('/api/auth/login', options)
      const { data, error } = await res.json()
      if (error) throw error
      set({ user: data })
      localStorage.setItem('suid', JSON.stringify({ user: data }))
      set({ loading: false })
      toast.dismiss()
      toast.success('Login successful!')
      navigate(`/${data.type}/dashboard`)
    } catch (err) {
      toast.error(err)
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
      toast.loading('Logging you out...')
      const options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      }
      const res = await fetch('/api/auth/logout', options)
      const { data, error } = await res.json()
      if (error) throw error
      toast.dismiss()
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
      toast.error('Something went wrong, try again.')
      toast.dismiss()
      return null
    }
  },
  recoverUser: email => {
    return new Promise(async (resolve, reject) => {
      try {
        set({ loading: true })
        toast.loading('Sending recovery email...', { duration: Infinity })
        const options = {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'Application/json',
            Accept: 'Application/json'
          },
          body: JSON.stringify({ email: email })
        }
        const res = await fetch('/api/auth/recover-user', options)
        const { data, error } = await res.json()
        if (error) throw error
        set({ loading: false })
        toast.dismiss()
        toast.success('Recovery email sent!', { duration: 750 })
        resolve(null)
      } catch (err) {
        toast.dismiss()
        console.log(err)
        set({ loading: false })
        toast.error(err)
        reject()
      }
    })
  },
  resetPassword: (new_password, code) => {
    return new Promise(async (resolve, reject) => {
      try {
        toast.loading('Changing the password...', { duration: Infinity })
        set({ loading: true })
        const options = {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'Application/json',
            Accept: 'Application/json'
          },
          body: JSON.stringify({ newPassword: new_password, code: code })
        }
        const res = await fetch('/api/auth/reset-password', options)
        const { data, error } = await res.json()
        toast.dismiss()
        set({ loading: false })
        if (error) throw error
        toast.success('Password reset successful!')
        localStorage.setItem('suid', JSON.stringify({ user: data }))
        resolve(data)
      } catch (err) {
        set({ loading: false })
        toast.dismiss()
        reject(err)
      }
    })
  },
  demoLogin: async (email, type, navigate) => {
    if (!window.navigator.onLine) return toast.error('No internet connection.')
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
        const res = await fetch('/api/notification', options)
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
        const res = await fetch('/api/clear-notification', options)
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
  },
  verify: async (hash, type) => {
    return new Promise(async (resolve, reject) => {
      try {
        toast.loading('Verifying the link...', { duration: Infinity })
        const options = {
          method: 'POST',
          credentials: 'include',
          headers: {
            Accept: 'Application/json',
            'Content-Type': 'Application/json'
          },
          body: JSON.stringify({ token_hash: hash, type: type })
        }
        const res = await fetch('/api/auth/verify', options)
        const { data, error } = await res.json()
        toast.dismiss()
        if (error) throw error
        set({ user: data })
        localStorage.setItem('suid', JSON.stringify({ user: data }))
        resolve(data)
      } catch (err) {
        console.log(err)
        toast.error(err)
        reject(err)
      }
    })
  }
}))
