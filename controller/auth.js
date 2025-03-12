import { createClient } from '../lib/supabase.js'
// import log from '../utils/logger.js'
// const logger = log(import.meta) // Pass `import.meta`
import { logger } from '../utils/logger.js'

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const supabase = createClient({ req, res })
    const {
      data: { user },
      error
    } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    })
    if (error) throw error
    const { data: profile, error: errAtProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
    if (errAtProfile) throw errAtProfile
    const loggedUser = {
      email: profile[0].email,
      type: profile[0].user_type,
      id: user.id,
      photo: profile[0].avatar
    }
    res.status(200).send({
      data: loggedUser,
      error: null
    })
  } catch (err) {
    return res.status(403).send({
      data: null,
      error: err.message
    })
  }
}

const logout = async (req, res) => {
  try {
    const supabase = createClient({ req, res })
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return res.status(200).send({
      data: 'signed out successfully',
      error: null
    })
  } catch (err) {
    return res.status(500).send({
      data: null,
      error: err
    })
  }
}

const pageRefresh = async (req, res) => {
  try {
    const supabase = createClient({ req, res })
    const encodedCookie = req.cookies[process.env.AUTH_TOKEN]
    const decodedCookie = decodeURIComponent(encodedCookie)
    const access_token = decodedCookie.access_token

    //  Getting the user from auth table
    const {
      data: { user },
      error
    } = await supabase.auth.getUser(access_token)
    if (error) throw error

    // Getting the profile for this user
    const { data: profile, error: errAtProfile } = await supabase
      .from('profiles')
      .select('email, user_type, avatar')
      .eq('id', user.id)
    if (errAtProfile) throw errAtProfile
    const loggedUser = {
      email: profile[0].email,
      type: profile[0].user_type,
      id: user.id,
      photo: profile[0].avatar
    }
    return res.status(200).send({
      data: loggedUser,
      error: null
    })
  } catch (err) {
    const supabase = createClient({ req, res })
    const { error } = await supabase.auth.signOut()
    if (error) {
      return res.status(403).send({
        data: null,
        error: error
      })
    }
    return res.status(200).send({
      data: 'signed out successfully',
      error: err
    })
  }
}

const verify = async (req, res) => {
  try {
    const { token_hash, type } = req.body
    const supabase = createClient({ req, res })
    let {
      data: { session, user },
      error
    } = await supabase.auth.verifyOtp({ token_hash, type })
    if (error) throw error
    const { data: profile, error: errAtProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
    if (errAtProfile) throw errAtProfile
    const loggedUser = {
      email: profile[0].email,
      type: profile[0].user_type,
      id: user.id,
      photo: profile[0].avatar
    }
    return res.status(200).send({
      data: loggedUser,
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

const resetPassword = async (req, res) => {
  try {
    const { newPassword, code } = req.body
    const supabase = createClient({ req, res })
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (error)
      throw new Error('The link has been expired, create a new request.')
    const { data: user, error: errAtUpdate } = await supabase.auth.updateUser({
      password: newPassword
    })
    if (errAtUpdate)
      throw new Error(`Could not update the password. ${errAtUpdate.message}`)
    logger.data(user)
    const { data: profile, error: errAtProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
    if (errAtProfile)
      throw new Error(`Could not get profile info, please try again.`)
    const loggedUser = {
      email: profile[0].email,
      type: profile[0].user_type,
      id: user.id,
      photo: profile[0].avatar
    }
    return res.status(200).send({
      data: loggedUser,
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

const recoverUser = async (req, res) => {
  try {
    const redirectURL =
      process.env.NODE_ENV == 'production'
        ? process.env.RECOVER_URL_PROD
        : process.env.RECOVER_URL_DEV
    const { email } = req.body
    const supabase = createClient({ req, res })
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectURL
    })
    if (error) throw new Error('Could not send email.')
    return res.status(200).send({
      data: 'Sent email with a link, check it.',
      error: null
    })
  } catch (err) {
    logger.error(new Error(err))
    return res.status(500).send({
      data: null,
      error: err.message
    })
  }
}

export { login, logout, pageRefresh, verify, resetPassword, recoverUser }
