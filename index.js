// Requiring all the packages
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import path from 'path'
const __dirname = path.resolve()

// Initializing the express application

const app = express()
const PORT = process.env.PORT || 8080

// in latest body-parser.
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json({ limit: '25mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(cors())

// Defining api routes
import { adminRoutes } from './routes/admin.js'
// const workerRoutes = require('./routes/worker')
app.use('/api/admin', adminRoutes)
// app.use('/api/worker', workerRoutes)
app.use('/api/test', (req, res) => {
  res.send('Hello from the server')
})

// Frontend Routes
// For the vercel production
app.use(express.static(path.join(__dirname, '/frontend/public')))
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

//Connect to the database before listening
app.listen(PORT, () => {
  console.log(`listening for requests on port: ${PORT}`)
})
