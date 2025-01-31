// Requiring all the packages
import express from 'express'
const router = express.Router()
import { checkSession } from '../middleware/checkSession.js'
import {
  createUser,
  fetchAadhaar,
  createEmployee,
  dashboardData,
  addAttendance,
  payout, 
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
 * @route POST api/admin/aadhaar
 * @description check availability of aadhaar number
 * @access public
 **/
router.post('/aadhaar', fetchAadhaar)

/**
 * @route POST api/admin/dashboard
 * @description send all dashboard data
 * @access public
 **/
router.post('/dashboard', dashboardData)


/**
 * @route POST api/admin/dashboard
 * @description send all dashboard data
 * @access public
 **/
router.post('/add-attendance', addAttendance)

/**
 * @route POST api/admin/payout
 * @description send all payout details
 * @access public
 **/
router.post('/payout', payout)

export { router as adminRoutes }
