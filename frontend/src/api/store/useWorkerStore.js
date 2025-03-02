import { create } from 'zustand'
import { supabase } from '..'
import { toast } from 'sonner'
import {
  timestampToDate,
  jobDuration,
  formatLocationShort,
  timeToString,
  formatLocationToGP
} from '../../utils/dataFormating'
import { genDates } from '../../utils/generate_date'
import { distance } from '../../utils/getLocation'
import { authStore } from './authStore'

export const useWorkerStore = create((set, get) => ({
  user: authStore.getState().user,
  loading: false,
  notifications: [],
  dataLoaded: false,
  loadingAttendance: false,
  isAttendanceActive: false,
  selectedAttendance: {},
  nearbyJobs: [],
  currentlyEnrolled: null,
  allJobs: [],
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
  totalPresent: 0,
  lastAttendance: {
    work_name: '',
    location: ''
  },
  profile: {},
  attndDates: [],
  currActiveDates: [],
  attndMonths: [],
  isFormatingPopup: true,
  setFormatingPopup: status => set({ isFormatingPopup: status }),
  setCurrentlyEnrolled: obj => set({ currentlyEnrolled: obj }),
  setAttendancePopup: isActive => {
    set({ isAttendanceActive: isActive })
  },
  selectAttendance: selected => set({ selectedAttendance: selected }),
  setDataLoaded: dataLoaded => set({ dataLoaded }),
  setLoading: loading => set({ loading }),

  setProfile: () => {
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
          body: JSON.stringify({ workerId: id })
        }
        const res = await fetch('/api/worker/profile', options)
        const { data, error } = await res.json()
        if (error) throw error
        set({ profile: data })
        resolve(data)
      } catch (error) {
        toast.error(error.message)
        reject(error)
      }
    })
  },
  setNearbyJobs: async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const locationId = get().profile.address.id
        await supabase
          .from('jobs')
          .select(`*, location_id(*)`)
          .eq('location_id', locationId)
          .then(async ({ data }) => {
            const sortedJobs = data.filter((job, index) => {
              const distanceBtwCords = distance(
                job.geotag,
                job.location_id.geotag,
                'K'
              ).toFixed(2)
              return distanceBtwCords <= 15
            })
            const result = await Promise.all(
              sortedJobs.map(get().getEnrollment)
            )
            set({ nearbyJobs: result })
            resolve(result)
          })
      } catch (error) {
        toast.error(error.message)
        reject(error)
      }
    })
  },
  setAllJobs: async () => {
    try {
      const { data } = await supabase.from('jobs').select(`*, location_id(*)`)
      const result = await Promise.all(data.map(get().getEnrollment))
      set({ allJobs: result })
      return result
    } catch (error) {
      console.log(error)
      toast.error(error.message)
      return error
    }
  },
  setPayment: async () => {
    try {
      const { data: payments } = await supabase
        .from('payments')
        .select(`*, payment_for(*)`)
        .eq('payment_to', get().profile.id)
        .order('created_at', { ascending: false })

      const updatedPayments = payments.map((payment, index) => ({
        ...payment,
        Transaction: payment.payment_title,
        Amount: `₹${payment.amount.toFixed(2)}`,
        Date: timestampToDate(payment.created_at),
        Status: payment.status
      }))
      set({ payment: updatedPayments })
      return payments
    } catch (error) {
      toast.error(error.message)
      return error
    }
  },
  setLastAttendance: async () => {
    try {
      const { data: attendances, error } = await supabase
        .from('job_enrollments')
        .select(`*, location_id(*), job(*)`)
        .eq('by_worker', get().profile.id)
        .eq('status', 'enrolled')
      if (error) throw error
      if (attendances.length > 0) {
        set({ totalPresent: attendances.length })
        const lastPresence = {
          work_name: attendances[0].job.job_name,
          location: formatLocationShort(attendances[0].location_id)
        }
        set({ lastAttendance: lastPresence })
        return attendances
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
      return error
    }
  },
  setAttendance: async locationSelected => {
    return new Promise(async (resolve, reject) => {
      try {
        set({ attendances: [] })
        set({ loadingAttendance: true })
        const jobs = get().allJobs
        const { data: locations } = await supabase
          .from('locations')
          .select('*')
          .eq('state', locationSelected.state)
          .eq('district', locationSelected.district)
          .eq('block', locationSelected.block)
          .eq('panchayat', locationSelected.panchayat)
        const filteredJobs = jobs.filter(
          job =>
            job.location_id.id === locations[0]?.id &&
            job.originalStatus === 'enrolled'
        )
        filteredJobs.forEach(async (job, index) => {
          const { data } = await supabase
            .from('attendance')
            .select(`*, attendance_for(*, location_id(*))`)
            .eq('worker_id', get().profile.id)
            .eq('attendance_for', job.job_id)
            .order('created_at', { ascending: false })
          const presence = data.filter(item => item.status === 'present')
          const dateStatus = data.map(item => {
            return { [item.status]: timeToString(item.created_at) }
          })
          const previous = get().attendances
          set({
            attendances: [
              ...previous,
              {
                id: index,
                dates: dateStatus,
                attendances: data,
                Work: job.job_name,
                Location: job.Location,
                start: job.created_at,
                end: job.job_deadline,
                Deadline: timestampToDate(job.job_deadline),
                Presence: `${presence.length}/${job.Duration}`
              }
            ]
          })
          set({ loadingAttendance: false })
          resolve(get().attendances)
        })
      } catch (err) {
        toast.error(err.message)
        set({ loadingAttendance: false })
        reject(err)
      }
    })
  },
  setAttndDates: selMonth => {
    return new Promise(async (resolve, reject) => {
      try {
        set({ isFormatingPopup: true })
        var dates = get().attndDates
        dates = dates.get(selMonth)
        set({ currActiveDates: dates, isFormatingPopup: false })
        resolve(dates)
      } catch (err) {
        reject(err)
      }
    })
  },
  setAttndPopupData: selectedAttnd => {
    return new Promise(async (resolve, reject) => {
      try {
        set({ isFormatingPopup: true })
        const { months, dates } = await genDates(selectedAttnd)
        set({
          attndMonths: months,
          attndDates: dates,
          isFormatingPopup: false
        })
        resolve(months)
      } catch (err) {
        set({ isFormatingPopup: false })
        reject(err)
      }
    })
  },
  setLastWork: async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const { id } = get().profile
        const options = {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'Application/json',
            Accept: 'Application/json'
          },
          body: JSON.stringify({ workerId: id })
        }
        const res = await fetch('/api/worker/working-on', options)
        const { data, error } = await res.json()
        if (error) throw error
        const { lastWork, enrollment } = data
        set({ lastWork: lastWork })
        var end = new Date(enrollment.starting_date)
        var now = new Date()
        now.setHours(0, 0, 0, 0)
        end.setDate(end.getDate() + enrollment.time_period)
        if (now > end) {
          set({
            currentlyEnrolled: null
          })
        } else {
          set({
            currentlyEnrolled: {
              start: timestampToDate(enrollment.starting_date),
              end: timestampToDate(end),
              jobName: enrollment.job.job_name
            }
          })
        }

        resolve(lastWork)
      } catch (error) {
        reject(error)
      }
    })
  },
  setLocations: async () => {
    try {
      const { data: jobs } = await supabase
        .from('job_enrollments')
        .select(`*, job(location_id(*))`)
        .eq('by_worker', get().profile.id)
      const result = jobs.map(item => item.job.location_id)
      set({ locations: result })
    } catch (error) {
      console.log(error)
      toast.error(error.message)
      return error
    }
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
      .from('job_enrollments')
      .select('*')
      .eq('job', item.job_id)
      .eq('by_worker', get().profile.id)
    if (error) {
      return error
    }
    const distanceBtwCords = distance(item.geotag, item.location_id.geotag, 'K')
    let status = ''
    var deadline = new Date(item.job_deadline)
    var now = new Date()
    deadline.setHours(0, 0, 0, 0)
    now.setHours(0, 0, 0, 0)
    if (deadline < now) status = 'completed'
    else if (!data.length > 0) status = 'unenrolled'
    else status = data[0].status
    return {
      ...item,
      Work: item.job_name,
      time_period: data[0]?.time_period,
      start: data[0]?.starting_date,
      Location: `${formatLocationToGP(item.location_id)}`,
      locationObj: {
        dist: distanceBtwCords.toFixed(2),
        gp: formatLocationToGP(item.location_id)
      },
      Status: status,
      originalStatus: data[0]?.status,
      Started: `${timestampToDate(item.created_at)}`,
      Deadline: `${timestampToDate(item.job_deadline)}`,
      Duration: `${jobDuration(item.created_at, item.job_deadline).days} Day`
    }
  },
  applyToJob: (
    jobId,
    sachivId,
    startDate,
    timeDuration,
    locationId,
    family_id
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = get().profile
        const detail = {
          starting_date: startDate,
          time_period: timeDuration,
          job: jobId,
          to_sachiv: sachivId,
          by_worker: user.id,
          location_id: locationId,
          family_id: family_id
        }

        const options = {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'Application/json',
            Accept: 'Application/json'
          },
          body: JSON.stringify(detail)
        }
        const res = await fetch('/api/worker/apply', options)
        const { data, error } = await res.json()
        if (error) throw error
        await get().setNearbyJobs()
        resolve(data)
      } catch (err) {
        reject(err)
      }
    })
  }
}))
