import { create } from 'zustand'
import supabase from '..'
import { toast } from 'sonner'

export const useWorkerStore = create((set, get) => ({
  user: { email: '', type: '', id: '' },
  loading: false,
  jobs: [],
  payment: [],
  attendance: [],
  profile: {},
  setProfile: async () => {
    console.log('hello')
    let token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN)
    token = token ? JSON.parse(token) : {}
    set({
      user: { email: token.user.email, type: token.userType, id: token.user.id }
    })
    set({ loading: true })
    const { data, error } = await supabase
      .from('worker')
      .select('*')
      .eq('id', get().user.id)
    if (error) {
      console.log(error)
      return toast.error(error.message)
    }
    console.log(data)
    set({ profile: data })
    console.log(get().profile)
    set({ loading: false })
  },
  setJobs: async () => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('is_active', true)
    if (error) return toast.error(error.message)
    set({ jobs: data })
    set({ loading: false })
  }
}))
