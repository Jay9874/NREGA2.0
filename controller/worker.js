import {
  formatLocationToGP,
  jobDuration,
  timestampToDate
} from '../frontend/src/utils/dataFormating.js'
import { distance } from '../frontend/src/utils/getLocation.js'
import { createClient } from '../lib/supabase.js'
import { logger } from '../utils/logger.js'

const setProfile = async (req, res) => {
  try {
    const { workerId } = req.body
    const supabase = createClient({ req, res })
    const { data: profile, error } = await supabase
      .from('worker')
      .select(`*, address(*)`)
      .eq('id', workerId)
    if (error) throw error
    return res.status(200).send({
      data: profile[0],
      error: null
    })
  } catch (err) {
    return res.status(500).send({
      data: null,
      error: err
    })
  }
}

const applyToJob = async (req, res) => {
  try {
    var detail = req.body
    var end = new Date(detail.starting_date)
    end.setDate(end.getDate() + detail.time_period)
    detail = {
      ...detail,
      application_id: `ap_${detail.job}_${detail.by_worker}`,
      status: 'applied',
      remark: 'The application is under processing.',
      end_date: end
    }

    // Check if working on any other job in given time period
    const { data: workingOn, error: errAtWorkingOn } = await supabase
      .from('job_enrollments')
      .select('job')
      .eq('by_worker', detail.by_worker)
      .gte('end_date', detail.starting_date)
    if (errAtWorkingOn)
      throw new Error('Could not get current working details.')
    if (workingOn.length > 0)
      throw new Error(
        'You are engaged during given time period, finish it first.'
      )

    const supabase = createClient({ req, res })
    const { data, error } = await supabase
      .from('job_enrollments')
      .upsert(detail)
      .select()
    if (error) throw error
    const { data: notification, error: errAtNotification } = await supabase
      .from('sachiv_notifications')
      .insert({
        user_id: detail.to_sachiv,
        category: 'job application',
        tagline: `Required job in job id: ${detail.job}`,
        family_id: detail.family_id,
        duration: detail.time_period,
        details: {
          Worker: detail.by_worker,
          Duration: `${detail.time_period} days`,
          Joining: detail.starting_date,
          Application_id: detail.application_id
        },
        application_id: detail.application_id
      })
      .select()
    if (errAtNotification) throw errAtNotification
    const { data: workerNotification, error: errAtWorkerNotification } =
      await supabase
        .from('worker_notifications')
        .insert({
          user_id: detail.by_worker,
          category: 'job application',
          tagline: `Applied for job in job id: ${detail.job}`,
          details: {
            Duration: `${detail.time_period} days`,
            Application_id: detail.application_id
          },
          application_id: detail.application_id
        })
        .select()
    if (errAtWorkerNotification) throw errAtWorkerNotification
    return res.status(200).json({
      data: data,
      error: null
    })
  } catch (err) {
    console.log('error: ', err)
    return res.status(500).json({
      data: null,
      error: err
    })
  }
}

const entitlement = async (req, res) => {
  try {
    const { familyId } = req.body
    const supabase = createClient({ req, res })
    const { data, error } = await supabase
      .from('households')
      .select('quota')
      .eq('family_id', familyId)
    if (error) throw error
    return res.status(200).send({
      data: { entitlement: data[0].quota },
      error: null
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      data: null,
      error: err
    })
  }
}

const getJobs = async (req, res) => {
  try {
    const { locationId, workerId } = req.body
    const supabase = createClient({ req, res })

    // getting all the jobs in gram panchayat location (ID)
    const { data: allJobs, error } = await supabase
      .from('jobs')
      .select(`*, location_id(*)`)
      .eq('location_id', locationId)
    if (error) throw new Error("Couldn't get all jobs.")

    // Get all the enrollment status w.r.t workerID and locationID (or panchayat)
    const { data: enrollments, error: errorAtEnroll } = await supabase
      .from('job_enrollments')
      .select('*')
      .eq('location_id', locationId)
      .eq('by_worker', workerId)
    if (errorAtEnroll) throw new Error('Could not get job enrollment status.')

    if (enrollments.length === 0)
      throw new Error('You are currently not working on any job.')

    // Making a map of jobID->jobObject for easy access of status
    let jobMap = new Map()
    enrollments.forEach(enrollment => {
      const { job } = enrollment
      jobMap.set(job, enrollment)
    })

    // Sorting and modifying jobs nearby 15 km radius of worker(ID) gram panchayat location(ID)
    const sortedJobs = []
    allJobs.forEach(job => {
      const distanceBtwCords = distance(
        job.geotag,
        job.location_id.geotag,
        'K'
      ).toFixed(2)
      if (distanceBtwCords <= 15) {
        // Merge sorted jobs with its respective enrollment status
        let status = ''
        let deadline = new Date(job.job_deadline)
        let now = new Date()
        deadline.setHours(0, 0, 0, 0)
        now.setHours(0, 0, 0, 0)
        if (deadline < now) status = 'completed'
        else if (!jobMap.has(job.job_id)) status = 'unenrolled'
        else status = jobMap.get(job.job_id).status

        sortedJobs.push({
          ...job,
          locationInfo: {
            dist: distanceBtwCords,
            gp: formatLocationToGP(job.location_id)
          },
          Status: status
        })
      }
    })

    return res.status(200).send({
      data: { allJobs: allJobs, nearbyJobs: sortedJobs },
      error: null
    })
  } catch (err) {
    logger.error(err)
    return res.status(500).send({
      data: null,
      error: err.message
    })
  }
}

