import { create } from 'zustand'
import { supabase } from '..'
import { toast } from 'sonner'

export const useWorkerStore = create((set, get) => ({
  user: { email: '', type: '', id: '' },
  loading: false,
  jobs: [],
  payment: [],
  attendance: [],
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
      .select('*')
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
  }
}))
