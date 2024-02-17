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

exports.create = async (req, res) => {
  try {
    const { email, password } = req.body
    const { data: newUser, error } = await supabase.auth.signUp({
      email: email,
      password: password
    })
    if (error) res.status(500).json(error)
    res.status(201).json(newUser.user)
  } catch (error) {
    res.status(500).json(error)
  }
}

exports.fetchAadhaar = async (req, res) => {
  try {
    const { aadhaarNo } = req.body
    const { data: aadhaar, error } = await supabase
      .from('aadhaar_db')
      .select(`*`)
      .eq('aadhaar_no', aadhaarNo)
    if (error) res.status(500).json(error)
    res.status(200).json(aadhaar)
  } catch (error) {
    res.status(500).json(error)
  }
}
