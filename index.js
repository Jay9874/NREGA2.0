const express = require('express')
const app = express()
const port = process.env.PORT || 8080

app.get('/', (req, res) => {
  console.log('got request on root route')
  res.send('Hello world')
})

app.listen(port, () => {
  console.log(`Server listening at port: ${port}`)
})
