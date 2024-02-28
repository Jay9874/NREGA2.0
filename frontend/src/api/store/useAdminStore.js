import { create } from 'zustand'
import { supabase } from '..'
import { calculateAge } from '../../utils/dataFormating'
import { toast } from 'sonner'
const NODE_ENV = import.meta.env.MODE

export const useAdminStore = create((set, get) => ({
  user: { email: '', type: '', id: '' },
  dataLoaded: false,
  base: NODE_ENV === 'development' ? 'http://localhost:8080' : '',
  profile: null,
  employees: null,
  lastAddedUser: null,
  lastAadhaarData: null,
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
    //This data will be sent to the server with the POST request.
    const userData = {
      email: user.email,
      password: user.password,
      userType: 'worker'
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: { 'Content-Type': 'application/json' }
    }
    const url = `${get().base}/api/admin/create`
    try {
      const toastID = toast.loading('Adding User...')
      const res = await fetch(url, options)
      const { data, error } = await res.json()
      toast.dismiss(toastID)
      if (error) {
        throw error
      }
      console.log('user found: ', data)
      localStorage.setItem('lastAddedUser', JSON.stringify(data))
      set({ lastAddedUser: data })
    } catch (err) {
      throw err
    }
  },
  setAadhaarData: async aadhaarNo => {
    const userData = {
      aadhaar: aadhaarNo
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: { 'Content-Type': 'application/json' }
    }
    const url = `${get().base}/api/admin/aadhaar`
    try {
      const toastID = toast.loading('Getting Aadhaar Data...')
      const res = await fetch(url, options)
      const { data, error } = await res.json()
      toast.dismiss(toastID)
      if (error) {
        throw error
      }
      const updatedData = { ...data, age: calculateAge(data.dob) }
      localStorage.setItem('lastAadhaarData', JSON.stringify(updatedData))
      set({ lastAadhaarData: updatedData })
    } catch (err) {
      throw err
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
