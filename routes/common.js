import express from 'express'
import { clearANotification, getNotification } from '../controller/common.js'
const router = express.Router()

// get notification for both users (admin and worker)
/**
 * @route POST api/auth/notification
 * @description get all the notification for user id.
 * @access public
 **/
router.post('/notification', getNotification)

// clear a notification for both users (admin and worker)
/**
 * @route POST api/auth/clear-notification
 * @description clear a notification for user id.
 * @access public
 **/
router.post('/clear-notification', clearANotification)

export { router as commonRoutes }
