import { defineRoute } from '../../src'
import { z } from 'zod'

const ReqBodySchema = z.object({
  requiredThing: z.boolean(),
  anotherThing: z.string(),
  someObject: z
    .object({
      someKeyInObject: z.string()
    })
    .required()
}).strict()

type ReqBody = z.infer<typeof ReqBodySchema>

const ResSchema = z.string()
type Res = z.infer<typeof ResSchema>

const QuerySchema = z.object({
  something: z.string()
}).strict()

type Query = z.infer<typeof QuerySchema>

export const post = defineRoute<ReqBody, Res, {}, Query>({
  validate: () => ({
    body: ReqBodySchema,
    query: QuerySchema
  }),

  async handler(req, res) {
    const { requiredThing } = req.body
    console.log({ requiredThing })
    return 'Ok'
  }
})
