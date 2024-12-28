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

export { applyToJob, entitlement }
