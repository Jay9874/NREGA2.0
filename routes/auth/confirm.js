import express from 'express'
const router = express.Router()
import { authConfirm } from '../../controller/auth'
/**
 * @route POST api/auth/confirm
 * @description check user metadata
 * @access public
 **/
router.get('/auth/confirm', authConfirm)
