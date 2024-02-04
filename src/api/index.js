import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

function GreetUserWithTime () {
  const today = new Date()
  const curHr = today.getHours()

  if (curHr < 12) {
    return 'Good Morning'
  } else if (curHr < 18) {
    return 'Good Afternoon'
  } else {
    return 'Good Evening'
  }
}

export { supabase, GreetUserWithTime }
