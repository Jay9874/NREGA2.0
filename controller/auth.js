require('dotenv/config')
const { createClient } = require('../lib/supabase.js')
const { logger } = require('../utils/logger.js')
const { resetRedirectURL } = require('../utils/nodeEnv.js')

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
    if (error)
      throw new Error(`Couldn't sign in to your account. ${error.message}`)
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
      error: err.message
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
    if (error) {
      logger.error(error)
      throw new Error("Couldn't get the user.")
    }

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
        error: 'You are unauthorized, please login first.'
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
    const { token_hash, email, type } = req.body
    if (type !== 'email')
      throw new Error('The link is invalid for verification purpose.')

    // Recheck if user exists
    const { data: checkEmail, error: errAtEmailCheck } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
    if (errAtEmailCheck) throw new Error("Couldn't confirm your email exists.")
    if (checkEmail.length === 0) throw new Error('The email does not exists.')
    if (checkEmail[0].email !== email)
      throw new Error('The email does not exists.')
    const supabase = createClient({ req, res })
    const {
      data: { user },
      error
    } = await supabase.auth.verifyOtp({ token_hash, type })
    if (error || !user) throw new Error('Could not verify the link.')
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
    const { newPassword, token_hash, email, type } = req.body
    if (type !== 'recovery')
      throw new Error('The link is invalid for recovery purpose.')
    const supabase = createClient({ req, res })

    // Recheck if user exits
    const { data: checkEmail, error: errAtEmailCheck } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
    if (errAtEmailCheck)
      throw new Error("Couldn't confirm if your email exists.")
    if (checkEmail.length === 0) throw new Error('The email does not exists.')
    if (checkEmail[0].email !== email)
      throw new Error('The email does not exists.')

    const { data, error } = await supabase.auth.verifyOtp({ token_hash, type })
    if (error || !data.user)
      throw new Error('The link has been expired, create a new request.')

    const { data: userData, error: errAtUpdate } =
      await supabase.auth.updateUser({
        password: newPassword
      })
    if (errAtUpdate)
      throw new Error(`Could not update the password. ${errAtUpdate.message}`)
    const { user } = userData
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
    const { email } = req.body
    const supabase = createClient({ req, res })
    // Check if the user exists
    const { data: profile, error: errAtProfile } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
    if (errAtProfile) throw new Error("Couldn't confirm your email exists.")
    if (profile.length === 0) throw new Error('The email does not exists.')
    if (profile[0].email !== email)
      throw new Error('The email does not exists.')

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: resetRedirectURL
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
