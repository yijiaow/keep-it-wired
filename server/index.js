require('dotenv/config')
const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const feedRouter = require('./feed-router')
const { PORT, MONGO_DB_URI } = process.env

const app = express()
mongoose.connect(MONGO_DB_URI)
const db = mongoose.connection
db
  .on('error', console.error.bind(console, 'connection error:'))
  .once('open', () => {
    app.listen(PORT)
  })
app
  .disable('x-powered-by')
  .use(express.static(path.join(__dirname, '../chrome-extension')))
  .use(bodyParser.json())
  .use('/feed', feedRouter())
