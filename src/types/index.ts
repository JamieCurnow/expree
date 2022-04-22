import { RequestHandler, Request as ExpressRequest, Response as ExpressRespons } from 'express'

import Joi from 'joi'

/**
 * The definition of a single route.
 */
export interface RouteDefinition<Req = {}, Res = any, Params = {}, Query = {}> {
  /**
   * Add any middleware to the route
   */
  middleware?: RequestHandler[]
  /**
   * Add Joi validation to the route
   */
  validate?: (joi: typeof Joi) => {
    /** Validation for the body */
    body?: Partial<Record<keyof Req, Joi.Schema>>
    /** Validation for the route params */
    params?: Partial<Record<keyof Params, Joi.Schema>>
    /** Validation for the route query params */
    query?: Partial<Record<keyof Query, Joi.Schema>>
  }
  /**
   * The route handler, has two arguments:
   *
   * req: The express request object
   * res: The express response object
   */
  handler?: (
    req: ExpressRequest<Params, Res, Req, Query>,
    res: ExpressRespons<Res>
  ) => Promise<Res | ExpressRespons<Res>> | Res | ExpressRespons<Res>
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
export type DefineRoutesOptions = Partial<Record<RouteTypes, ReturnType<DefineRoute>>>

/** The defineRoutes function as a type */
export interface DefineRoutes {
  (opts: DefineRoutesOptions): DefineRoutesOptions
}
