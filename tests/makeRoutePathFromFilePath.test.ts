import { describe, expect, test } from 'vitest'
import { makeRoutePathFromFilePath } from '../src/makeRoutePathFromFilePath'

const appDir = '/Users/Someone/Projects/expree/src/routes'

describe('makeRoutePathFromFilePath', () => {
  test('should return the route path only', () => {
    const filePath = appDir + '/user/test.js'
    const route = makeRoutePathFromFilePath(filePath, appDir, '/')
    expect(route).toEqual('/user/test')
  })

  test('should handle a path prefix', () => {
    const filePath = appDir + '/user/test.js'
    const route = makeRoutePathFromFilePath(filePath, appDir, '/prefix')
    expect(route).toEqual('/prefix/user/test')
  })

  test('should handle a path prefix without a slash', () => {
    const filePath = appDir + '/user/test.js'
    const route = makeRoutePathFromFilePath(filePath, appDir, '/prefix')
    expect(route).toEqual('/prefix/user/test')
  })

  test('should remove double slashes', () => {
    const filePath = appDir + '/user/test.js'
    const route = makeRoutePathFromFilePath(filePath, appDir, '//prefix')
    expect(route).toEqual('/prefix/user/test')
  })

  test('should handle a prefix with a trailing slash', () => {
    const filePath = appDir + '/user/test.js'
    const route = makeRoutePathFromFilePath(filePath, appDir, '//prefix/')
    expect(route).toEqual('/prefix/user/test')
  })
})
