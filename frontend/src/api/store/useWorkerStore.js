import { create } from 'zustand'
import { supabase } from '..'
import { toast } from 'sonner'
import { timestampToDate, jobDuration } from '../../utils/convertTimestamp'

export const useWorkerStore = create((set, get) => ({
  user: { email: '', type: '', id: '' },
  loading: false,
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
  payment: [],
  attendances: [],
  profile: {},
  setLoading: loading => set({ loading }),
  setProfile: async () => {
    set({ loading: true })
    let token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN)
    token = token ? JSON.parse(token) : {}
    set({
      user: { email: token.user.email, type: token.userType, id: token.user.id }
    })
    const { data, error } = await supabase
      .from('worker')
      .select(`*, address(*)`)
      .eq('id', get().user.id)
    if (error) {
      return toast.error(error.message)
    }
    set({ profile: data[0] })
    set({ loading: false })
  },
  setJobs: async () => {
    set({ loading: true })
    await get().setProfile()
    const { id } = get().profile.address
    // console.log(get().user)
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('location_id', id)
    console.log(data)
    if (error) return toast.error(error.message)
    console.log(data)
    set(() => {
      const result = data.map(async item => {
        const started = timestampToDate(item.created_at)
        const { days, percentage } = jobDuration(
          item.created_at,
          item.job_deadline
        )
        const { data: enrollment, error } = await supabase
          .from('workers_jobs')
          .select(`*`)
          .eq('worker_id', get().user.id)
          .eq('')
        console.log(enrollment)
        return {
          ...item,
          Started: started,
          duration: days
        }
      })
      set({ jobs: result })
      set({ loading: false })
    })
    // set({ jobs: data })
    // set({ loading: false })
  },
  setPayment: async () => {
    set({ loading: true })
    await get().setProfile()
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
    set({ loading: false })
  },
  getAttendance: async () => {
    set({ loading: true })
    await get().setProfile()
    const { data: attendance, error } = await supabase
      .from('attendance')
      .select(`*, jobs(*)`)
      .eq('worker_id', get().user.id)
      .order('created_at', { ascending: false })
    if (error) {
      console.log(error)
      return toast.error(error.message)
    }
    set(async () => {
      const result = await Promise.all(attendance.map(get().getLocation))
      set({ attendances: result })
      set({ loading: false })
    })
  },
  setLastWork: async () => {
    try {
      set({ loading: true })
      await get().setProfile()
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
      const job = attendance[0].jobs
      set(async () => {
        const deadline = timestampToDate(job.job_deadline)
        const { days, percentage } = jobDuration(
          job.created_at,
          job.job_deadline
        )
        try {
          const { data: attendance, error } = await supabase
            .from('attendance')
            .select(`*, jobs(*)`)
            .eq('worker_id', get().user.id)
            .eq('status', 'present')
            .eq('id', job.job_id)
          if (error) {
            console.log(error)
            return toast.error(error.message)
          }
          const presence = attendance.length
          const { data } = await supabase
            .from('workers_jobs')
            .select(`*`)
            .eq('job_id', job.job_id)
          const { data: work } = await supabase
            .from('jobs')
            .select(`*, location_id(*)`)
            .eq('job_id', job.job_id)
          set({
            lastWork: {
              location: work[0].location_id,
              name: job.job_name,
              presence: presence,
              labours: data.length,
              deadline: deadline,
              duration: days,
              completion: percentage
            }
          })
          set({ loading: false })
        } catch (err) {
          console.log(err)
          toast.error(err.message)
        }
      })
      return get().lastWork
    } catch (err) {
      console.log(err)
      toast.error(err.message)
      return null
    }
  },
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
  }
}))
