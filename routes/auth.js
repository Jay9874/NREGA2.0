import express from 'express'
const router = express.Router()
import {
  login,
  logout,
  pageRefresh,
  recoverUser,
  resetPassword,
  verify
} from '../controller/auth.js'
import { checkSession } from '../middleware/checkSession.js'

// Login route
/**
 * @route POST api/auth/login
 * @description login a user
 * @access public
 **/
router.post('/login', login)

// Validate access token
/**
 * @route POST api/auth/validate
 * @description validate session and new session on expire
 * @access public
 **/
router.post('/validate', pageRefresh)

// Reset the password for logged user.
/**
 * @route POST api/auth/reset-password
 * @description reset the password of a logged user.
 * @access public
 **/
router.post('/reset-password', resetPassword)

// Recover a user sending invite link.
/**
 * @route POST api/auth/recover-user
 * @description recover a user with magic link.
 * @access public
 **/
router.post('/recover-user', recoverUser)

// Logout a user from system
/**
 * @route POST api/auth/logout
 * @description logout the current user.
 * @access public
 **/
router.post('/logout', logout)

// Verify the link upon new user creation
/**
 * @route POST api/auth/verify
 * @description verify the token with new user verification link.
 * @access public
 **/
router.post('/verify', verify)

export { router as authRoutes }
