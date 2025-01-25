import {
  formatLocationToGP,
  jobDuration,
  timestampToDate
} from '../frontend/src/utils/dataFormating.js'
import { createClient } from '../lib/supabase.js'

const applyToJob = async (req, res) => {
  try {
    var { jobDetail } = req.body
    jobDetail = {
      ...jobDetail,
      application_id: `ap_${jobDetail.job}_${jobDetail.by_worker}`,
      status: 'applied',
      remark: 'The application is under processing.'
    }
    console.log(jobDetail)
    const supabase = createClient({ req, res })
    const { data, error } = await supabase
      .from('job_applications')
      .upsert(jobDetail)
      .select()
    if (error) throw error
    console.log(data)
    return res.status(200).json({
      data: data,
      error: null
    })
  } catch (err) {
    console.log('error: ', err)
    return res.status(501).json({
      data: null,
      error: err
    })
  }
}

const entitlement = async (req, res) => {
  try {
    const { workerId } = req.body
    const supabase = createClient({ req, res })
    const { data, error } = await supabase
      .from('households')
      .select('quota')
      .eq('member_id', workerId)
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

export { applyToJob, entitlement, nearbyJobs }
