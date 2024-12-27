// Requiring all the packages
import express from 'express'
const router = express.Router()
import {
  applyToJob
} from '../controller/worker.js'

// Defining the routes
/**
 * @route POST api/worker/apply
 * @description enroll a worker in requested job.
 * @access public
 **/
router.post('/apply', applyToJob)

export { router as workerRoutes }