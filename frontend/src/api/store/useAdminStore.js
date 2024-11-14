import { create } from 'zustand'
import { supabase } from '..'
import { calculateAge } from '../../utils/dataFormating'
import { authStore } from './authStore'
import { toast } from 'sonner'
const NODE_ENV = import.meta.env.MODE

export const useAdminStore = create((set, get) => ({
  user: authStore.getState().user,
  loading: false,
  base: NODE_ENV === 'development' ? 'http://localhost:8080' : '',
  profile: {},
  employees: {},
  lastAddedUser: null,
  lastAddedAadhaar: null,
  checkUser: authStore.getState().checkUser,
  setLoading: loading => set({ loading: loading }),
  checkLastAadhaar: () => {
    set({ loading: true })
    const lastAddedAadhaar = JSON.parse(
      localStorage.getItem('lastAddedAadhaar')
    )
    if (lastAddedAadhaar !== null) {
      set({ lastAddedAadhaar: lastAddedAadhaar, loading: false })
      return true
    }
    set({ loading: false })
    return false
  },
  checkLastUser: () => {
    set({ loading: true })
    const lastAddedUser = JSON.parse(localStorage.getItem('lastAddedUser'))
    if (lastAddedUser != null) {
      set({ lastAddedUser: lastAddedUser, loading: false })
      return true
    }
    set({ loading: false })
    return false
  },
  setProfile: async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await get().checkUser()
        const { data: profile, error } = await supabase
          .from('sachiv')
          .select(`*, location_id(*)`)
          .eq('id', user.id)
        if (error) throw error
        set({ profile: profile[0] })
        resolve(profile[0])
      } catch (error) {
        console.log(error)
        toast.error(error.message)
        throw error
      }
    })
  },
  addUser: async user => {
    try {
      set({ loading: true })
      //This data will be sent to the server with the POST request.
      const userData = {
        email: user.email,
        password: user.password
      }
      const options = {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: { 'content-type': 'application/json' }
      }
      const url = `${get().base}/api/admin/createuser`
      const toastID = toast.loading('Adding User...')
      const res = await fetch(url, options)
      const { data, error } = await res.json()
      toast.dismiss(toastID)
      set({ loading: false })
      if (error) throw error
      toast.success('New user added.')
      localStorage.setItem('lastAddedUser', JSON.stringify(data))
      set({ lastAddedUser: data })
      return data
    } catch (error) {
      throw error
    }
  },
  setAadhaarData: async aadhaarNo => {
    try {
      set({ loading: true })
      const toastId = toast.loading('Getting aadhaar data...')
      localStorage.removeItem('lastAddedAadhaar')
      const userData = { aadhaar: aadhaarNo }
      const options = {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: { 'Content-Type': 'application/json' }
      }
      const url = `${get().base}/api/admin/aadhaar`
      const res = await fetch(url, options)
      const { data, error } = await res.json()
      if (error) {
        toast.dismiss(toastId)
        return toast.error(error)
      }
      const updatedData = { ...data, age: calculateAge(data.dob) }
      localStorage.setItem('lastAddedAadhaar', JSON.stringify(updatedData))
      set({ lastAddedAadhaar: updatedData })
      toast.success('Fields filled with aadhaar data.')
      set({ loading: false })
      return updatedData
    } catch (error) {
      return toast.error(`${error.message}, Please try again.`)
    }
  },
  createEmployee: async (userData, navigate) => {
    try {
      set({ loading: true })
      const options = {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: { 'content-type': 'application/json' }
      }
      const url = `${get().base}/api/admin/createemp`
      const toastID = toast.loading('Adding Employee...')
      const res = await fetch(url, options)
      const { data, error } = await res.json()
      toast.dismiss(toastID)
      set({ loading: false })
      if (error) throw error
      toast.success('Employee added successfully')
      navigate('/admin/employee')
      await get().setEmployees()
      set({ lastAddedUser: null, lastAddedAadhaar: null })
      localStorage.removeItem('lastAddedUser')
      localStorage.removeItem('lastAddedAadhaar')
      return data
    } catch (error) {
      return toast.error(error.message)
    }
  },
  setEmployees: async () => {
    try {
      const { data: employees, error } = await supabase
        .from('worker')
        .select('*')
        .eq('address', get().profile.location_id.id)
      if (error) {
        toast.error(error.message)
        throw error
      }
      set({ employees: employees })
    } catch (error) {
      toast.error(error.message)
      throw error
    }
  },

  // Dashboard Data fetching functions
  setDashboard: async () => {
    try {
      set({ loading: true })
      const adminId = get().profile.id
      console.log(adminId)
      const options = {
        method: 'POST',
        body: JSON.stringify({ adminId: adminId }),
        headers: { 'Content-Type': 'application/json' }
      }
      const url = `${get().base}/api/admin/dashboard`
      const res = await fetch(url, options)
      const { data, error } = await res.json()
      if (error) {
        return toast.error(error)
      }
      console.log(data)
      set({ loading: false })
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}))
