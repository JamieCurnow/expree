import { defineRoute } from '../../src'
import { z } from 'zod'

const UserSchema = z.object({
  /** The user's email address - should be the same as their auth account */
  email: z.string().email(),

  /** Has the user verified their email? */
  emailVerified: z.boolean(),

  /** The user's first name */
  firstName: z.string().optional(),

  /** The user's last name */
  lastName: z.string().optional()
})

type User = z.infer<typeof UserSchema>

const ResSchema = z.string().openapi({
  description: 'The string "Ok"',
  example: 'Ok'
})
type Res = z.infer<typeof ResSchema>

export const post = defineRoute<User, Res>({
  validate: (z) => {
    return {
      body: z.object(UserSchema.shape)
    }
  },
  swaggerZod(registry, meta) {
    registry.registerPath({
      ...meta,
      description: 'Post a `User` object to test the Zod validation',
      summary: 'Test post body validation',
      request: {
        body: UserSchema.openapi({ description: 'The user input body object' })
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
    // const { isUser } = req.body
    console.log(req.body)
    return 'Ok'
  }
})
