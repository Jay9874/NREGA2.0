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
app.use(express.static(path.join(__dirname, '../client', 'build')))

app.get('/', (req, res) => {
  console.log('got request on root route')
  res.send('Hello world')
})

app.listen(port, () => {
  console.log(`Server listening at port: ${port}`)
})
