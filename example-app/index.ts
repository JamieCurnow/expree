import express from 'express'
import { createRoutes } from '../src'
// Or in real life:
// import { createRoutes } from 'expree'

const PORT = process.env.PORT || 1010

// Do your usual here
const app = express()
// app.use(cors) etc (whatever you like)

// This will create your routes from the routes dir.
// Optionally pass a second arg to createRoutes() which is the path to
// the routes dir if it's something other than path.join(__dirname, 'routes')
createRoutes(app).then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`)
  })
})
