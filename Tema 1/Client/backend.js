const express = require('express')
const jQuery = require('jquery')
const app = express()
const port = 3000
const https = require('http')
const { stringify } = require('qs')

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/home.html")
})

app.get('/node_modules/jquery/src/jquery.js', (req, res) => {
  res.sendFile(__dirname + "/node_modules/jquery/src/jquery.js")
})

app.get('/metrics', (req, res) => {
  const options = {
    hostname: '127.0.0.1',
    port: 5000,
    path: '/metrics/',
    method: 'GET'
  }

  const rq = https.request(options, result => {
    console.log(`statusCode: ${result.statusCode}`)

    result.on('data', d => {
      res.send(String(d))  
    })
  })

  rq.on('error', error => {
    console.error(error)
  })

  rq.end()
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})