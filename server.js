const express = require('express')
const morgan = require('morgan')
const connectDB = require('./config/db')

const app = express()

// connect db
connectDB()

// midllewares
app.use(morgan('dev'))
app.use(express.json({ extended: false }))

// define routes
app.use('/api/users', require('./api/users'))
app.use('/api/auth', require('./api/auth'))
app.use('/api/profile', require('./api/profile'))
app.use('/api/posts', require('./api/posts'))


const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
})
