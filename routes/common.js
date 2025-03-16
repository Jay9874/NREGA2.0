import express from 'express'
import {
  clearANotification,
  getNotification,
  subscribeRealtime
} from '../controller/common.js'
const router = express.Router()

// get notification for both users (admin and worker)
/**
 * @route POST api/notification
 * @description get all the notification for user id.
 * @access public
 **/
router.post('/notification', getNotification)

// clear a notification for both users (admin and worker)
/**
 * @route POST api/clear-notification
 * @description clear a notification for user id.
 * @access public
 **/
router.post('/clear-notification', clearANotification)

// subscribe to real time events
/**
 * @route POST api/subscribe-realtime
 * @description subscribe to real time events for worker or sachiv
 * @access public
 **/
router.post('/subscribe-realtime', subscribeRealtime)

export { router as commonRoutes }
