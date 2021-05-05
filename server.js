const express = require('express')
const morgan = require('morgan')

const app = express()

// midllewares
app.use(morgan('dev'))

app.get('/', (req, res) => res.send('API running'))


const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
})
