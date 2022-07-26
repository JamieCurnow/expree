import { RequestHandler } from 'express'
import { validateRequest } from 'zod-express-middleware'

import { RouteDefinition } from './types'

import type { z } from 'zod'

export const parseRouteHandlers = (route: RouteDefinition, zod: typeof z): RequestHandler[] => {
  const { handler, validate, middleware } = route

  // Error if no handler
  if (!handler) return []

  // Make an array to hold express handlers, including any middleware
  let handlers: RequestHandler[] = []

  // Add validation middleware first
  if (typeof validate === 'function') {
    const validationObj = validate(zod)

    const validationHandler = validateRequest(validationObj)

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
