import { defineRoute } from '../../src'
import { z } from 'zod'

const PostBodySchema = z
  .object({
    /** The uid of the doc */
    uid: z.string(),
    /** The users first name */
    firstName: z.string(),
    /** The users last name */
    lastName: z.string().optional(),
    /** The users height in cm */
    height: z.number().optional(),
    /** Is the user a user? */
    isUser: z.boolean()
  })
  .strict()

type PostBody = z.infer<typeof PostBodySchema>

const ResSchema = z.string()
type Res = z.infer<typeof ResSchema>

export const post = defineRoute<PostBody, Res>({
  validate: () => {
    return {
      body: PostBodySchema
    }
  },

  async handler(req, res) {
    const { isUser } = req.body
    console.log({ isUser })
    return 'Ok'
  }
})
