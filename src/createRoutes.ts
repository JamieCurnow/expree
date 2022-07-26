import { OpenAPIGenerator, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import { Express } from 'express'
import * as path from 'path'
import { getFilePaths } from './getFilePaths'
import { makeRoutePathFromFilePath } from './makeRoutePathFromFilePath'
import { parseRouteHandlers } from './parseRouteHandlers'
import { DefineRoutesOptions, RouteTypes } from './types'
import swaggerUi from 'swagger-ui-express'
import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
extendZodWithOpenApi(z)

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

  /**
   * The swagger docs definition generator. Uses: https://github.com/asteasolutions/zod-to-openapi
   * @example
   *
   * ```ts
   * generateSwaggerDocument(generator) {
   *   return generator.generateDocument({
   *    openapi: '3.0.0',
   *    info: {
   *      version: '1.0.0',
   *        title: 'My API',
   *        description: 'This is the API'
   *    }
   *  })
   * }
   * ```
   */
  generateSwaggerDocument?: (generator: OpenAPIGenerator) => ReturnType<OpenAPIGenerator['generateDocument']>

  /** The route path that the docs should be hosted at. Defualts to '/docs' */
  swaggerDocsPath?: string
}

type CreateRoutesOptionWithSwagger = CreateRoutesOption & { swaggerRegistry?: OpenAPIRegistry }

const getRoutesDirectories = (opts: CreateRoutesOptionWithSwagger[]) => {
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
      postixDir: routesDirectory.split(path.sep).join(path.posix.sep),
      registry: x.swaggerRegistry
    }
  })
}

/** Create all the routes and register them in the express app */
export const createRoutes = async (app: Express, options?: CreateRoutesOption | CreateRoutesOption[]) => {
  // make sure options are always an array with the default
  let optionsArray: Array<CreateRoutesOptionWithSwagger> = []

  if (options) {
    optionsArray = Array.isArray(options) ? options : [options]
  } else {
    optionsArray = [{ routesDirectory: 'routes', routePrefix: '/' }]
  }

  // Add a swagger registry to each options
  optionsArray.forEach((option) => {
    if (typeof option.generateSwaggerDocument === 'function') {
      option.swaggerRegistry = new OpenAPIRegistry()
    }
  })

  // get all the file paths
  const directories = getRoutesDirectories(optionsArray)
  const filePathsArray = await Promise.all(
    directories.map(async (x) => {
      const filePaths = await getFilePaths(x.routesDirectory)
      return filePaths.map((path) => ({
        routesDirectory: x.routesDirectory,
        routePrefix: x.routePrefix,
        filePath: path,
        postixDir: x.postixDir,
        registry: x.registry
      }))
    })
  )

  const filePaths = Array.prototype.concat(...filePathsArray) as {
    routesDirectory: string
    routePrefix: string
    filePath: string
    postixDir: string
    registry?: OpenAPIRegistry
  }[]

  // sort the paths so dynamic routes come last - this is important so that
  // express handles static routes before dynamic routes
  const sortedFilePaths = filePaths.sort((a, b) => {
    const aIsDynamic = a.filePath.includes(':') || a.filePath.includes('_')
    const bIsDynamic = b.filePath.includes(':') || b.filePath.includes('_')
    return aIsDynamic && bIsDynamic ? 0 : aIsDynamic ? 1 : -1
  })

  // these are the supported route methods
  const supportedKeys: RouteTypes[] = ['get', 'post', 'put', 'delete', 'patch']

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
        const handlers = parseRouteHandlers(route, z)
        //if the route has swagger docs add it to the registry
        if (typeof route.swaggerZod === 'function') {
          if (p.registry) {
            route.swaggerZod(p.registry, { path: routePath, method: key }, z)
          } else {
            console.error(
              `route.swaggerZod was defined for path "${routePath}" but no generateSwaggerDocument function was found in the createRoutes option`
            )
          }
        }
        // add them to express
        app[key](routePath, ...handlers)
      }
    })
  })

  optionsArray.forEach((option) => {
    if (typeof option.generateSwaggerDocument === 'function' && option.swaggerRegistry) {
      console.log(option)
      const generator = new OpenAPIGenerator(option.swaggerRegistry.definitions)
      const document = option.generateSwaggerDocument(generator)
      // app.use(option.swaggerDocsPath || '/docs', swaggerUi.serve, swaggerUi.setup(document))
      app.use(option.swaggerDocsPath || '/docs', swaggerUi.serveFiles(document), swaggerUi.setup(document))
    }
  })

  // return express
  return app
}
