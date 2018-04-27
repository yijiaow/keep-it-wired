require('dotenv/config')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const feedRouter = require('./feed-router')
const { PORT } = process.env

const app = express()
app.listen(PORT)
app
  .disable('x-powered-by')
  .use(express.static(path.join(__dirname, '../chrome-extension')))
  .use(bodyParser.json())
  .use('/feed', feedRouter())
