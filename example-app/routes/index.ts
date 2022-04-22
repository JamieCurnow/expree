import { defineRoute, defineRoutes } from '../../src'

interface PostReq {
  userId: string
}
type PostRes = string

export default defineRoutes({
  post: defineRoute<PostReq, PostRes>({
    handler(req, res) {
      return res.send('Hello World')
    }
  })
})
