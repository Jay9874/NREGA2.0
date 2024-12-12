// Requiring all the packages
import 'dotenv/config'
import express from 'express'
import http from 'http'
import socketio from 'socket.io'
import cors from 'cors'
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
const server = http.createServer(app)
const io = socketio(server)
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

// The web socket connection
io.on('connection', socket => {
  // this block will run when the client connects
  socket.on('joinRoom', ({ username, room }) => {
    const user = newUser(socket.id, username, room)

    socket.join(user.room)

    // General welcome
    socket.emit(
      'message',
      formatMessage('WebCage', 'Messages are limited to this room! ')
    )

    // Broadcast everytime users connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage('WebCage', `${user.username} has joined the room`)
      )

    // Current active users and room name
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getIndividualRoomUsers(user.room)
    })
  })
})

// Managing message
socketio.on('chatMessage', msg => {
  const user = getActiveUser(socketio.id);
  io.to(user.room).emit('message', formatMessage(user.username, msg));
});


// leaving the server
socketio.on('disconnect', () => {
  const user = exitRoom(socketio.id);
  if (user) {
    io.to(user.room).emit(
      'message',
      formatMessage("WebCage", `${user.username} has left the room`)
    );

    // Current active users and room name
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getIndividualRoomUsers(user.room)
    });
  }
});
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
