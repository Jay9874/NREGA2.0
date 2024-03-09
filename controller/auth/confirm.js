import { createClient } from './lib/supabase.js'

const authConfirm = async (req, res) => {
  const token_hash = req.query.token_hash
  const type = req.query.type
  const next = req.query.next ?? '/'
  if (token_hash && type) {
    const supabase = createClient({ req, res })
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      res.redirect(303, `/${next.slice(1)}`)
    }
  }
  // return the user to an error page with some instructions
  res.redirect(303, '/auth/auth-code-error')
}

export { authConfirm }
