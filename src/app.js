const express = require('express')
const cors = require('cors')
const cookie_parser = require('cookie-parser')

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(cookie_parser())

module.exports = {app}