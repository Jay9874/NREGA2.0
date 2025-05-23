const express = require('express');
const router = express.Router();

const {
  login,
  logout,
  pageRefresh,
  recoverUser,
  resetPassword,
  verify
} = require('../controller/auth.js');
const { checkSession } = require('../middleware/checkSession.js');


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
router.post('/validate', checkSession, pageRefresh)

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

module.exports = { authRoutes: router };

