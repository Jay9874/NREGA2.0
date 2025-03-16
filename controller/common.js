import { authStore } from '../frontend/src/api/store/authStore.js'
import { createClient } from '../lib/supabase.js'
import { logger } from '../utils/logger.js'
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

const subscribeRealtime = async (req, res) => {
  try {
    const { table } = req.body
    const supabase = createClient({ req, res })
    // Supabase Realtime
    const handleInserts = payload => {
      console.log(payload.new)
    }
    supabase
      .channel('job_application')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: table },
        handleInserts
      )
      .subscribe()
    return res.status(200).send({
      data: 'subscribed to real time events on table.',
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

export { clearANotification, getNotification, subscribeRealtime }
