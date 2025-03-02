import {
  formatLocationToGP,
  jobDuration,
  timestampToDate
} from '../frontend/src/utils/dataFormating.js'
import { createClient } from '../lib/supabase.js'

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
    console.log(detail)
    var end = new Date(detail.starting_date)
    end.setDate(end.getDate() + detail.time_period)
    detail = {
      ...detail,
      application_id: `ap_${detail.job}_${detail.by_worker}`,
      status: 'applied',
      remark: 'The application is under processing.',
      end_date: end
    }
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

const nearbyJobs = async (req, res) => {
  try {
    const { locationId, workerId } = req.body
    const supabase = createClient({ req, res })
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
        const result = await Promise.all(sortedJobs.map(get().getEnrollment))
        const { data: enrollment, error: errAtEnrol } = await supabase
          .from('workers_jobs')
          .select(`*`)
          .eq('job_id', item.job_id)
          .eq('worker_id', workerId)
        if (error) {
          return error
        }
        const hasEnrolled = data.length > 0 ? true : false
        const [lat1, lon1] = item.geotag
        const [lat2, lon2] = item.location_id.geotag
        const distanceBtwCords = distance(lat1, lon1, lat2, lon2, 'K')
        const response = {
          ...item,
          Work: item.job_name,
          Location: `${formatLocationToGP(item.location_id)}`,
          locationObj: {
            dist: distanceBtwCords.toFixed(2),
            gp: formatLocationToGP(item.location_id)
          },
          Status: hasEnrolled ? 'enrolled' : 'unenrolled',
          Started: `${timestampToDate(item.created_at)}`,
          Deadline: `${timestampToDate(item.job_deadline)}`,
          Duration: `${
            jobDuration(item.created_at, item.job_deadline).days
          } Day`
        }
      })
  } catch (err) {
    console.log(err)
    return res.status(500).send({
      data: null,
      error: err
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
      .eq('status', 'enrolled')
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
      .eq('status', 'enrolled')
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

export { applyToJob, entitlement, nearbyJobs, workingOn, setProfile }
