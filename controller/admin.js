// const User = require('../models/user')
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
const { createClient } = require('@supabase/supabase-js')
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
// const { OAuth2Client } = require('google-auth-library')
// const client = new OAuth2Client(process.env.CLIENT_ID)
// const jwt_secret = process.env.JWT_SECRET

exports.create = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const { data: newUser, error } = await supabase.auth.signUp({
      email: email,
      password: password
    })
    if (error) {
      throw error
    }
    return res.status(201).json(newUser.user)
  } catch (error) {
    console.log('error in catch: ', error)
    return next(error)
  }
}

exports.fetchAadhaar = async (req, res) => {
  try {
    const { aadhaarNo } = req.body
    const { data: aadhaar, error } = await supabase
      .from('aadhaar_db')
      .select(`*`)
      .eq('aadhaar_no', aadhaarNo)
    if (error) {
      res.status(500)
      res.send({
        data: null,
        error: error
      })
    }
    res.status(200).send({
      data: aadhaar,
      error: null
    })
  } catch (err) {
    res.status(500)
    res.send({
      data: null,
      error: err
    })
  }
}
