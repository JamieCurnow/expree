/** 
 * A route file!
 * All of your routes will look similar to this.
 * The path of the route is derived from the path in the directory structure eg:
 * '/test-default'
 * 
 * This file uses the 'export default' method, where all route types (post, get, etc.) are
 * exported in a default object.
 */


// Import helpers from expree
import { defineRoutes, defineRoute } from '../../src'
// Or in real life:
// import { defineRoutes, defineRoute } from 'expree'

// Define your types for the routes - type however much you need
// The defineRoute function takes 4 type args: Request, Response, Params, Query

// Post types
interface PostReq { userId: string }
type PostRes = string

// Get types
interface GetQuery { userId: string }
interface GetResponse { success: boolean }

// Use the defineRoutes helper for the default export - this just provides Types
export default defineRoutes({
  // List your request types as keys in this object. Options are:
  // 'get' | 'post' | 'put' | 'delete' | 'options' | 'head' | 'connect' | 'trace' | 'patch'

  // Here's a post request:
  // Pass in the types as TS params <Req, Res, Params, Query>
  // Remember, our route path is derived from the directory structure, so this is like doing
  // app.post('/test-default')
  post: defineRoute<PostReq, PostRes>({
    // Tap into 'express-validation' to validate the request
    // validate should be a function that returns an object with the optional keys:
    // 'body' | 'params' | 'query'
    // Each key should be an object map of [keyToTest: string]: Joi.Schema
    // Access to joi is available through the validate funtion as the first arg
    validate: (joi) => ({
      body: {
        // The below will validate that req.body.userId is a string and is required
        userId: joi.string().required()
      }
    }),
    // Write a handler for the request.
    // This should always be an async function and you have access to express'
    // req: Request and res: Response objects.
    async handler(req, res) {
      // Perform your request logic here. 
      // Note that we have type safety based on our defined PostReq and PostRes above
      const { userId } = req.body // string!

      // You have access to the whole of express here
      // So if you want to change the response code from the default 200, you can:
      res.status(418) // I'm a teapot

      // Whatever is returned from the handler will be passed to express' res.send() function
      // So instead of:
      // return res.status(200).send(userId)
      // Simply:
      return userId

      // If you wanted to do something funky, you can still
      // return res.vary('User-Agent').render('docs')
    }
  }),

  // Here's an example get request with a query
  get: defineRoute<{}, GetResponse, {}, GetQuery>({
    validate: (joi) => ({
      query: {
        userId: joi.string().required()
      }
    }),
    async handler(req) {
      const { userId } = req.query // string
      const userIdContainsLetterA = userId.includes('a') // boolean
      return { success: userIdContainsLetterA } // GetResponse
    }
  })
})
