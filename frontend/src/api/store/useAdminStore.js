import { create } from 'zustand'
import { supabase } from '..'
import { calculateAge, timestampToDate } from '../../utils/dataFormating'
import { authStore } from './authStore'
import { toast } from 'sonner'
const NODE_ENV = import.meta.env.MODE
import { socket } from '../socket'

export const useAdminStore = create((set, get) => ({
  user: authStore.getState().user,
  loading: false,
  notifications: [],
  base: NODE_ENV === 'development' ? 'http://localhost:8080' : '',
  profile: {},
  employees: [],
  jobs: [],
  payments: [],
  enrollments: [],
  lastAddedUser: null,
  lastAddedAadhaar: null,
  gpo: {},
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
        .select('*, address(*)')
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
    return new Promise(async (resolve, reject) => {
      try {
        const { id, location_id } = await get().profile
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
          const count = newMap.get(enrollment.job.job_id)
          if (enrollment.status == 'enrolled') {
            newMap.set(enrollment.job.job_id, count ? count + 1 : 1)
          }

          get().setWorkerMap(newMap)
        })
        set({
          jobs: data.jobs,
          payments: data.payments,
          enrollments: data.enrollments
        })
        resolve(data)
      } catch (err) {
        console.log(err)
        throw err
      }
    })
  },
  addAttendance: (job_id, workers) => {
    return new Promise(async (resolve, reject) => {
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
        const res = await fetch(
          `${get().base}/api/admin/add-attendance`,
          options
        )
        const { data, error } = await res.json()
        set({ loading: false })
        if (error) throw error
        resolve(data)
      } catch (err) {
        console.log(err)
        set({ loading: false })
        reject(err)
      }
    })
  },
  payout: async () => {
    try {
      const profile = get().profile
      const options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'Application/json',
          Accept: 'Application/json'
        },
        body: JSON.stringify({
          locationId: profile.location_id.id,
          adminId: profile.id
        })
      }
      const res = await fetch(`${get().base}/api/admin/payout`, options)
      const {
        data: { payments, gpo },
        error
      } = await res.json()
      if (error) throw error
      set({ gpo: gpo[0] })
      const updatedPayments = payments.map((payment, index) => ({
        ...payment,
        Transaction: `To ${payment.payment_to.first_name} ${payment.payment_to.last_name}, ID: ${payment.payment_to.mgnrega_id}`,
        Amount: `₹${payment.amount.toFixed(2)}`,
        Date: timestampToDate(payment.created_at),
        Status: payment.status
      }))
      set({ payments: updatedPayments })
      return gpo
    } catch (err) {
      console.log(err)
      toast.error(err.message)
    }
  },
  enrollWorker: async applicationId => {
    try {
      set({ loading: true })
      const { id } = get().profile
      socket.emit(
        'enroll',
        { applicationId: applicationId, sender: id },
        ({ error, data }) => {
          if (error) throw error
          toast.success('Successfully enrolled.')
          set({ loading: false })
        }
      )
    } catch (err) {
      set({ loading: false })
      toast.error('Something went wrong.')
      console.log(err)
    }
  },
  rejectApplication: async (notification, remark) => {
    return new Promise(async (resolve, reject) => {
      try {
        set({ loading: true })
        const { id } = get().profile
        socket.emit(
          'rejectApplication',
          {
            notification: notification,
            remark: remark
          },
          ({ data, error }) => {
            if (error) throw error
            set({ loading: false })
            toast.success('Rejected the application.')
            resolve(data)
          }
        )
      } catch (err) {
        console.log(err)
        set({ loading: false })
        reject(err)
        toast.error('Something went wrong.')
      }
    })
  }
}))
