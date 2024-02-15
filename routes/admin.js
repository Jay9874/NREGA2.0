// Requiring all the packages
const express = require('express')
const router = express.Router()
const { create } = require('../controller/admin')

// Defining the routes
/**
 * @route POST api/admin/create
 * @description register user
 * @access public
 **/
router.post('/create', create)

// /**
//  * @route POST api/auth/sigin
//  * @description login user
//  * @access public
//  **/
// router.post('/login', signin)

module.exports = router
