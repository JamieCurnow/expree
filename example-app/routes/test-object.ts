/**
 * Another way to write routes for a path is to
 * export defineRoute functions as consts named by their request type. eg:
 * export const post = defineRoute({ ... })
 * export const get = defineRoute({ ... })
 *
 * See ./test-default for a more detailed explanation of the defineRoute function
 */

import { defineRoute } from '../../src'
// Or in real life:
// import { defineRoute } from 'expree'

// POST:
// '/test-object'
interface PostReq { userId: string }
type PostRes = string

export const post = defineRoute<PostReq, PostRes>({
  async handler(req) {
    const { userId } = req.body
    return userId
  }
})

// GET:
// '/test-object'
interface GetReq { userId?: string }
type GetRes = boolean

export const get = defineRoute<GetReq, GetRes>({
  async handler(req) {
    const { userId } = req.body
    console.log(userId)
    return true
  }
})