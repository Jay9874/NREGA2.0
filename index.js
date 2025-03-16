// Requiring all the packages
require('dotenv/config')
const express = require('express')
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const nodeEnv = process.env.NODE_ENV
const PORT = process.env.PORT || 8080

// Importing routes and custom middlewares
const { adminRoutes } = require('./routes/admin.js')
const { workerRoutes } = require('./routes/worker.js')
const { authRoutes } = require('./routes/auth.js')
const { checkSession } = require('./middleware/checkSession.js')
const { commonRoutes } = require('./routes/common.js')
const { rateLimiter } = require('./middleware/rateLimiter.js')
const { logger } = require('./utils/logger.js')

const app = express()
app.use(
  cors({
    origin:
      nodeEnv == 'production'
        ? 'https://nrega-2-0.vercel.app'
        : 'http://localhost:5173',
    credentials: true
  })
)

// Middlewares
app.use(cookieParser())
app.use(rateLimiter)
app.use(express.json({ limit: '25mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(bodyParser.json({ limit: '50mb' }))

// Static files like css, img, js and more
app.use(express.static(path.resolve(__dirname, 'frontend', 'dist')))

// Defining api routes methods
app.use('/api/auth', authRoutes)
app.use('/api', checkSession, commonRoutes)
app.use('/api/admin', checkSession, adminRoutes)
app.use('/api/worker', checkSession, workerRoutes)

// Frontend Routes for vercel
app.get('*', (req, res) => {
  res.sendFile(
    path.join(__dirname, '/frontend/dist', '/index.html'),
    function (err) {
      if (err) {
        res.status(500).send(err)
      }
    }
  )
})

// Error handler middleware
app.use((err, req, res, next) => {
  logger.error(err)
  res.status(500).send({
    data: null,
    error: 'Something went wrong.'
  })
})

// Listening for requests
app.listen(PORT, () => {
  console.log(`listening for requests on port: ${PORT}`)
})
