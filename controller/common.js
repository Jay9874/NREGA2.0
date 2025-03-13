import { createClient } from "../lib/supabase.js"
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

export { clearANotification, getNotification }
