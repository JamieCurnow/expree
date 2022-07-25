/**
 * This is just another example of nested variable routes
 * See ./index for more detailed example
 */

// Import helpers from expree
import { defineRoutes, defineRoute } from '../../../../src'
// Or in real life:
// import { defineRoute } from 'expree'

import { z } from 'zod'

const ParamsSchema = z.object({
  variable: z.string().optional()
})

type Params = z.infer<typeof ParamsSchema>

// Some route types at this path have the same validation
const validate = () => ({ params: ParamsSchema })

export default defineRoutes({
  get: defineRoute<{}, string, Params>({
    async handler({ params }) {
      const { variable } = params

      // Do some stuff
      console.log(variable)

      return `Here you go! ${variable}`
    }
  }),
  post: defineRoute<{}, string, Params>({
    validate,
    async handler({ params }) {
      // we can guarantee variable is there due to the validation function
      const { variable } = params

      // Do some stuff
      console.log(variable)

      return 'Thanks!'
    }
  }),
  put: defineRoute<{}, string, Params>({
    validate,
    async handler({ params }) {
      // we can guarantee variable is there due to the validation function
      const { variable } = params

      // Do some stuff
      console.log(variable)

      return 'Got it!'
    }
  }),
  delete: defineRoute<{}, string, Params>({
    validate,
    async handler({ params }) {
      // we can guarantee variable is there due to the validation function
      const { variable } = params

      // Do some stuff
      console.log(variable)

      return 'Womp!'
    }
  })
})
