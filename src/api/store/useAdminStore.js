import { create } from 'zustand'
import { supabase } from '..'
import { toast } from 'sonner'
import {
  timestampToDate,
  jobDuration,
  formatLocation,
  formatLocationShort
} from '../../utils/dataFormating'

export const useWorkerStore = create((set, get) => ({
  loading: false,
  employees: [],
  setLoading: loading => set({ loading }),
  setEmployees: async () => {
    try {
      const { data, error } = await supabase.from('employees').select('*')
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
