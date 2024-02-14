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
  dataLoaded: false,
  profile: {},
  employees: [],
  lastAddedUser: {},
  setDataLoaded: loading => set({ dataLoaded: loading }),
  setProfile: async navigate => {
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
      return profile
    } catch (error) {
      toast.error(error.message)
      throw error
    }
  },
  addUser: async user => {
    try {
      const { data: newUser, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password
      })
      if (error) throw error
      set({ lastAddedUser: newUser.user })
      return newUser
    } catch (error) {
      throw error
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
  }
}))
