import { DefineRoutes, DefineRoutesOptions } from './types'

/**
 * Define more than 1 http method for the route
 *
 * ```ts
 * export default defineRoutes({
 *   get: defineRoute({ //... }),
 *   put: defineRoute({ //... }),
 *   post: defineRoute({ //... }),
 * })
 * ```
 *
 */
export const defineRoutes: DefineRoutes = (opts) => opts
