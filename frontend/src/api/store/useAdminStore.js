import { create } from 'zustand'
import { calculateAge, timestampToDate } from '../../utils/dataFormating'
import { authStore } from './authStore'
import { toast } from 'sonner'
const NODE_ENV = import.meta.env.MODE
const redirectUrl =
  NODE_ENV === 'development'
    ? 'http://localhost:5173/'
    : 'https://nrega-2-0.vercel.app/'

export const useAdminStore = create((set, get) => ({
  user: authStore.getState().user,
  loading: false,
  notifications: [],
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
        const options = {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'Application/json',
            Accept: 'Application/json'
          },
          body: JSON.stringify({ sachivId: id })
        }
        const res = await fetch('/api/admin/profile', options)
        const { data, error } = await res.json()
        if (error) throw error
        set({ profile: data })
        resolve(data)
      } catch (error) {
        console.log(error)
        toast.dismiss()
        toast.error(error.message)
        reject(error)
      }
    })
  },
  addUser: async user => {
    try {
      set({ loading: true })
      //This data will be sent to the server with the POST request.
      const userData = {
        email: user.email,
        password: user.password,
        redirectUrl: redirectUrl
      }
      const options = {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(userData)
      }
      toast.loading('Adding User...', { duration: Infinity })
      const res = await fetch('/api/admin/createuser', options)
      const { data, error } = await res.json()
      toast.dismiss()
      set({ loading: false })
      if (error) throw error
      toast.success('New user added, check email to verify.')
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
      toast.loading('Getting aadhaar data...', { duration: Infinity })
      localStorage.removeItem('lastAddedAadhaar')
      const userData = { aadhaar: aadhaarNo }
      const options = {
        method: 'POST',
        body: JSON.stringify(userData),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      }
      const res = await fetch('/api/admin/aadhaar', options)
      const { data, error } = await res.json()
      toast.dismiss()
      if (error) throw error
      const updatedData = { ...data, age: calculateAge(data.dob) }
      localStorage.setItem('lastAddedAadhaar', JSON.stringify(updatedData))
      set({ lastAddedAadhaar: updatedData })
      toast.success('Fields filled with aadhaar data.')
      return updatedData
    } catch (error) {
      return toast.error(`${error}, Please try again.`)
    }
  },
  createEmployee: async userData => {
    return new Promise(async (resolve, reject) => {
      try {
        set({ loading: true })
        const options = {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify(userData),
          headers: { 'content-type': 'application/json' }
        }
        toast.loading('Adding worker...', { duration: Infinity })
        const res = await fetch('/api/admin/createemp', options)
        const { data, error } = await res.json()
        toast.dismiss()
        if (error) throw error
        await get().setEmployees()
        set({ lastAddedUser: null, lastAddedAadhaar: null })
        localStorage.removeItem('lastAddedUser')
        localStorage.removeItem('lastAddedAadhaar')
        set({ loading: false })
        resolve(data)
      } catch (error) {
        set({ loading: false })
        toast.dismiss()
        reject(error)
      }
    })
  },
  setEmployees: async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const { id } = get().profile.location_id
        const options = {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'Application/json',
            Accept: 'Application/json'
          },
          body: JSON.stringify({ locationId: id })
        }
        const res = await fetch('/api/admin/get-employees', options)
        const { data, error } = await res.json()
        if (error) throw error
        set({ employees: data })
        resolve(data)
      } catch (error) {
        toast.dismiss()
        toast.error(error.message)
        reject(error)
      }
    })
  },

  // Update the worker profile
  updateWorker: async updatedDetails => {
    return new Promise(async (resolve, reject) => {
      try {
        set({ loading: true })
        toast.loading('Updating details...')
        const options = {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'Application/json',
            Accept: 'Application/json'
          },
          body: JSON.stringify(updatedDetails)
        }
        const res = await fetch('/api/admin/update-worker', options)
        const { data, error } = await res.json()
        if (error) throw error
        const updatedEmployees = await get().setEmployees()
        set({ loading: false })
        toast.dismiss()
        toast.success('Successfully changed details.')
        resolve(data)
      } catch (err) {
        console.log(err)
        set({ loading: false })
        toast.dismiss()
        toast.error('Something went wrong.')
        reject(err)
      }
    })
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
        const res = await fetch('/api/admin/dashboard', options)
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
        reject(err)
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
        const res = await fetch('/api/admin/add-attendance', options)
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
      const res = await fetch('/api/admin/payout', options)
      const {
        data: { payments, gpo },
        error
      } = await res.json()
      if (error) throw error
      set({ gpo: gpo[0] })
      const updatedPayments = payments?.map((payment, index) => ({
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
      toast.dismiss()
      toast.error(err.message)
    }
  },
  enrollWorker: async applicationId => {
    return new Promise(async (resolve, reject) => {
      try {
        set({ loading: true })
        const { id } = get().profile
        const options = {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'Application/json',
            Accept: 'Application/json'
          },
          body: JSON.stringify({ applicationId: applicationId, sender: id })
        }
        const res = await fetch('/api/admin/enroll-worker', options)
        const { data, error } = await res.json()
        if (error) throw error
        toast.success('Successfully enrolled.')
        set({ loading: false })
        resolve(data)
      } catch (err) {
        set({ loading: false })
        toast.dismiss()
        toast.error('Something went wrong.')
        console.log(err)
        reject(err)
      }
    })
  },
  rejectApplication: async (notification, remark) => {
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
          body: JSON.stringify({
            notification: notification,
            remark: remark
          })
        }
        const res = await fetch('/api/admin/reject-application', options)
        const { data, error } = await res.json()
        if (error) throw error
        set({ loading: false })
        toast.success('Rejected the application.')
        resolve(data)
      } catch (err) {
        console.log(err)
        set({ loading: false })
        reject(err)
        toast.dismiss()
        toast.error('Something went wrong.')
      }
    })
  },
  addJob: async jobDetails => {
    return new Promise(async (resolve, reject) => {
      try {
        set({ loading: true })
        toast.loading('Adding new job...', { duration: Infinity })
        const options = {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'Application/json',
            Accept: 'Application/json'
          },
          body: JSON.stringify(jobDetails)
        }
        const res = await fetch('/api/admin/add-job', options)
        const { data, error } = await res.json()
        if (error) throw error
        set({ loading: false })
        toast.dismiss()
        toast.success('Successfully added the job.')
        resolve(data)
      } catch (err) {
        console.error(err)
        set({ loading: false })
        toast.dismiss()
        toast.error('Something went wrong.')
        reject(err)
      }
    })
  },
  fetchARandomAadhaar: async () => {
    return new Promise(async (resolve, reject) => {
      try {
        toast.loading('Fetching a random unused aadhaar number from db...', {
          duration: Infinity
        })
        const options = {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'Application/json',
            Accept: 'Application/json'
          }
        }
        const res = await fetch('/api/admin/random-aadhaar', options)
        const { data, error } = await res.json()
        toast.dismiss()
        if (error) throw error
        toast.success('Fetched an aadhaar number, proceed with form.')
        resolve(data)
      } catch (err) {
        console.log(err)
        toast.error('Something went wrong.')
        reject(err)
      }
    })
  },
  fetchARandomFamily: () => {
    return new Promise(async (resolve, reject) => {
      try {
        toast.loading('Fetching a random family from db...', {
          duration: Infinity
        })
        const options = {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'Application/json',
            Accept: 'Application/json'
          }
        }
        const res = await fetch('/api/admin/random-family', options)
        const { data, error } = await res.json()
        toast.dismiss()
        if (error) throw error
        resolve(data)
      } catch (err) {
        console.log(err)
        reject(err)
      }
    })
  },
  validateNregaId: nregaId => {
    return new Promise(async (resolve, reject) => {
      try {
        const options = {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'Application/json',
            Accept: 'Application/json'
          },
          body: JSON.stringify({ id: nregaId })
        }
        const res = await fetch('/api/admin/validate-nrega-id', options)
        const { data, error } = await res.json()
        if (error) throw error
        resolve(data)
      } catch (err) {
        reject(err)
      }
    })
  }
}))
