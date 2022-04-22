import { describe, expect, test } from 'vitest'
import { cleanRoutePath } from '../src/makeRoutePathFromFilePath'

describe('cleanRoutePath', () => {
  test('should take in and return a string', () => {
    const path = '/user/test'
    const cleanedPath = cleanRoutePath(path)
    expect(cleanedPath).toEqual('/user/test')
  })

  test('should remove double slashes at the start', () => {
    const path = '///user/test'
    const cleanedPath = cleanRoutePath(path)
    expect(cleanedPath).toEqual('/user/test')
  })

  test('should remove double slashes at the end', () => {
    const path = '/user/test//'
    const cleanedPath = cleanRoutePath(path)
    expect(cleanedPath).toEqual('/user/test')
  })

  test('should remove double slashes in the middle', () => {
    const path = '/user//test'
    const cleanedPath = cleanRoutePath(path)
    expect(cleanedPath).toEqual('/user/test')
  })

  test('should remove double slashes all over the place', () => {
    const path = '//user///test//'
    const cleanedPath = cleanRoutePath(path)
    expect(cleanedPath).toEqual('/user/test')
  })

  test('should remove trailing slashes slashes', () => {
    const path = '/user/test/'
    const cleanedPath = cleanRoutePath(path)
    expect(cleanedPath).toEqual('/user/test')
  })
})
