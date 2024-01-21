import { create } from 'zustand'
import { supabase } from '..'
import { toast } from 'sonner'
import { timestampToDate } from '../../utils/convertTimestamp'

export const useWorkerStore = create((set, get) => ({
  user: { email: '', type: '', id: '' },
  loading: false,
  jobs: [],
  payment: [],
  attendances: [],
  profile: {},
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
    const { data, error } = await supabase.from('jobs').select('*')
    if (error) return toast.error(error.message)
    set({ jobs: data })
    set({ loading: false })
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
    })
    set({ loading: false })
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
