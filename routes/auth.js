import express from 'express'
const router = express.Router()
import {
  clearANotification,
  confirmSignup,
  getNotification,
  login,
  logout,
  pageRefresh,
  signup,
  updateMeta
} from '../controller/auth.js'
/**
 * @route GET api/auth/confirm
 * @description check user metadata
 * @access public
 **/
router.get('/confirm', confirmSignup)

// Login route
/**
 * @route POST api/auth/login
 * @description login a user
 * @access public
 **/
router.post('/login', login)

// Signup User
/**
 * @route POST api/auth/signup
 * @description create a new account
 * @access public
 **/
router.post('/signup', signup)

// Validate access token
/**
 * @route POST api/auth/validate
 * @description validate session and new session on expire
 * @access public
 **/
router.post('/validate', pageRefresh)

// Update user metadata
/**
 * @route POST api/auth/update-meta
 * @description update the meta data of existing user.
 * @access public
 **/
router.post('/update-meta', updateMeta)

// Logout a user from system
/**
 * @route POST api/auth/logout
 * @description logout the current user.
 * @access public
 **/
router.post('/logout', logout)

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

export { router as authRoutes }
