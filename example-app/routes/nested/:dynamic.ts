import { defineRoute } from '../../../src'

interface Params {
  dynamic: string
}

export const get = defineRoute<{}, string, Params>({
  handler({ params }) {
    const { dynamic } = params
    return `Hello ${dynamic}`
  }
})