// Set the the payments
const payments = async (req, res) => {
  try {
    const { userId } = req.body
    const supabase = createClient({ req, res })
    const { data: payments } = await supabase
      .from('payments')
      .select(`*, payment_for(*)`)
      .eq('payment_to', userId)
      .order('created_at', { ascending: false })
    const updatedPayments = payments.map((payment, index) => ({
      ...payment,
      Transaction: payment.payment_title,
      Amount: `₹${payment.amount.toFixed(2)}`,
      Date: timestampToDate(payment.created_at),
      Status: payment.status
    }))
    return res.status(200).send({
      data: updatedPayments,
      error: null
    })
  } catch (err) {
    console.error(err)
    return res.status(500).send({
      data: null,
      error: 'Something went wrong while getting payments.'
    })
  }
}

const workingOn = async (req, res) => {
  try {
    const { workerId } = req.body
    const supabase = createClient({ req, res })

    // Getting info about last worker with worker id
    const { data: enrollment, error } = await supabase
      .from('job_enrollments')
      .select(`*, job(*, location_id(*))`)
      .eq('by_worker', workerId)
      .eq('status', 'working on')
    if (error) throw error
    if (enrollment.length == 0) throw new Error('Not working on any job.')
    const job = enrollment[0]?.job
    const deadline = timestampToDate(job.job_deadline)
    const { days, percentage } = jobDuration(job.created_at, job.job_deadline)

    // Getting the attendance of last work for the worker
    const { data: attendance, error: errAtAttendance } = await supabase
      .from('attendance')
      .select('id')
      .eq('worker_id', workerId)
      .eq('status', 'present')
      .eq('attendance_for', job.job_id)
    if (errAtAttendance) throw errAtAttendance

    // Getting number of labours working on the job with the worker
    const { data: labours, error: errAtLabour } = await supabase
      .from('job_enrollments')
      .select('id')
      .eq('status', 'working on')
      .eq('job', job.job_id)
    if (errAtLabour) throw errAtLabour

    const lastWork = {
      location: job.location_id,
      name: job.job_name,
      presence: attendance.length,
      labours: labours.length,
      deadline: deadline,
      duration: days,
      completion: percentage,
      desc: job.job_description
    }
    return res.status(200).send({
      data: { lastWork, enrollment: enrollment[0] },
      error: null
    })
  } catch (err) {
    console.log(err)
    return res.status(500).send({
      data: null,
      error: err
    })
  }
}

const getAttendances = async (req, res) => {
  try {
    const { workerId } = req.body
    const supabase = createClient({ req, res })

    const { data: attendances, error } = await supabase
      .from('attendance')
      .select(`*, attendance_for(*, location_id(*))`)
      .eq('worker_id', workerId)
    if (error) {
      logger.error(error)
      throw new Error("Couldn't get all the attendances.")
    }
    return res.status(200).send({
      data: attendances,
      error: null
    })
  } catch (err) {
    logger.error(err)
    return res.status(500).send({
      data: null,
      error: err.message
    })
  }
}
// const getAttendances = async (req, res) => {
//   try {
//     // Return all the attendances for a given worker (with ID).
//     const { locationSelected } = req.body

//     const { data: locations } = await supabase
//       .from('locations')
//       .select('*')
//       .eq('state', locationSelected.state)
//       .eq('district', locationSelected.district)
//       .eq('block', locationSelected.block)
//       .eq('panchayat', locationSelected.panchayat)
//     const filteredJobs = jobs.filter(
//       job =>
//         job.location_id.id === locations[0]?.id &&
//         job.originalStatus === 'enrolled'
//     )
//     filteredJobs.forEach(async (job, index) => {
//       const { data } = await supabase
//         .from('attendance')
//         .select(`*, attendance_for(*, location_id(*))`)
//         .eq('worker_id', get().profile.id)
//         .eq('attendance_for', job.job_id)
//         .order('created_at', { ascending: false })
//       const presence = data.filter(item => item.status === 'present')
//       const dateStatus = data.map(item => {
//         return { [item.status]: timeToString(item.created_at) }
//       })
//       const previous = get().attendances
//       set({
//         attendances: [
//           ...previous,
//           {
//             id: index,
//             dates: dateStatus,
//             attendances: data,
//             Work: job.job_name,
//             Location: job.Location,
//             start: job.created_at,
//             end: job.job_deadline,
//             Deadline: timestampToDate(job.job_deadline),
//             Presence: `${presence.length}/${job.Duration}`
//           }
//         ]
//       })
//       set({ loadingAttendance: false })
//       resolve(get().attendances)
//     })
//   } catch (err) {
//     toast.error(err)
//     set({ loadingAttendance: false })
//     reject(err)
//   }
// }

export {
  applyToJob,
  entitlement,
  getJobs,
  workingOn,
  setProfile,
  payments,
  getAttendances
}
