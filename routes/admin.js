// Requiring all the packages
import express from 'express'
const router = express.Router()
import {
  createUser,
  fetchAadhaar,
  createEmployee,
} from '../controller/admin.js'

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

export { router as adminRoutes }
