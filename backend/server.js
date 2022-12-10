import express from 'express'
import cors from 'cors'
import router from './api/router.js'

// create our Express application
const app = express()

// adds various functionality in the form of what is called "middleware".
// in this case, the middleware used handles Cross-Origin Resource Sharing (CORS)
// requests and lets us work with JSON in Express.
app.use(cors())
app.use(express.json())

// All requests coming in on URLs with this prefix will be sent to the movies.router.js
app.use('/api/v1', router)
app.use('*', (request, response) => response.status(404).json({error: 'route not found'}))

export default app;