import { createClient } from '../lib/supabase.js'

const confirmSignup = async (req, res) => {
  const token_hash = req.query.token_hash
  const type = req.query.type
  const next = req.query.next ?? '/'
  if (token_hash && type) {
    const supabase = createClient({ req, res })
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash
    })
    if (!error) {
      res.redirect(303, `/${next.slice(1)}`)
    }
  }
  // return the user to an error page with some instructions
  res.redirect(303, '/auth/auth-code-error')
}

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

const signup = async (req, res) => {
  try {
    const { userType, email, password, avatar, display_name } = req.body
    // Create a new user account with given email and password
    const supabase = createClient({ req, res })
    const { data, error: errAtAuth } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: `localhost:8080/api/auth/confirm`,
        data: { userType: userType, avatar: avatar, display_name: display_name }
      }
    })
    if (errAtAuth) throw errAtAuth
    return res.status(200).send({
      data: 'Check the email for confirmation.',
      error: null
    })
  } catch (err) {
    console.log(err)
    return res.status(err.status).send({
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

const updateMeta = async (req, res) => {
  try {
    const { userType, avatar, display_name } = req.body
    const supabase = createClient({ req, res })
    const { user, error } = await supabase.auth.updateUser({
      data: { userType: userType, avatar: avatar, display_name: display_name }
    })
    if (error) throw error
    return res.status(200).send({
      data: user,
      error: null
    })
  } catch (err) {
    console.log(err)
    return res.status(err.status).send({
      data: null,
      error: err
    })
  }
}

const getNotification = async (req, res) => {
  try {
    const { userId, type } = req.body
    const supabase = createClient({ req, res })
    const table =
      type == 'worker' ? 'worker_notifications' : 'sachiv_notifications'
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('user_id', userId)
    if (error) throw error
    return res.status(200).send({
      data: data,
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

const clearANotification = async (req, res) => {
  try {
    const { notificationId, type } = req.body
    const searchTable = `${type == 'admin' ? 'sachiv' : 'worker'}_notifications`
    const supabase = createClient({ req, res })
    const { data, error } = await supabase
      .from(searchTable)
      .delete()
      .eq('id', notificationId)
      .select()
    if (error) throw error
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

export {
  confirmSignup,
  login,
  logout,
  signup,
  pageRefresh,
  updateMeta,
  getNotification,
  clearANotification,
  verify
}
