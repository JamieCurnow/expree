/**
 * Route params also work as expected - using a colon to name a file or folder will
 * make that part of the route into an express route param
 * 
 * eg:
 * File path: routes/nested/:variable/index
 * Route path = /nested/:variable
 * Route params = { variable: string }
 * Hit route /nested/something
 * route.params.variable === 'something' // true
 * 
 * eg:
 * File path: routes/user/:id/get
 * Route path = /user/:userId/get
 * Route params = { userId: string }
 * Hit route /user/1234bhu/get
 * route.params.userId === '1234bhu' // true
 * 
 * eg:
 * File path: routes/user/:userId/post/:postId/index
 * Route path = /user/:userId/post/:postId
 * Route params = { userId: string, postId: string }
 * Hit route /user/1234bhu/post/6789oon
 * route.params.userId === '1234bhu' // true
 * route.params.postId === '6789oon' // true
 */

// Import helpers from expree
import { defineRoute } from '../../../../src'
// Or in real life:
// import { defineRoute } from 'expree'

interface Req {
  some: boolean
  post: string
  data: number
}
type Res = string

// Make sure you type your Params correctly
interface Params { variable: string }

export const post = defineRoute<Req, Res, Params>({
  async handler({ body, params }, { status }) {
    const { some, post, data } = body
    const { variable } = params

    if (!some) {
      status(401)
      return 'Oops!'
    }

    if (post !== variable) {
      status(400)
      return 'Dang!'
    }

    return `${post}-${data + 1}`
  }
})
