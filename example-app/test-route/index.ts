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

const QuerySchema = z
  .object({
    something: z.string().openapi({
      description: 'The query param `something`'
    })
  })
  .strict()

type Query = z.infer<typeof QuerySchema>

export const post = defineRoute<ReqBody, Res, {}, Query>({
  validate: () => ({
    body: ReqBodySchema,
    query: QuerySchema
  }),

  swaggerZod(registry) {
    const ReqBodyRegistrySchema = registry.register('ReqBody', z.object(ReqBodySchema.shape))
    const ResRegistrySchema = registry.register('Res', ResSchema)
    const QuerySchemaRegistrySchema = registry.register('QuerySchema', z.object(QuerySchema.shape))

    registry.registerPath({
      method: 'post',
      path: '/test-route',
      description: 'Post a `ReqBody` object to test the Zod validation',
      summary: 'Test post body validation',
      request: {
        body: ReqBodyRegistrySchema.openapi({ description: 'The req body object' }),
        query: QuerySchemaRegistrySchema.openapi({ description: 'The query params for the request' })
      },
      responses: {
        200: {
          mediaType: 'application/json',
          schema: ResRegistrySchema.openapi({ description: 'The string "ok"' })
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
