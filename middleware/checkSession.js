const { createClient } = require('../lib/supabase.js')

async function checkSession (req, res, next) {
  try {
    const encodedCookie = req.cookies[process.env.AUTH_TOKEN]
    const decodedCookie = decodeURIComponent(encodedCookie)
    const access_token = decodedCookie.access_token
    const supabase = createClient({ req, res })
    const { data, error } = await supabase.auth.getUser(access_token)
    if (error) throw new Error("Could'nt get valid session.")
    next()
  } catch (err) {
    console.log(err)
    next(err)
  }
}
module.exports = { checkSession }
