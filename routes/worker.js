// Requiring all the packages
const express = require('express');
const router = express.Router();

const {
  applyToJob,
  entitlement,
  getAttendances,
  getJobs,
  payments,
  setProfile,
  workingOn
} = require('../controller/worker.js');

// Defining the routes
/**
 * @route POST api/worker/profile
 * @description the the biometric data about worker.
 * @access public
 **/
router.post('/profile', setProfile)

/**
 * @route POST api/worker/apply
 * @description enroll a worker in requested job.
 * @access public
 **/
router.post('/apply', applyToJob)

/**
 * @route POST api/worker/working-on
 * @description the job worker currently working on.
 * @access public
 **/
router.post('/working-on', workingOn)

/**
 * @route POST api/worker/nearby-jobs
 * @description jobs within 15km of logged worker.
 * @access public
 **/
router.post('/jobs', getJobs)

/**
 * @route POST api/worker/attendances
 * @description all the attendances for all the jobs of a worker.
 * @access public
 **/
router.post('/attendances', getAttendances)

/**
 * @route POST api/worker/payments
 * @description all the payments of logged user.
 * @access public
 **/
router.post('/payments', payments)

/**
 * @route POST api/worker/entitlement
 * @description get the current household entitlement for all the members.
 * @access public
 **/
router.post('/entitlement', entitlement)

module.exports = { workerRoutes: router };

