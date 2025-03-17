const { createClient } = require('../lib/supabase.js')
const { logger } = require('../utils/logger.js')

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
    if (error) throw new Error("Couldn't sign in to your account.")
    const { data: profile, error: errAtProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
    if (errAtProfile) throw new Error("Couldn't fetch profile info.")
    if (profile.length === 0) throw new Error("Couldn't get profile info.")
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
    logger.error(err)
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
    if (error) throw new Error("Couldn't sign you out.")
    return res.status(200).send({
      data: 'signed out successfully',
      error: null
    })
  } catch (err) {
    logger.error(err)
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
    if (error) throw new Error("Couldn't get the user.")

    // Getting the profile for this user
    const { data: profile, error: errAtProfile } = await supabase
      .from('profiles')
      .select('email, user_type, avatar')
      .eq('id', user.id)
    if (errAtProfile) throw new Error("Couldn't get profile.")
    if (profile.length === 0) throw new Error("Couldn't get profile.")
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
    const supabase = createClient({ req, res })
    const { error } = await supabase.auth.signOut()
    if (error) {
      return res.status(403).send({
        data: null,
        error: 'Could not sing you out.'
      })
    }
    return res.status(200).send({
      data: 'signed out successfully',
      error: err.message
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
    if (error) throw new Error('Could not verify the link.')
    const { data: profile, error: errAtProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
    if (errAtProfile) throw new Error("Couldn't get the your profile.")
    if (profile.length === 0) throw new Error("Couldn't get the your profile.")
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

const resetPassword = async (req, res) => {
  try {
    const { newPassword, code } = req.body
    const supabase = createClient({ req, res })
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (error)
      throw new Error('The link has been expired, create a new request.')
    const { data: userData, error: errAtUpdate } =
      await supabase.auth.updateUser({
        password: newPassword
      })
    if (errAtUpdate)
      throw new Error(`Could not update the password. ${errAtUpdate.message}`)
    const { user } = userData
    console.log('user: ', user.id)
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
    const { email, redirectURL } = req.body
    const supabase = createClient({ req, res })
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectURL
    })
    if (error) {
      logger.error(error)
      throw new Error(
        `Could not send email. ${error.message ? error.message : ''}`
      )
    }
    return res.status(200).send({
      data: 'Sent email with a link, check it.',
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

module.exports = {
  login,
  logout,
  pageRefresh,
  verify,
  resetPassword,
  recoverUser
}
