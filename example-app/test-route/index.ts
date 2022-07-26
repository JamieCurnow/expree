import { defineRoute } from '../../src'
import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
extendZodWithOpenApi(z)

const ReqBodySchema = z
  .object({
    requiredThing: z.boolean().openapi({
      description: 'A thing that is required'
    }),
    anotherThing: z.string().openapi({
      description: 'Another thing that is a string',
      example: 'Hello world!'
    }),
    someObject: z
      .object({
        someKeyInObject: z.string().openapi({
          description: 'A key in the some object',
          example: 'foo'
        })
      })
      .required()
      .openapi({
        description: 'Another required object',
        example: { someKeyInObject: 'foo' }
      })
  })
  .strict()

type ReqBody = z.infer<typeof ReqBodySchema>

const ResSchema = z.string().openapi({
  description: 'The response schema',
  example: 'Example string'
})
type Res = z.infer<typeof ResSchema>

const QuerySchema = z.object({
  something: z.string().openapi({
    description: 'The query param `something`'
  })
})

type Query = z.infer<typeof QuerySchema>

export const post = defineRoute<ReqBody, Res, {}, Query>({
  validate: () => ({
    body: ReqBodySchema,
    query: QuerySchema
  }),

  swaggerZod(registry, meta) {
    registry.registerPath({
      ...meta,
      description: 'Post a `ReqBody` object to test the Zod validation',
      summary: 'Test post body validation',
      request: {
        body: ReqBodySchema.openapi({ description: 'The req body object' }),
        query: QuerySchema.openapi({ description: 'The query params for the request' })
      },
      responses: {
        200: {
          mediaType: 'application/json',
          schema: ResSchema.openapi({ description: 'The string "ok"' })
        }
      }
    })
  },

  async handler(req, res) {
    const { requiredThing } = req.body
    console.log({ requiredThing })
    return 'Ok'
  }
})
