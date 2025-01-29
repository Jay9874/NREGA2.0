// Requiring all the packages
import 'dotenv/config'
import express from 'express'
const app = express()
import cors from 'cors'
import path from 'path'
import http from 'http'
const server = http.createServer(app)
import { Server } from 'socket.io'
import bodyParser from 'body-parser'
const nodeEnv = process.env.NODE_ENV
const __dirname = path.resolve()
import cookieParser from 'cookie-parser'
const PORT = process.env.PORT || 8080

// creating supabase orm for socket connection and db modification
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Importing routes and custom middlewares
import { adminRoutes } from './routes/admin.js'
import { workerRoutes } from './routes/worker.js'
import { authRoutes } from './routes/auth.js'
import { checkSession } from './middleware/checkSession.js'

// server-side
const io = new Server(server, {
  cors: {
    origin: nodeEnv == 'production' ? '' : 'http://localhost:5173',
    credentials: true
  }
})

app.use(
  cors({
    origin: nodeEnv == 'production' ? '' : 'http://localhost:5173',
    credentials: true
  })
)

// Middlewares
app.use(cookieParser())
app.use(express.json({ limit: '25mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(bodyParser.json({ limit: '50mb' }))
// Static files like css, img, js and more
app.use(express.static(path.resolve(__dirname, 'frontend', 'dist')))

// Defining api routes methods
app.use('/api/auth', authRoutes)
app.use('/api/admin', checkSession, adminRoutes)
app.use('/api/worker', checkSession, workerRoutes)
app.use('/api/test', (req, res) => {
  res.send(`Hello from the server\n Directory is ${__dirname}`)
})

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

// Socket requests handling
let users = {} // keeping record of users
io.on('connection', socket => {
  try {
    socket.on('join', userId => {
      users[userId] = socket.id
    })
    // Receiving application from worker, sending to db, generating notification to sachiv
    socket.on('sendApplication', async details => {
      try {
        var jobDetail = {
          ...details,
          application_id: `ap_${details.job}_${details.by_worker}`,
          status: 'applied',
          remark: 'The application is under processing.'
        }
        const { data, error } = await supabase
          .from('job_enrollments')
          .upsert(jobDetail)
          .select()
        if (error) throw error
        const { data: notification, errAtNotification } = await supabase
          .from('sachiv_notifications')
          .insert({
            category: 'job application',
            details: {
              Worker: details.by_worker,
              Job: details.job,
              Duration: details.time_period,
              Joining: details.starting_date
            }
          })
          .select()
        if (errAtNotification) throw errAtNotification
        const { data: workerNotification, errAtWorkerNotification } =
          await supabase
            .from('worker_notifications')
            .insert({
              category: 'job application',
              details: {
                Job: details.job,
                Duration: details.time_period
              }
            })
            .select()
        if (errAtWorkerNotification) throw errAtWorkerNotification
        const receiverSocket = users[details.to_sachiv]
        const senderSocket = users[details.by_worker]
        if (senderSocket) {
          io.to(senderSocket).emit('receiveNotification', workerNotification)
        }
        if (receiverSocket) {
          io.to(receiverSocket).emit('newNotification', notification)
        }
      } catch (err) {
        console.log(err)
        socket.emit('error', err)
      }
    })
  } catch (err) {
    console.log(err)
    socket.emit('error', err)
  }
})

// Error handler middleware
app.use((err, req, res, next) => {
  res.status(err.status).send({
    data: null,
    error: err
  })
})

// Listenning for requests
server.listen(PORT, () => {
  console.log(`listening for requests on port: ${PORT}`)
})
