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
  employees: [],
  jobs: [],
  payments: [],
  enrollments: [],
  lastAddedUser: null,
  lastAddedAadhaar: null,
  workerMap: new Map(),
  checkUser: authStore.getState().checkUser,
  setLoading: loading => set({ loading: loading }),
  setWorkerMap: map => set({ workerMap: map }),
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
        const token = JSON.parse(localStorage.getItem('suid'))
        const { id } = token.user
        const { data: profile, error } = await supabase
          .from('sachiv')
          .select(`*, location_id(*)`)
          .eq('id', id)
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
        credentials: 'include',
        headers: { 'content-type': 'application/json' }
      }
      const url = `${get().base}/api/admin/createuser`
      toast.loading('Adding User...')
      const res = await fetch(url, options)
      const { data, error } = await res.json()
      toast.dismiss()
      set({ loading: false })
      if (error) throw error
      toast.success('New user added.')
      localStorage.setItem('lastAddedUser', JSON.stringify(data))
      set({ lastAddedUser: data })
      return data
    } catch (err) {
      console.log(err)
      toast.error(err)
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
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      }
      const url = `${get().base}/api/admin/aadhaar`
      const res = await fetch(url, options)
      const { data, error } = await res.json()
      set({ loading: false })
      if (error) throw error
      const updatedData = { ...data, age: calculateAge(data.dob) }
      localStorage.setItem('lastAddedAadhaar', JSON.stringify(updatedData))
      set({ lastAddedAadhaar: updatedData })
      toast.success('Fields filled with aadhaar data.')
      return updatedData
    } catch (error) {
      set({ loading: false })
      return toast.error(`${error}, Please try again.`)
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
      const { id, location_id } = get().profile
      const body = {
        adminId: id,
        locationId: location_id.id
      }
      const options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(body)
      }
      const url = `${get().base}/api/admin/dashboard`
      const res = await fetch(url, options)
      const { data, error } = await res.json()
      if (error) {
        console.log(error)
        return toast.error(error.message)
      }

      const newMap = new Map()
      data.enrollments.forEach((enrollment, index) => {
        const count = newMap.get(enrollment.job_id.job_id)
        newMap.set(enrollment.job_id.job_id, count ? count + 1 : 1)
        get().setWorkerMap(newMap)
      })

      set({
        loading: false,
        jobs: data.jobs,
        payments: data.payments,
        enrollments: data.enrollments
      })
      return data
    } catch (err) {
      set({ loading: false })
      console.log(err)
      throw err
    }
  },
  addAttendance: async (job_id, workers) => {
    try {
      set({ loading: true })
      const options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'Application/json',
          Accept: 'Application/json'
        },
        body: JSON.stringify({ job_id: job_id, workers: workers })
      }
      const res = await fetch(`${get().base}/api/admin/add-attendance`, options)
      const { data, error } = await res.json()
      set({loading: false})
      if (error) throw error
      toast.success("Attendance saved successfully!")
    } catch (err) {
      console.log(err)
      set({loading: false})
      toast.error(err.message)
    }
  }
}))
