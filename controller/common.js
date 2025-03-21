require('dotenv/config')
const { createClient } = require('../lib/supabase.js')
const { logger } = require('../utils/logger.js')

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
    if (error) throw new Error("Couldn't get the notifications.")
    if (data.length === 0) throw new Error('No notifications.')
    return res.status(200).send({
      data: data,
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
    if (error) throw new Error("Couldn't clear the notification.")
    return res.status(200).send({
      data: data,
      error: null
    })
  } catch (err) {
    logger.error(err)
    return res.status(501).send({
      data: null,
      error: err.message
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

module.exports = {
  clearANotification,
  getNotification,
  subscribeRealtime
}
