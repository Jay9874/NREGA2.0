import { create } from 'zustand'
import { supabase } from '..'
import { toast } from 'sonner'
const NODE_ENV = import.meta.env.MODE
import {
  timestampToDate,
  jobDuration,
  formatLocation,
  formatLocationShort,
  timeToString,
  formatLocationToGP
} from '../../utils/dataFormating'
import { genDates } from '../../utils/generate_date'
import { distance } from '../../utils/getLocation'
import { socket } from '../socket'

export const useWorkerStore = create((set, get) => ({
  user: { email: '', type: '', id: '', photo: '' },
  base: NODE_ENV === 'development' ? 'http://localhost:8080' : '',
  loading: false,
  notifications: [],
  dataLoaded: false,
  loadingAttendance: false,
  isAttendanceActive: false,
  selectedAttendance: {},
  nearbyJobs: [],
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
  setAttendancePopup: isActive => {
    set({ isAttendanceActive: isActive })
  },
  selectAttendance: selected => set({ selectedAttendance: selected }),
  setDataLoaded: dataLoaded => set({ dataLoaded }),
  setLoading: loading => set({ loading }),
  setProfile: async navigate => {
    try {
      let token = localStorage.getItem('suid')
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
        .from('worker')
        .select(`*, address(*)`)
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
              const [lat1, lon1] = job.geotag
              const [lat2, lon2] = job.location_id.geotag
              const distanceBtwCords = distance(
                lat1,
                lon1,
                lat2,
                lon2,
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
        .eq('payment_to', get().user.id)
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
      const { data: attendances } = await supabase
        .from('attendance')
        .select(`*, attendance_for(*, location_id(*))`)
        .eq('worker_id', get().user.id)
        .eq('status', 'present')
        .order('created_at', { ascending: false })
      set({ totalPresent: attendances.length })
      const lastPresence = {
        work_name: attendances[0].attendance_for.job_name,
        location: formatLocationShort(attendances[0].attendance_for.location_id)
      }
      set({ lastAttendance: lastPresence })
      return attendances
    } catch (error) {
      console.log(error)
      toast.error(error.message)
      return error
    }
  },
  setAttendance: async locationSelected => {
    try {
      set({ attendances: [] })
      set({ loadingAttendance: true })
      return new Promise(async (resolve, reject) => {
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
            job.location_id.id === locations[0]?.id && job.Status === 'enrolled'
        )
        filteredJobs.forEach(async (job, index) => {
          const { data } = await supabase
            .from('attendance')
            .select(`*, attendance_for(*, location_id(*))`)
            .eq('worker_id', get().user.id)
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
      })
    } catch (err) {
      toast.error(err.message)
      set({ loadingAttendance: false })
      reject(err)
    }
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
    try {
      const { data: attendance } = await supabase
        .from('attendance')
        .select(`*, jobs(*)`)
        .eq('worker_id', get().user.id)
        .eq('status', 'present')
        .order('created_at', { ascending: false })
        .limit(1)
      const job = attendance[0].jobs
      const deadline = timestampToDate(job.job_deadline)
      const { days, percentage } = jobDuration(job.created_at, job.job_deadline)
      const presence = attendance.length
      const { data } = await supabase
        .from('job_enrollments')
        .select(`job`)
        .eq('job', job.job_id)
        .eq('status', 'enrolled')
      set({
        lastWork: {
          location: job?.location_id,
          name: job?.job_name,
          presence: presence,
          labours: data.length,
          deadline: deadline,
          duration: days,
          completion: percentage,
          desc: job?.job_description
        }
      })
    } catch (error) {
      console.log(error)
      toast.error(error.message)
      return error
    }
  },
  setLocations: async () => {
    try {
      const { data: jobs } = await supabase
        .from('job_enrollments')
        .select(`*, job(location_id(*))`)
        .eq('by_worker', get().user.id)
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
      .select(`*`)
      .eq('job', item.job_id)
      .eq('by_worker', get().user.id)
    if (error) {
      return error
    }
    const hasInput = data.length == 0 ? false : true
    const [lat1, lon1] = item.geotag
    const [lat2, lon2] = item.location_id.geotag
    const distanceBtwCords = distance(lat1, lon1, lat2, lon2, 'K')
    return {
      ...item,
      Work: item.job_name,
      Location: `${formatLocationToGP(item.location_id)}`,
      locationObj: {
        dist: distanceBtwCords.toFixed(2),
        gp: formatLocationToGP(item.location_id)
      },
      Status: hasInput ? data[0].status : 'unenrolled',
      Started: `${timestampToDate(item.created_at)}`,
      Deadline: `${timestampToDate(item.job_deadline)}`,
      Duration: `${jobDuration(item.created_at, item.job_deadline).days} Day`
    }
  },
  applyToJob: (jobId, sachivId, startDate, timeDuration, locationId) => {
    return new Promise(async (resolve, reject) => {
      try {
        socket.addEventListener('error', event => {
          console.log('websocket error: ', event)
          throw event
        })
        const user = get().user
        const detail = {
          starting_date: startDate,
          time_period: timeDuration,
          job: jobId,
          to_sachiv: sachivId,
          by_worker: user.id,
          location_id: locationId
        }
        socket.emit('sendApplication', detail)
        socket.on('receiveNotification', async notification => {
          await get().setNearbyJobs()
          console.log('received notification: ', notification)
          resolve(notification)
        })
      } catch (err) {
        reject(err)
      }
    })
  },
  loadNotifications: async () => {}
}))
