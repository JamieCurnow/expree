import express from 'express'
import { createRoutes } from '../src'
import path from 'path'
import { OpenAPIGenerator } from '@asteasolutions/zod-to-openapi'
// Or in real life:
// import { createRoutes } from 'expree'

const PORT = process.env.PORT || 1010

// Do your usual here
const app = express()
// Body parser is required for body validation
app.use(express.json({ limit: '50mb' }))

// app.use(cors) etc (whatever you like)

// This will create your routes from the routes dir.
// Optionally pass a second arg to createRoutes() which is the path to
// the routes dir if it's something other than path.join(__dirname, 'routes')
const singleRoute = { routesDirectory: 'test-route', routePrefix: 'test' }
const multiRoute = [
  {
    routesDirectory: 'test-route',
    routePrefix: 'test',
    generateSwaggerDocument: (generator: OpenAPIGenerator) => {
      return generator.generateDocument({
        openapi: '3.0.0',
        info: {
          version: '1.0.0',
          title: 'Test API',
          description: 'This is the test path of the multi-route API'
        }
      })
    },
    swaggerDocsPath: '/docs-test'
  },
  {
    routesDirectory: 'routes',
    routePrefix: '/',
    generateSwaggerDocument: (generator: OpenAPIGenerator) => {
      return generator.generateDocument({
        openapi: '3.0.0',
        info: {
          version: '1.0.0',
          title: 'Main API',
          description: 'This is the main path of the multi-route API'
        }
      })
    },
    swaggerDocsPath: '/docs'
  }
]

createRoutes(app, multiRoute).then(() => {
  // just logging the paths for testing
  const routes = app._router.stack.filter((x: any) => x.name === 'bound dispatch' && x.route)
  const paths = routes.map((x: any) => {
    const methods = Object.keys(x.route.methods).map((x) => x.toUpperCase())
    return `${methods.join('|')} ${x.route.path}`
  })
  console.log({ paths })

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`)
  })
})
