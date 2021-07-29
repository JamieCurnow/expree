import { Express, RequestHandler, ErrorRequestHandler, Request as ExpReq, Response as ExpRes } from 'express'
import { validate as validator, ValidationError } from 'express-validation'
import * as fs from 'fs'
import * as Joi from 'joi'
import * as path from 'path'
const fsPromises = fs.promises

export interface Route<Req = {}, Res = any, Params = {}, Query = {}> {
  middleware?: RequestHandler[]
  validate?: (joi: typeof Joi) => {
    body?: Partial<Record<keyof Req, Joi.Schema>>
    params?: Partial<Record<keyof Params, Joi.Schema>>
    query?: Partial<Record<keyof Query, Joi.Schema>>
  }
  handler?: (req: ExpReq<Params, Res, Req, Query>, res: ExpRes<Res>) => Promise<Res | ExpRes<Res>> | Res | ExpRes<Res>
}


export type RouteTypes = 'get' | 'post' | 'put' | 'delete' | 'options' | 'head' | 'connect' | 'trace' | 'patch'
export type DefineRoutesOptions = Partial<Record<RouteTypes, ReturnType<typeof defineRoute>>>

export const defineRoutes = (opts: DefineRoutesOptions) => opts
export const defineRoute = <Req = {}, Res = any, Params = {}, Query = {}>(opts: Route<Req, Res, Params, Query>) => opts

// Parsing
export const parseRouteDefinition = (app: Express, path: string, route: Route, type: RouteTypes) => {
  const { handler, validate, middleware } = route

  // Error if no handler
  if (!handler) throw new Error(`No handler found for ${type} request at ${path}`)

  // Make an array to hold express handlers, including any middleware
  let handlers: RequestHandler[] = []

  // Add middleware if any
  if (middleware && middleware.length) handlers = middleware

  // Add validation middleware to the start of the array
  if (validate && typeof validate === 'function') {
    const validationObj = validate(Joi)
    const validationSchema = {
      body: validationObj.body ? Joi.object(validationObj.body) : undefined,
      query: validationObj.query ? Joi.object(validationObj.query) : undefined,
      params: validationObj.params ? Joi.object(validationObj.params) : undefined
    }
    handlers.unshift(validator(validationSchema, { context: true, keyByField: true }))
  }

  // Add the actual handler to the end of the array
  const handlerProcessor: RequestHandler = async (req, res) => {
    try {
      const result = await handler(req, res)
      return res.headersSent || res.send(result)
    } catch (e) {
      console.log(e)
      return res.headersSent || res.status(500).send('Server Error')
    }
  }
  handlers.push(handlerProcessor)

  // Add the route to express
  return app[type](path, ...handlers)
}

const appDir = path.dirname(require.main.filename)
const defaultDir = path.join(appDir, 'routes')

const getFilePaths = async (d: string): Promise<string[]> => {
  // get all files/folders in dir
  const list = await fsPromises.readdir(d, { withFileTypes: true })
  const filesArr = await Promise.all(list.map(x => {
    const res = path.resolve(d, x.name)
    return x.isDirectory() ? getFilePaths(res) : [res]
  }))
  return Array.prototype.concat(...filesArr).map(x => path.resolve(x))
}

const validationError: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    delete err.name
    const e = { code: 'validationError', message: 'Post body validation failed', details: {} as { [key: string]: string } }
    const details = err.details as { [key: string]: string }[]
    details.forEach((deet) => {
      for (let key in deet) {
        if (e.details[key]) {
          e.details[key] = e.details[key] + ` | ${deet[key]}`
        } else {
          e.details[key] = deet[key]
        }
      }
    })
    return res.status(400).send(e)
  }
  return res.status(500).send(err)
}

const setupValidationError = (app: Express) => {
  app.use(validationError)
}

export const createRoutes = async (app: Express, dir?: string) => {
  const d: string = dir || defaultDir
  const filePaths = await getFilePaths(d)
  console.log({ filePaths })
  // sort the paths so dynamic routes come last
  const sortedFilePaths = filePaths.sort((a, b) => {
    const aIsDynamic = a.includes(':') || a.includes('_')
    const bIsDynamic = b.includes(':') || b.includes('_')
    return aIsDynamic && bIsDynamic ? 0 : aIsDynamic ? 1 : -1
  })
  sortedFilePaths.forEach((path) => {
    const routePath = path
      // remove directory path
      .split(d).join('')
      // Remove file extension
      .split('.').slice(0, -1).join('.')
      // remove index
      .split('/index').join('')
      // replace /_ with /: for dynamic routes
      .split('/_').join('/:')
    const definition = require(path)
    const isDefault = Object.prototype.hasOwnProperty.call(definition, 'default')
    const routes: ReturnType<typeof defineRoutes> = isDefault ? definition.default : definition
    const supportedKeys: RouteTypes[] = ['delete', 'get', 'post', 'put']
    supportedKeys.forEach((key) => {
      const route = routes[key]
      if (route) parseRouteDefinition(app, routePath, route, key)
    })
  })
  setupValidationError(app)
  return app
}