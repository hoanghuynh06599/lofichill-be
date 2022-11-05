const express = require('express')
const app = express()
const port = 8000
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const cors = require('cors')
const db = require('./config/db')

const routes = require('./routes')

// config env
dotenv.config()

// config server
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors({
    origin: true, 
    credentials: true
}))

// connect to db
db.connect()

// init routes
routes(app)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})