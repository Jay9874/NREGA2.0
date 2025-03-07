import { createClient } from '../lib/supabase.js'
import { decode } from 'base64-arraybuffer'

const setProfile = async (req, res) => {
  try {
    const { sachivId } = req.body
    const supabase = createClient({ req, res })
    const { data: profile, error } = await supabase
      .from('sachiv')
      .select(`*, location_id(*)`)
      .eq('id', sachivId)
    if (error) throw error
    return res.status(200).send({
      data: profile[0],
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

const createUser = async (req, res) => {
  try {
    const supabase = createClient({ req, res })
    const { email, password, redirectUrl } = req.body
    const { data: user, error: err } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
    if (err) throw err
    if (user.length !== 0)
      throw new Error('A user with this email already exists.')
    const { data: newUser, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: redirectUrl
      }
    })
    if (error) throw error
    return res.status(201).send({
      data: newUser.user,
      error: null
    })
  } catch (err) {
    console.log(err)
    return res.status(409).send({
      data: null,
      error: err.message
    })
  }
}

const fetchEmployees = async (req, res) => {
  try {
    const { locationId } = req.body
    const supabase = createClient({ req, res })
    const { data: employees, error } = await supabase
      .from('worker')
      .select('*, address(*)')
      .eq('address', locationId)
    if (error) throw error
    return res.status(200).send({
      data: employees,
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
const createEmployee = async (req, res) => {
  try {
    const supabase = createClient({ req, res })
    const base64String = req.body.queryImage
    const base64 = base64String.split('base64,')[1]
    const user = req.body
    let newEmplyee = user
    let { first_name, last_name, email, id } = user
    let newProfile = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      id: id,
      mobile_no: user.mobile_no,
      user_type: 'worker'
    }
    const filename = `${id}`
    const fileType = base64String.match(/^data:(.+);base64/)?.[1]
    const { data, error: errAtFile } = await supabase.storage
      .from('worker_profile')
      .upload(`avatars/${filename}`, decode(base64), {
        contentType: fileType,
        cacheControl: '3600',
        upsert: true
      })
    if (errAtFile) throw errAtFile
    const { data: url, error: errAtUrl } = await supabase.storage
      .from('worker_profile')
      .getPublicUrl(`avatars/${filename}`)
    if (errAtUrl) throw errAtUrl
    newProfile['avatar'] = url.publicUrl
    const { data: createdProfile, error: errAtPr } = await supabase
      .from('profiles')
      .insert([newProfile])
      .select()
    if (errAtPr) throw errAtPr
    // Adding worker to a family with family id given
    const { data: family, error: errAtFamily } = await supabase
      .from('households')
      .insert('members', [`${user.family_id}`])
      .eq('family_id', user.family_id)
    if (errAtFamily) throw errAtFamily

    newEmplyee = { ...newEmplyee, photo: url.publicUrl }
    delete newEmplyee.queryImage
    const { data: createdEmp, error: errAtEmp } = await supabase
      .from('worker')
      .insert([newEmplyee])
      .select()
    if (errAtEmp) throw errAtEmp
    return res.status(201).send({
      data: { profile: createdProfile[0], employee: createdEmp[0] },
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

// API method to update worker details
const updateWorker = async (req, res) => {
  try {
    const supabase = createClient({ req, res })
    const updatedDetails = req.body

    // Change the image only if updated image field is there received data.
    if ('updatedImage' in updatedDetails) {
      const { updatedImage } = updatedDetails
      const base64String = updatedImage
      const base64 = base64String.split('base64,')[1]
      const filename = `${updatedDetails.id}`
      const fileType = base64String.match(/^data:(.+);base64/)?.[1]

      const { data, error: errAtFile } = await supabase.storage
        .from('worker_profile')
        .upload(`avatars/${filename}`, decode(base64), {
          contentType: fileType,
          cacheControl: '3600',
          upsert: true
        })
      if (errAtFile) throw errAtFile
      // Delete the image field from the update details.
      delete updatedDetails.updatedImage
    }
    const { data: newProfile, error: errAtUpdate } = await supabase
      .from('worker')
      .update(updatedDetails)
      .eq('id', updatedDetails.id)
      .select()
    if (errAtUpdate) throw errAtUpdate
    return res.status(200).send({
      data: newProfile,
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

const fetchAadhaar = async (req, res) => {
  try {
    const { aadhaar: aadhaarNo } = req.body
    const supabase = createClient({ req, res })
    const { data: aadhaar, error } = await supabase
      .from('aadhaar_db')
      .select(`*`)
      .eq('aadhaar_no', aadhaarNo)
    if (error) throw error
    if (aadhaar.length === 0) {
      throw new Error('No data found for Aadhaar Number.')
    } else {
      const { data: workerExist, error } = await supabase
        .from('worker')
        .select('aadhar_no')
        .eq('aadhar_no', aadhaarNo)
      if (error) throw error
      if (workerExist.length !== 0)
        throw new Error('Worker already exists with this Aadhaar.')
    }
    const aNum = aadhaar[0].aadhaar_no
    delete aadhaar[0].aadhaar_no
    return res.status(201).send({
      data: { ...aadhaar[0], aadhar_no: aNum },
      error: null
    })
  } catch (err) {
    return res.status(403).send({ data: null, error: err.message })
  }
}

// Sending all the dashboard data to client
const dashboardData = async (req, res) => {
  try {
    // We need worker count, total jobs, and duration of all jobs in dashboard.
    const { adminId, locationId } = req.body
    const supabase = createClient({ req, res })
    const { data: workerData, error: errAtWorker } = await supabase
      .from('worker')
      .select(`*`)
      .eq('address', locationId)
    if (errAtWorker) throw errAtWorker
    const { data: jobsData, error: errAtJobs } = await supabase
      .from('jobs')
      .select('*')
      .eq('location_id', locationId)
    if (errAtJobs) throw errAtJobs

    // Worker counts for each jobs
    const { data: enrollmentData, error: errAtEnrollment } = await supabase
      .from('job_enrollments')
      .select('*, by_worker(*), job(*)')
      .eq('status', 'enrolled')
    if (errAtEnrollment) throw errAtEnrollment
    const { data: paymentData, error: errAtPayment } = await supabase
      .from('payments')
      .select('*, payment_to(*)')
      .eq('GPO_id', adminId)
    if (errAtPayment) throw errAtPayment
    return res.status(201).send({
      data: {
        worker: workerData,
        jobs: jobsData,
        payments: paymentData,
        enrollments: enrollmentData
      },
      error: null
    })
  } catch (err) {
    console.log(err)
    return res.status(501).send({ data: null, error: err })
  }
}

const addAttendance = async (req, res) => {
  try {
    const { job_id, workers, images } = req.body
    const supabase = createClient({ req, res })

    const base64String1 = images.workers
    const base64String2 = images.progress
    const base64Worker = base64String1.split('base64,')[1]
    const base64Progress = base64String2.split('base64,')[1]
    const workerFile = `${Date.now()}`
    const progressFile = `${Date.now()}`
    const fileType = base64String1.match(/^data:(.+);base64/)?.[1]

    // Storing the progress photo for ML process
    const { data: publicUrl, error: errAtFile } = await supabase.storage
      .from('job_progress')
      .upload(`${job_id}/progress/${progressFile}`, decode(base64Progress), {
        contentType: fileType,
        cacheControl: '3600',
        upsert: true
      })
    if (errAtFile) throw errAtFile
    // Storing the workers group photo for today
    const { data: ulr, error: errAtupload } = await supabase.storage
      .from('job_progress')
      .upload(`${job_id}/workers/${workerFile}`, decode(base64Worker), {
        contentType: fileType,
        cacheControl: '3600',
        upsert: true
      })
    if (errAtupload) throw errAtupload

    // Saving the attendance
    const workersArr = Object.keys(workers).map((id, index) => ({
      worker_id: id,
      attendance_for: job_id,
      status: workers[id].attendance,
      attendance_uid: workers[id].attendance_uid
    }))
    // input multiple rows in the database
    const { data, error } = await supabase
      .from('attendance')
      .upsert(workersArr)
      .select()
    if (error) throw error
    return res.status(200).send({
      data: data,
      error: null
    })
  } catch (err) {
    console.log(err)
    return res.status(500).send({ data: null, error: err })
  }
}

const payout = async (req, res) => {
  try {
    const { adminId, locationId } = req.body
    const supabase = createClient({ req, res })
    const { data, error } = await supabase
      .from('payments')
      .select('*, payment_to(*)')
      .eq('GPO_id', adminId)
    if (error) throw error
    const { data: gpoDetail, error: errAtGpo } = await supabase
      .from('panchayats')
      .select('*')
      .eq('location', locationId)
    if (errAtGpo) throw errAtGpo
    return res.status(200).send({
      data: { gpo: gpoDetail, payments: data },
      error: null
    })
  } catch (err) {
    console.log('error is: ', err)
    return res.status(501).send({
      data: null,
      error: err
    })
  }
}

const jobEnrollment = async (req, res) => {
  try {
    const { jobId, sachivId, startDate, jobDays } = req.body
    const supabase = createClient({ req, res })
    const { data, error } = await supabase.from('job_application').insert()
  } catch (err) {
    console.log(err)
    return res.status(err.status).json({
      data: null,
      error: err
    })
  }
}

const enrollWorker = async (req, res) => {
  try {
    const { applicationId, notification } = req.body
    const supabase = createClient({ req, res })
    const { data, error } = await supabase
      .from('job_enrollments')
      .update({ status: 'enrolled', remark: 'Enrolled successfully.' })
      .eq('application_id', applicationId)
      .select()
    if (error) throw error

    // Reducing the family quota from 100 days guaranteed job
    const { family_id: fam_id, duration } = notification
    let { data: quota, error: errAtQuota } = await supabase.rpc(
      'reduce_quota',
      {
        duration,
        fam_id
      }
    )
    if (errAtQuota) throw errAtQuota
    console.log(quota)

    // Delete the last notification about this application from admin panel.
    const { data: deletionData, error: errAtDeletion } = await supabase
      .from('sachiv_notifications')
      .delete()
      .eq('application_id', applicationId)
      .select()
    if (errAtDeletion) throw errAtDeletion

    // add a new acceptation notification to worker panel.
    const { data: acceptedNotification, error: errAtAccept } = await supabase
      .from('worker_notifications')
      .insert({
        user_id: notification.details.Worker,
        category: 'job application',
        tagline: `Accepted job application for job id: ${data[0].job}`,
        details: {
          Application_id: applicationId,
          Remark: 'Successfully enrolled.'
        },
        application_id: applicationId
      })
      .select()
    if (errAtAccept) throw errAtAccept
    return res.status(200).send({
      data: data,
      error: null
    })
  } catch (err) {
    console.log(err)
    return res.status(501).send({
      data: null,
      error: err
    })
  }
}

const rejectApplication = async (req, res) => {
  try {
    const { notification, remark } = req.body
    const supabase = createClient({ req, res })
    const { Application_id } = notification.details
    const [JobId] = notification.tagline.match(/(\d+)/)

    const { data, error } = await supabase
      .from('job_enrollments')
      .update({ status: 'rejected', remark: remark })
      .eq('application_id', notification.application_id)
      .select()
    if (error) throw error

    // update the last notification about this application for worker
    const { data: notificationUpdate, error: errAtUpdate } = await supabase
      .from('worker_notifications')
      .insert({
        user_id: notification.details.Worker,
        category: 'job application',
        tagline: `Rejected job application for job id: ${JobId}`,
        details: {
          Application_id: Application_id,
          Remark: remark
        },
        application_id: Application_id
      })
      .select()
    if (errAtUpdate) throw errAtUpdate
    return res.status(200).send({
      data: data,
      error: null
    })
  } catch (err) {
    console.log(err)
    return res.status(501).send({
      data: null,
      error: err
    })
  }
}

const addJob = async (req, res) => {
  try {
    const jobDetails = req.body
    const photo = jobDetails.photo
    delete jobDetails.photo
    const supabase = createClient({ req, res })
    const { data, error } = await supabase
      .from('jobs')
      .insert(jobDetails)
      .select()
    if (error) throw error
    // Upload the initial photo to job progress bucket for ML process
    const base64String = photo
    const base64 = base64String.split('base64,')[1]
    const filename = `${Date.now()}`
    const fileType = base64String.match(/^data:(.+);base64/)?.[1]

    const { data: publicUrl, error: errAtFile } = await supabase.storage
      .from('job_progress')
      .upload(`${data[0].job_id}/progress/${filename}`, decode(base64), {
        contentType: fileType,
        cacheControl: '3600',
        upsert: true
      })
    if (errAtFile) throw errAtFile
    return res.status(200).send({
      data: data,
      error: null
    })
  } catch (err) {
    console.error(err)
    return res.status(500).send({
      data: null,
      error: err
    })
  }
}

const fetchRandomAadhaar = async (req, res) => {
  try {
    const supabase = createClient({ req, res })
    const { data, error } = await supabase.rpc('get_unreferenced_aadhaar')
    if (error) throw error
    const randInt = Math.floor(Math.random() * (data.length - 1 - 0 + 1) + 0)
    return res.status(200).send({
      data: data[randInt],
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
const fetchRandomFamily = async (req, res) => {
  try {
    const supabase = createClient({ req, res })
    const { data, error } = await supabase
      .from('households')
      .select('*')
      .is('members', null)
    if (error) throw error
    const randInt = Math.floor(Math.random() * (data.length - 1 - 0 + 1) + 0)
    return res.status(200).send({
      data: data[randInt],
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

const checkNregaIDAvailability = async (req, res) => {
  try {
    const { id } = req.body
    const supabase = createClient({ req, res })
    const { data, error } = await supabase
      .from('worker')
      .select('mgnrega_id')
      .eq('mgnrega_id', id)
    if (error) throw error
    if (data.length > 0) throw new Error('Worker exists with this MGNREGA ID.')
    return res.status(200).send({
      data: `${id} is available.`,
      error: null
    })
  } catch (err) {
    console.log(err)
    return res.status(500).send({
      data: null,
      error: err.message
    })
  }
}

const resendLink = async (req, res) => {
  try {
    const { workerEmail, redirectUrl } = req.body
    const supabase = createClient({ req, res })
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: workerEmail,
      options: {
        emailRedirectTo: redirectUrl
      }
    })
    if (error) throw error
    return res.status(200).send({
      data: 'Successfully sent email',
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

const setPayout = async (req, res) => {
  try {
    const { id } = req.body
    const supabase = createClient({ req, res })
    // Getting the payment data
    const { data, error } = await supabase
      .from('payments')
      .select('status')
      .eq('GPO_id', id)
      .or(status.eq.failed, status.eq.processing)
    if (error) throw error
    console.log('data: ', data)

    // Getting pending applications
    const { data: pendingApp, error: errAtApp } = await supabase
      .from('job_enrollments')
      .select('*')
      .eq('status', 'applied')
      .eq('to_sachiv', id)
    if (errAtApp) throw errAtApp
    console.log(pendingApp)
    return res.status(200).send({
      data: { pending: pendingApp, payments: data },
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
export {
  setProfile,
  createUser,
  resendLink,
  fetchAadhaar,
  fetchEmployees,
  createEmployee,
  updateWorker,
  dashboardData,
  addAttendance,
  payout,
  jobEnrollment,
  enrollWorker,
  rejectApplication,
  addJob,
  fetchRandomAadhaar,
  fetchRandomFamily,
  checkNregaIDAvailability,
  setPayout
}
