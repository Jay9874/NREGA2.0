import { createClient } from '../lib/supabase.js'
import { decode } from 'base64-arraybuffer'

const applyToJob = async (req, res) => {
  try {
    var { jobDetail } = req.body
    jobDetail = {
      ...jobDetail,
      application_id: `ap_${jobDetail.job}_${jobDetail.by_worker}`,
      status: 'submitted',
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

export { applyToJob }
