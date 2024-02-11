import { create } from 'zustand'
import { supabase } from '..'
import { toast } from 'sonner'
import {
  timestampToDate,
  jobDuration,
  formatLocation,
  formatLocationShort
} from '../../utils/dataFormating'
import { authStore } from '.'

export const useAdminStore = create((set, get) => ({
  user: { email: '', type: '', id: '' },
  loading: authStore.getState().loading,
  profile: {},
  employees: [],
  setLoading: loading => set({ loading }),
  setProfile: async navigate => {
    // console.log(get().loading)
    try {
      let token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN)
      if (!token) throw new Error('No session found!')
      token = JSON.parse(token)
      set({
        user: {
          email: token.user.email,
          type: token.userType,
          id: token.user.id
        }
      })
      const { data: profile, error } = await supabase
        .from('sachiv')
        .select(`*, location_id(*)`)
        .eq('id', get().user.id)
      if (error) {
        throw error
      }

      set({ profile: profile[0] })
      console.log(get().profile)
      return profile
    } catch (error) {
      toast.error(error.message)
      throw error
    }
  },
  setEmployees: async () => {
    try {
      const { data, error } = await supabase
        .from('worker')
        .select('*')
        .eq('location_id', get().profile.location_id)
      if (error) {
        throw error
      }
      set({ employees: data })
    } catch (error) {
      toast.error(error.message)
      throw error
    }
  }
}))
