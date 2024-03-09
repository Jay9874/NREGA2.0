import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
// import { createClient } from '../lib/supabase.js'
import { decode } from 'base64-arraybuffer'

const createUser = async (req, res) => {
  try {
    // const supabase = createClient({ req, res })
    const { email, password } = req.body
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
    })
    if (error) throw error
    return res.status(201).send({
      data: newUser.user,
      error: null,
    })
  } catch (err) {
    console.log(err)
    return res.status(409).send({
      data: null,
      error: err.message,
    })
  }
}
const createEmployee = async (req, res) => {
  try {
    console.log(req.body)
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
      user_type: 'worker',
    }
    const filename = `${id}`
    const fileType = base64String.match(/^data:(.+);base64/)?.[1]
    const { data: createdProfile, error: errAtPr } = await supabase
      .from('profiles')
      .insert([newProfile])
      .select()
    if (errAtPr) throw errAtPr
    const { data, error: errAtFile } = await supabase.storage
      .from('worker_profile')
      .upload(`avatars/${filename}`, decode(base64), {
        contentType: fileType,
        cacheControl: '3600',
        upsert: true,
      })
    if (errAtFile) throw errAtFile
    const { data: url, error: errAtUrl } = supabase.storage
      .from('worker_profile')
      .getPublicUrl(`avatars/${filename}`)
    if (errAtUrl) throw errAtUrl
    newEmplyee = { ...newEmplyee, photo: url.publicUrl }
    delete newEmplyee.queryImage
    const { data: createdEmp, error: errAtEmp } = await supabase
      .from('worker')
      .insert([newEmplyee])
      .select()
    if (errAtEmp) throw errAtEmp
    return res.status(201).send({
      data: { profile: createdProfile, employee: createdEmp },
      error: null,
    })
  } catch (err) {
    console.log(err)
    return res.status(500).send({
      data: null,
      error: err,
    })
  }
}
const fetchAadhaar = async (req, res) => {
  try {
    const { aadhaar: aadhaarNo } = req.body
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
    return res.status(201).send({
      data: aadhaar[0],
      error: null,
    })
  } catch (err) {
    return res.status(403).send({ data: null, error: err.message })
  }
}

export { createUser, fetchAadhaar, createEmployee }
