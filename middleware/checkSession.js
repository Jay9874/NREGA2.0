const { createClient } = require('../lib/supabase.js')

async function checkSession (req, res, next) {
  try {
    const encodedCookie = req.cookies[process.env.AUTH_TOKEN]
    const decodedCookie = decodeURIComponent(encodedCookie)
    const access_token = decodedCookie.access_token
    const supabase = createClient({ req, res })
    const { data, error: errAtCheckingSession } = await supabase.auth.getUser(
      access_token
    )
    if (errAtCheckingSession) {
      const { error } = await supabase.auth.signOut()
      if (error) throw new Error("Couldn't sign you out.")
      return res
        .status(403)
        .send({
          data: null,
          error: 'You are unauthorized, please login first.'
        })
    }
    next()
  } catch (err) {
    console.log(err)
    next(err)
  }
}
module.exports = { checkSession }
