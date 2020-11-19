/**
 * Nested routes work as expected
 * index file names are ignored and are at the directory path eg:
 * 
 * File path: routes/nested/index === Route path '/nested'
 * File path: routes/nested/something === Route path '/nested/something'
 * File path: routes/nested/index/something === Route path '/nested/index/something' (why would you use index as a dir name?!)
 */

// Import helpers from expree
import { defineRoute } from '../../../src'
// Or in real life:
// import { defineRoute } from 'expree'

type Res = string
export const get = defineRoute<{}, Res>({
  async handler() {
    return 'OK'
  }
})
