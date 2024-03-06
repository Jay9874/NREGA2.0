// Requiring all the packages
const express = require('express')
const router = express.Router()
const { createUser, fetchAadhaar, createEmployee } = require('../controller/admin')

// Defining the routes
/**
 * @route POST api/admin/create
 * @description register user
 * @access public
 **/
router.post('/createuser', createUser)

/**
 * @route POST api/admin/createemp
 * @description Create new employee
 * @access public
 **/
router.post('/createemp', createEmployee)

/**
 * @route POST api/auth/sigin
 * @description login user
 * @access public
 **/
router.post('/aadhaar', fetchAadhaar)

module.exports = router
