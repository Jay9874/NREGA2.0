// Requiring all the packages
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')
const { connect } = require('http2')

// Initializing the express application

const app = express()
const PORT = process.env.PORT || 8080

app.use(express.json({ limit: '25mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(cors())

// Defining api routes
const adminRoutes = require('./routes/admin')
// const workerRoutes = require('./routes/worker')
app.use('/api/admin', adminRoutes)
// app.use('/api/worker', workerRoutes)
app.use('/api/test', (req, res) => {
  res.send('Hello from the server')
})

// Frontend Routes
app.use(express.static(path.resolve(__dirname, 'frontend', 'dist')))
app.get('*', (req, res) => {
  res.sendFile(
    path.resolve(__dirname, 'frontend', 'dist', 'index.html'),
    function (err) {
      if (err) {
        res.status(500).send(err)
      }
    }
  )
})

//Connect to the database before listening

app.listen(PORT, () => {
  console.log(`listening for requests on port: ${PORT}`)
})
