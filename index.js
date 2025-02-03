// Requiring all the packages
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import bodyParser from 'body-parser'
const nodeEnv = process.env.NODE_ENV
const __dirname = path.resolve()
import cookieParser from 'cookie-parser'
const PORT = process.env.PORT || 8080

// Importing routes and custom middlewares
import { adminRoutes } from './routes/admin.js'
import { workerRoutes } from './routes/worker.js'
import { authRoutes } from './routes/auth.js'
import { checkSession } from './middleware/checkSession.js'


const app = express()
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

// Error handler middleware
app.use((err, req, res, next) => {
  res.status(err.status).send({
    data: null,
    error: err
  })
})

// Listenning for requests
app.listen(PORT, () => {
  console.log(`listening for requests on port: ${PORT}`)
})
