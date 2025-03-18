const rateLimit = {} // Store request counts
const { createClient } = require('../lib/supabase.js')

const rateLimiter = async (req, res, next) => {
  try {
    const ip = req.ip // Or any other identifier
    if (!rateLimit[ip]) {
      rateLimit[ip] = { count: 0, lastRequest: 0 }
    }
    const now = Date.now()
    const timeWindow = 60 * 1000 // 1 minute
    const maxRequests = 30 // 60 requests per minute

    if (now - rateLimit[ip].lastRequest > timeWindow) {
      rateLimit[ip] = { count: 0, lastRequest: now }
    }

    rateLimit[ip].count++
    rateLimit[ip].lastRequest = now
    const supabase = createClient({ req, res })
    if (rateLimit[ip].count > maxRequests) {
      const { error } = await supabase.auth.signOut()
      if (error) throw new Error("Couldn't sign you out.")
      return res
        .status(429)
        .send({ data: null, error: 'Too Many Requests, try after 60 seconds.' })
    }
    next()
  } catch (err) {
    return next(err)
  }
}

module.exports = { rateLimiter }
