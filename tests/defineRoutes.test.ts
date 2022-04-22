import { describe, expect, it } from 'vitest'
import { defineRoute, defineRoutes } from '../src'

describe('defineRoutes', () => {
  it('should just return the object passed into it', () => {
    const routes = {
      get: defineRoute({
        handler: () => 'hello'
      })
    }

    const opts = defineRoutes(routes)
    expect(opts).toEqual(routes)
  })
})
