import { create } from 'zustand'
import { supabase } from '..'
import { toast } from 'sonner'
import {
  timestampToDate,
  jobDuration,
  formatLocation
} from '../../utils/dataFormating'

export const useWorkerStore = create((set, get) => ({
  user: { email: '', type: '', id: '' },
  loading: false,
  dataLoaded: false,
  jobs: [],
  lastWork: {
    location: {},
    name: '',
    presence: 0,
    labours: 0,
    completion: '',
    deadline: '',
    duration: ''
  },
  locations: [],
  payment: [],
  attendances: [],
  profile: {},
  setDataLoaded: dataLoaded => set({ dataLoaded }),
  setLoading: loading => set({ loading }),
  setProfile: async () => {
    let token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN)
    token = token ? JSON.parse(token) : {}
    set({
      user: { email: token.user.email, type: token.userType, id: token.user.id }
    })
    await supabase
      .from('worker')
      .select(`*, address(*)`)
      .eq('id', get().user.id)
      .then(({ data, error }) => {
        if (error) {
          return toast.error(error.message)
        }
        set({ profile: data[0] })
        return { data, error }
      })
  },
  setJobs: async () => {
    const locationId = get().profile.address.id
    await supabase
      .from('jobs')
      .select(`*, location_id(*)`)
      .eq('location_id', locationId)
      .then(async ({ data, error }) => {
        if (error) {
          return toast.error(error.message)
        }
        const result = await Promise.all(data.map(get().getEnrollment))
        set({ jobs: result })
      })
  },
  setPayment: async () => {
    const { data: payments, error } = await supabase
      .from('payments')
      .select(`*, payment_for(*)`)
      .eq('payment_to', get().user.id)
      .order('created_at', { ascending: false })
    if (error) {
      console.log(error)
      return toast.error(error.message)
    }
    set({ payment: payments })
  },
  setAttendance: async () => {
    await supabase
      .from('attendance')
      .select(`*, jobs(*), attendance_for(location_id(*))`)
      .eq('worker_id', get().user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          return toast.error(error.message)
        }
        const result = data.map(item => {
          return {
            ...item,
            Date: timestampToDate(item.created_at),
            Work: item.jobs.job_name,
            Status: item.status,
            Location: formatLocation(item.attendance_for.location_id)
          }
        })
        set({ attendances: result })
      })
  },
  setLastWork: async () => {
    try {
      const { data: attendance, error } = await supabase
        .from('attendance')
        .select(`*, jobs(*)`)
        .eq('worker_id', get().user.id)
        .eq('status', 'present')
        .order('created_at', { ascending: false })
        .limit(1)
      if (error) {
        console.log(error)
        return toast.error(error.message)
      }
      // if (!attendance) return '';
      const job = attendance[0].jobs
      const deadline = timestampToDate(job.job_deadline)
      const { days, percentage } = jobDuration(job.created_at, job.job_deadline)
      const presence = attendance.length
      const { data } = await supabase
        .from('workers_jobs')
        .select(`*, job_id(location_id(*))`)
        .eq('job_id', job.job_id)
      set({
        lastWork: {
          location: data[0].job_id.location_id,
          name: job.job_name,
          presence: presence,
          labours: data.length,
          deadline: deadline,
          duration: days,
          completion: percentage
        }
      })
    } catch (error) {
      console.log(error)
      return toast.error(error.message)
    }
  },
  setLocations: async () => {
    await supabase
      .from('workers_jobs')
      .select(`*, job_id(location_id(*))`)
      .eq('worker_id', get().user.id)
      .then(({ data, error }) => {
        if (error) {
          return toast.error(error.message)
        }
        const result = data.map(item => item.job_id.location_id)
        set({ locations: result })
      })
  },

  // Helping functions
  getLocation: async item => {
    const { data: location, error } = await supabase
      .from('locations')
      .select(`*`)
      .eq('id', item.jobs.location_id)
    if (error) {
      return error
    }
    return {
      ...item,
      Date: timestampToDate(item.created_at),
      Work: item.jobs.job_name,
      Status: item.status,
      Location: location[0]
    }
  },
  getEnrollment: async item => {
    const { data, error } = await supabase
      .from('workers_jobs')
      .select(`*`)
      .eq('job_id', item.job_id)
      .eq('worker_id', get().user.id)
    if (error) {
      return error
    }
    const hasEnrolled = data.length > 0 ? true : false
    return {
      ...item,
      Work: item.job_name,
      Location: formatLocation(item.location_id),
      Status: hasEnrolled ? 'enrolled' : 'unenrolled',
      Started: timestampToDate(item.created_at),
      Duration: `${jobDuration(item.created_at, item.job_deadline).days} Day`
    }
  }
}))
