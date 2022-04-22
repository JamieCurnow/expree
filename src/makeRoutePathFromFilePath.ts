import * as path from 'path'

/** Remove double and trailing slashes from the route path and make sure it starts with a slash */
export const cleanRoutePath = (path: string) => {
  return `/${path}`.replace(/\/+/gm, '/').replace(/\/$/gm, '')
}

/** Turns the dir path into a route path. Eg. __dirname/user/verify.ts => /user/verify */
export const makeRoutePathFromFilePath = (filePath: string, rootDir: string, routePrefix: string): string => {
  const routePath = filePath
    // make sure we're in posix
    .split(path.sep)
    .join(path.posix.sep)
    // remove directory path
    .split(rootDir)
    .join('')
    // Remove file extension
    .split('.')
    .slice(0, -1)
    .join('.')
    // remove index
    .split('/index')
    .join('')
    // replace /_ with /: for dynamic routes
    .split('/_')
    .join('/:')
  // add the route prefix
  const routePathPrefixed = `/${routePrefix}/${routePath}`

  // return the cleaned path
  return cleanRoutePath(routePathPrefixed)
}
