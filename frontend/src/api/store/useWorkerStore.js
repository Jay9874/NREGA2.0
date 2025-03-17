import { create } from 'zustand'
import { toast } from 'sonner'
import {
  timestampToDate,
  jobDuration,
  formatLocationShort
} from '../../utils/dataFormating'
import { genDates } from '../../utils/generate_date'
import { authStore } from './authStore'

export const useWorkerStore = create((set, get) => ({
  user: authStore.getState().user,
  loading: false,
  notifications: [],
  dataLoaded: false,
  loadingAttendance: true,
  isAttendanceActive: false,
  selectedAttendance: {},
  nearbyJobs: [],
  jobs: [],
  currentlyEnrolled: null,
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
  selectedAttendances: [],
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
        toast.error(error)
        reject(error)
      }
    })
  },
  setJobs: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const { address, id } = get().profile
        const options = {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'Application/json',
            Accept: 'Application/json'
          },
          body: JSON.stringify({ locationId: address.id, workerId: id })
        }
        const res = await fetch('/api/worker/jobs', options)
        const { data, error } = await res.json()
        if (error) throw error
        set({ nearbyJobs: data.nearbyJobs, jobs: data.allJobs })
        resolve(data)
      } catch (error) {
        toast.error(error)
        reject(error)
      }
    })
  },
  setPayment: async () => {
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
          body: JSON.stringify({ userId: id })
        }
        const res = await fetch('/api/worker/payments', options)
        const { data, error } = await res.json()
        if (error) throw error
        set({ payment: data })
        resolve(data)
      } catch (error) {
        toast.error(error)
        reject(error)
      }
    })
  },

  setAttendance: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const { id } = get().profile
        set({ loadingAttendance: true })
        const options = {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'Application/json',
            Accept: 'Application/json'
          },
          body: JSON.stringify({ workerId: id })
        }
        const res = await fetch('/api/worker/attendances', options)
        const { data, error } = await res.json()
        if (error) throw error

        // Setting all the locations
        let totalPresent = 0
        set({
          locations: data.map(attendance => {
            if (attendance.status === 'present') totalPresent += 1
            return attendance.attendance_for.location_id
          }),
          attendances: data,
          loadingAttendance: false
        })
        set({ totalPresent: totalPresent })
        const { location_id, job_name } = data[0].attendance_for
        const lastPresence = {
          work_name: job_name,
          location: formatLocationShort(location_id)
        }
        set({ lastAttendance: lastPresence })
        resolve(data)
      } catch (err) {
        toast.error(err)
        reject(err)
      }
    })
  },
  onAttendanceFilterChange: selectedLocation => {
    return new Promise(async (resolve, reject) => {
      try {
        set({ selectedAttendances: [], loadingAttendance: true })
        const { state, district, block, panchayat } = selectedLocation
        const allAttendances = get().attendances

        let attendancesAtLocation = []
        // Map the presence count with job id.
        let presenceMap = new Map()
        // for unique jobs only
        let uniqueJob = new Map()
        // Map everyday status to job id.
        let everydayStatus = new Map()

        if (!selectedLocation.state) throw new Error('State filter is empty.')

        // extracting attendances at currently selected location (with filter)
        allAttendances.forEach((attendance, index) => {
          const { location_id, job_id } = attendance.attendance_for
          if (
            state === location_id.state &&
            district === location_id.district &&
            block === location_id.block &&
            panchayat === location_id.panchayat
          ) {
            // keeping only the unique jobs
            if (!uniqueJob.has(job_id)) {
              uniqueJob.set(job_id, 1)
              attendancesAtLocation.push(attendance)
            }

            // Increase the present count w.r.t job id.
            const { attendance_for: job } = attendance
            presenceMap.set(job.job_id, 0)
            if (attendance.status === 'present') {
              const count = presenceMap.get(job.job_id)
              presenceMap.set(job.job_id, count ? count + 1 : 1)
            }
            // Store the everyday status
            const hasDateArray = everydayStatus.has(job.job_id)
            if (hasDateArray) {
              let dateArr = everydayStatus.get(job.job_id)
              everydayStatus.set(job_id, [
                ...dateArr,
                {
                  status: attendance.status,
                  created_at: attendance.created_at
                }
              ])
            } else {
              everydayStatus.set(job.job_id, [
                {
                  status: attendance.status,
                  created_at: attendance.created_at
                }
              ])
            }
          }
        })

        attendancesAtLocation.forEach((attendance, index) => {
          const { attendance_for: job } = attendance
          const presence = presenceMap.get(job.job_id)
          const dateStatus = everydayStatus.get(job.job_id)
          const previous = get().selectedAttendances
          set({
            selectedAttendances: [
              ...previous,
              {
                id: index,
                dates: dateStatus,
                attendances: attendance,
                Work: job.job_name,
                Location: formatLocationShort(job.location_id),
                start: job.job_start_date,
                Started: timestampToDate(job.job_start_date),
                end: job.job_deadline,
                Deadline: timestampToDate(job.job_deadline),
                Presence: `${presence}/${
                  jobDuration(job.job_start_date, job.job_deadline).days
                } days`
              }
            ]
          })
          set({ loadingAttendance: false })
          resolve(get().selectedAttendances)
        })
      } catch (err) {
        console.log(err)
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
        await get().setJobs()
        resolve(data)
      } catch (err) {
        reject(err)
      }
    })
  }
}))
