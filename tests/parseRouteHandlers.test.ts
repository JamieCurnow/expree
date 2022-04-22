import { describe, expect, test } from 'vitest'
import { parseRouteHandlers } from '../src/parseRouteHandlers'
import Joi from 'joi'

const middlewareFn = () => 'MiddleWare'
const validate = (joi: Joi.Root) => ({ body: { requiredThing: joi.boolean().required() } })
const handler = () => 'Handler'

describe('parseRouteHandlers', () => {
  test('should pass back the route handlers in the correct order with validation', () => {
    const handlers = parseRouteHandlers({
      handler,
      middleware: [middlewareFn],
      validate
    })

    expect(handlers[1]).toEqual(middlewareFn)
  })

  test('should pass back the route handlers in the correct order without validation', () => {
    const handlers = parseRouteHandlers({
      handler,
      middleware: [middlewareFn]
    })

    expect(handlers[0]).toEqual(middlewareFn)
  })
})
