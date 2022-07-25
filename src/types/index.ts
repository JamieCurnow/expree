import { RequestHandler, Request as ExpressRequest, Response as ExpressResponse } from 'express'

import { AnyZodObject } from 'zod'

/**
 * The definition of a single route.
 */
export interface RouteDefinition<Req = {}, Res = any, Params = {}, Query = {}> {
  /**
   * Add any middleware to the route
   */
  middleware?: RequestHandler[]
  /**
   * Add Zod validation to the route
   */
  validate?: () => {
    /** Zod schema for the body */
    body?: AnyZodObject
    /**  Zod schema for the route params */
    params?: AnyZodObject
    /**  Zod schema for the route query params */
    query?: AnyZodObject
  }
  /**
   * The route handler, has two arguments:
   *
   * req: The express request object
   * res: The express response object
   */
  handler?: (
    req: ExpressRequest<Params, Res, Req, Query>,
    res: ExpressResponse<Res>
  ) => Promise<Res | ExpressResponse<Res>> | Res | ExpressResponse<Res>
}

/** Just http method route types in a string union */
export type RouteTypes =
  | 'get'
  | 'post'
  | 'put'
  | 'delete'
  | 'options'
  | 'head'
  | 'connect'
  | 'trace'
  | 'patch'

/** A defined route */
export interface DefineRoute {
  <Req = {}, Res = any, Params = {}, Query = {}>(
    opts: RouteDefinition<Req, Res, Params, Query>
  ): RouteDefinition<Req, Res, Params, Query>
}

/** Options for defining more than 1 http method for the route */
export type DefineRoutesOptions = Partial<Record<RouteTypes, RouteDefinition<any, any, any, any>>>

/** The defineRoutes function as a type */
export interface DefineRoutes {
  (opts: DefineRoutesOptions): DefineRoutesOptions
}
