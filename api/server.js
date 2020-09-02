const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./db/connection')
const bodyParser = require('body-parser')
const router = require('./router')

db.initPool()

const PORT = 8080;
app.use(cors())
app.use(bodyParser.json())

app.use('/', router)

app.listen(PORT, function() {
  console.log(`Listening on ${PORT}`)
})
