const express = require('express');
const router = express.Router();

const {
  clearANotification,
  getNotification,
  subscribeRealtime
} = require('../controller/common.js');

// get notification for both users (admin and worker)
/**
 * @route POST api/notification
 * @description get all the notification for user id.
 * @access public
 **/
router.post('/notification', getNotification)

// clear a notification for both users (admin and worker)
/**
 * @route POST api/clear-notification
 * @description clear a notification for user id.
 * @access public
 **/
router.post('/clear-notification', clearANotification)

// subscribe to real time events
/**
 * @route POST api/subscribe-realtime
 * @description subscribe to real time events for worker or sachiv
 * @access public
 **/
router.post('/subscribe-realtime', subscribeRealtime)

module.exports = { commonRoutes: router };

