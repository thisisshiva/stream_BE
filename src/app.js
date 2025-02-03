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

//rotues import
const userRouter = require("./routes/user.routes")

//route declare
app.use("/api/v1/users", userRouter)


module.exports = app