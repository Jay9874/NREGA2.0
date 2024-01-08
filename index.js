const express = require('express')
const port = process.env.PORT || 8080
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')

const app = express()
app.use(express.json({ limit: '25mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(cors())
app.use(express.static(path.join(__dirname, 'frontend', 'dist')))

// Routes
app.get('/api/hello', (req, res) => {
  console.log('got request on root route')
  res.send('Hello world')
})

app.get('/api/recovery', (req, res) => {
  res.send(req)
})

app.get('*', (req, res) => {
  res.sendFile(
    path.join(__dirname, 'frontend', 'dist', 'index.html'),
    function (err) {
      if (err) {
        res.status(500).send(err)
      }
    }
  )
})

app.listen(port, () => {
  console.log(`Server listening at port: ${port}`)
})
