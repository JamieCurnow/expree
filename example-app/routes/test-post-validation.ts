import { defineRoute } from '../../src'
import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
extendZodWithOpenApi(z)

const PostBodySchema = z
  .object({
    /** The uid of the doc */
    uid: z.string().openapi({
      example: '409124908118321',
      description: 'The uid of the doc'
    }),
    /** The users first name */
    firstName: z.string().openapi({
      example: 'Bob',
      description: 'The users first name'
    }),
    /** The users last name */
    lastName: z.string().optional().openapi({
      example: 'Bobson',
      description: 'The users last name'
    }),
    /** The users height in cm */
    height: z.number().optional().openapi({
      example: 172,
      description: 'The users height in cm'
    }),
    /** Is the user a user? */
    isUser: z.boolean().openapi({
      description: 'Is the user a user?'
    })
  })
  .strict()

type PostBody = z.infer<typeof PostBodySchema>

const ResSchema = z.string().openapi({
  description: 'The string "Ok"',
  example: 'Ok'
})
type Res = z.infer<typeof ResSchema>

export const post = defineRoute<PostBody, Res>({
  validate: () => {
    return {
      body: PostBodySchema
    }
  },
  swaggerZod(registry) {
    const PostBodyRegistrySchema = registry.register('PostBody', z.object(PostBodySchema.shape))
    const ResRegistrySchema = registry.register('Res', ResSchema)

    registry.registerPath({
      method: 'post',
      path: '/test-post-validation',
      description: 'Post a `PostBody` object to test the Zod validation',
      summary: 'Test post body validation',
      request: {
        body: PostBodyRegistrySchema.openapi({ description: 'The post body object' })
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
    const { isUser } = req.body
    console.log({ isUser })
    return 'Ok'
  }
})
