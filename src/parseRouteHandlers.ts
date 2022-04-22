import { Express, RequestHandler } from 'express'
import { validate as validator } from 'express-validation'
import Joi from 'joi'

import { RouteDefinition } from './types'

export const parseRouteHandlers = (route: RouteDefinition): RequestHandler[] => {
  const { handler, validate, middleware } = route

  // Error if no handler
  if (!handler) return []

  // Make an array to hold express handlers, including any middleware
  let handlers: RequestHandler[] = []

  // Add validation middleware first
  if (typeof validate === 'function') {
    const validationObj = validate(Joi)
    const validationSchema = {
      body: validationObj.body ? Joi.object(validationObj.body) : undefined,
      query: validationObj.query ? Joi.object(validationObj.query) : undefined,
      params: validationObj.params ? Joi.object(validationObj.params) : undefined
    }
    const validationHandler = validator(validationSchema, { context: true }, { abortEarly: false })
    handlers.push(validationHandler)
  }

  // Add middleware if any
  if (middleware?.length) handlers.push(...middleware)

  // Add the actual handler to the end of the array
  const handlerProcessor: RequestHandler = async (req, res) => {
    try {
      const result = await handler(req, res)
      return res.headersSent || res.send(result)
    } catch (e) {
      console.error(e)
      return res.headersSent || res.status(500).send('Server Error')
    }
  }
  handlers.push(handlerProcessor)

  return handlers
}
