import { Express } from 'express'
import * as path from 'path'
import { getFilePaths } from './getFilePaths'
import { makeRoutePathFromFilePath } from './makeRoutePathFromFilePath'
import { parseRouteHandlers } from './parseRouteHandlers'
import { DefineRoutesOptions, RouteTypes } from './types'
import { validationErrorHandler } from './validationErrorHandler'

/** Options for route locations and prefixes */
interface CreateRoutesOption {
  /**
   * The directory to find all of the routes. Defaults to 'routes'.
   * Can be an absolute path or a relative path to the app root.
   */
  routesDirectory: string
  /**
   * The prefix to add to all routes. Defaults to '/'.
   */
  routePrefix?: string
}

const getRoutesDirectories = (opts: CreateRoutesOption[]) => {
  // the absolute root dir of the app
  const appDir = path.dirname(require?.main?.filename || __dirname)

  return opts.map((x) => {
    const routesDirectory = x.routesDirectory.includes(appDir)
      ? x.routesDirectory
      : path.join(appDir, x.routesDirectory)
    return {
      routesDirectory,
      routePrefix: x.routePrefix || '/',
      // get the postix directory so it works in windows and unix
      postixDir: routesDirectory.split(path.sep).join(path.posix.sep)
    }
  })
}

/** Create all the routes and register them in the express app */
export const createRoutes = async (app: Express, options?: CreateRoutesOption | CreateRoutesOption[]) => {
  // make sure options are always an array with the default
  let optionsArray: CreateRoutesOption[] = []

  if (options) {
    optionsArray = Array.isArray(options) ? options : [options]
  } else {
    optionsArray = [{ routesDirectory: 'routes', routePrefix: '/' }]
  }

  // get all the file paths
  const directories = getRoutesDirectories(optionsArray)
  const filePathsArray = await Promise.all(
    directories.map(async (x) => {
      const filePaths = await getFilePaths(x.routesDirectory)
      return filePaths.map((path) => ({
        routesDirectory: x.routesDirectory,
        routePrefix: x.routePrefix,
        filePath: path,
        postixDir: x.postixDir
      }))
    })
  )

  const filePaths = Array.prototype.concat(...filePathsArray) as {
    routesDirectory: string
    routePrefix: string
    filePath: string
    postixDir: string
  }[]

  // sort the paths so dynamic routes come last - this is important so that
  // express handles static routes before dynamic routes
  const sortedFilePaths = filePaths.sort((a, b) => {
    const aIsDynamic = a.filePath.includes(':') || a.filePath.includes('_')
    const bIsDynamic = b.filePath.includes(':') || b.filePath.includes('_')
    return aIsDynamic && bIsDynamic ? 0 : aIsDynamic ? 1 : -1
  })

  // these are the supported route methods
  const supportedKeys: RouteTypes[] = [
    'delete',
    'get',
    'post',
    'put',
    'options',
    'head',
    'connect',
    'trace',
    'patch'
  ]

  // loop over the paths
  sortedFilePaths.forEach((p) => {
    // make the route path from the file path
    const routePath = makeRoutePathFromFilePath(p.filePath, p.postixDir, p.routePrefix)

    // require the file
    const definition = require(p.filePath)
    // see if the export is the default export
    const isDefault = Object.prototype.hasOwnProperty.call(definition, 'default')
    // get the routes either by default export or named exports
    const routes: DefineRoutesOptions = isDefault ? definition.default : definition

    // loop over the supported keys and register any moethods that are exported by the route definition
    supportedKeys.forEach((key) => {
      const route = routes[key]
      if (route) {
        // parse the handlers
        const handlers = parseRouteHandlers(route)
        // add them to express
        app[key](routePath, ...handlers)
      }
    })
  })

  // set up the validation error handling so it returns nicer errors
  app.use(validationErrorHandler)

  // return express
  return app
}
