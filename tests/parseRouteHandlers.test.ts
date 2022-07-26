import { describe, expect, test } from 'vitest'
import { parseRouteHandlers } from '../src/parseRouteHandlers'
import { z } from 'zod'

const middlewareFn = () => 'MiddleWare'
const validate = (zod: typeof z) => ({ body: zod.object({ requiredThing: zod.boolean() }) })
const handler = () => 'Handler'

describe('parseRouteHandlers', () => {
  test('should pass back the route handlers in the correct order with validation', () => {
    const handlers = parseRouteHandlers(
      {
        handler,
        middleware: [middlewareFn],
        validate
      },
      z
    )

    expect(handlers[1]).toEqual(middlewareFn)
  })

  test('should pass back the route handlers in the correct order without validation', () => {
    const handlers = parseRouteHandlers(
      {
        handler,
        middleware: [middlewareFn]
      },
      z
    )

    expect(handlers[0]).toEqual(middlewareFn)
  })
})
