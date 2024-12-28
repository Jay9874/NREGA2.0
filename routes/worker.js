// Requiring all the packages
import express from 'express'
const router = express.Router()
import { applyToJob, entitlement } from '../controller/worker.js'

// Defining the routes
/**
 * @route POST api/worker/apply
 * @description enroll a worker in requested job.
 * @access public
 **/
router.post('/apply', applyToJob)

/**
 * @route POST api/worker/entitlement
 * @description get the current household entitlement for all the members.
 * @access public
 **/
router.post('/entitlement', entitlement)

export { router as workerRoutes }
