import { describe, expect, it } from 'vitest'
import { defineRoute } from '../src'

describe('defineRoute', () => {
  it('should just return the object passed into it', () => {
    const opts = {
      handler: () => 'hello'
    }
    const route = defineRoute(opts)

    expect(route).toEqual(opts)
  })
})
