import { describe, expect, it } from 'vitest'
import path from 'path'
import { getFilePaths } from '../src/getFilePaths'

describe('getFilePaths', () => {
  it('should return the correct file paths', async () => {
    const dir = path.join(__dirname, '/mock')

    const paths = await getFilePaths(dir)

    expect(paths).toEqual([
      '/Users/JCGeek/Documents/Projects/expree/tests/mock/hello.ts',
      '/Users/JCGeek/Documents/Projects/expree/tests/mock/nest/nest-again/hi.ts',
      '/Users/JCGeek/Documents/Projects/expree/tests/mock/nest/test.ts'
    ])
  })
})
