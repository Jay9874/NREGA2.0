// Requiring all the packages
import 'dotenv/config'
import express from 'express'
import { createServer } from 'http'
import cors from 'cors'
import { Server } from 'socket.io'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import path from 'path'
const __dirname = path.resolve()
const nodeEnv = process.env.NODE_ENV

// Importing routes and custom middlewares
import { adminRoutes } from './routes/admin.js'
import { authRoutes } from './routes/auth.js'
import { checkSession } from './middleware/checkSession.js'

// Initializing the express application
const app = express()
const server = createServer(app)
const io = new Server(server)
const PORT = process.env.PORT || 8080

// in latest body-parser.
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.json({ limit: '25mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(
  cors({
    origin:
      nodeEnv == 'production'
        ? 'https://nrega-2-0.vercel.app'
        : 'http://localhost:5173',
    credentials: true
  })
)

// Static files like css, img, js and more
app.use(express.static(path.resolve(__dirname, 'frontend', 'dist')))


// Defining api routes methods
// const workerRoutes = require('./routes/worker')
app.use('/api/auth', authRoutes)
app.use('/api/admin', checkSession, adminRoutes)
// app.use('/api/worker', workerRoutes)
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

/////////////////////// Socket.io ///////////
io.on('connection', socket => {
  console.log('a user connected')
})

// Error handler middleware
app.use((err, req, res, next) => {
  res.status(err.status).send({
    data: null,
    error: err
  })
})

//Connect to the database before listening
app.listen(PORT, () => {
  console.log(`listening for requests on port: ${PORT}`)
})
