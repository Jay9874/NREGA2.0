import { createServerClient } from '@supabase/ssr'

const createClient = (context) => {
  return createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (key) => {
          const cookies = context.req.cookies
          const cookie = cookies[key] ?? ''
          return decodeURIComponent(cookie)
        },
        set: (key, value, options) => {
          if (!context.res) return
          context.res.cookie(key, encodeURIComponent(value), {
            ...options,
            sameSite: 'Lax',
            httpOnly: true,
          })
        },
        remove: (key, options) => {
          if (!context.res) return
          context.res.cookie(key, '', { ...options, httpOnly: true })
        },
      },
    }
  )
}

export { createClient }
