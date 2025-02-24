// Requiring all the packages
import express from 'express'
const router = express.Router()
import {
  createUser,
  fetchAadhaar,
  createEmployee,
  dashboardData,
  addAttendance,
  payout,
  rejectApplication,
  enrollWorker,
  updateWorker,
  addJob,
  fetchRandomAadhaar,
  setProfile,
  fetchEmployees,
  fetchRandomFamily
} from '../controller/admin.js'

// Defining the routes
/**
 * @route POST api/admin/profile
 * @description the the biometric data about sachiv.
 * @access public
 **/
router.post('/profile', setProfile)

/**
 * @route POST api/admin/create
 * @description register user
 * @access public
 **/
router.post('/createuser', createUser)

/**
 * @route POST api/admin/get-employees
 * @description get all the employees in the GP.
 * @access public
 **/
router.post('/get-employees', fetchEmployees)

/**
 * @route POST api/admin/createemp
 * @description Create new employee
 * @access public
 **/
router.post('/createemp', createEmployee)

/**
 * @route POST api/admin/update-worker
 * @description Update the profile details of a worker.
 * @access public
 **/
router.post('/update-worker', updateWorker)

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

// Route for api to enroll worker (accept job application) by admin.
/**
 * @route POST api/admin/enroll-worker
 * @description accept the application with application id.
 * @access public
 **/
router.post('/enroll-worker', enrollWorker)

// Route for api to reject an application by admin
/**
 * @route POST api/admin/reject-application
 * @description reject the application with application id.
 * @access public
 **/
router.post('/reject-application', rejectApplication)

// Route for api to add a new job
/**
 * @route POST api/admin/add-job
 * @description add the job to database
 * @access public
 **/
router.post('/add-job', addJob)

// Route for fetching a random aadhaar number for demo
/**
 * @route GET api/admin/random-aadhaar
 * @description fetch an unused random aadhaar number from database.
 * @access public
 **/
router.get('/random-aadhaar', fetchRandomAadhaar)

// Route for fetching a random family id for demo
/**
 * @route GET api/admin/random-family
 * @description fetch a random family id from database.
 * @access public
 **/
router.get('/random-family', fetchRandomFamily)

export { router as adminRoutes }
