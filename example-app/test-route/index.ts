import { defineRoute } from '../../src'

interface Req {
  requiredThing: boolean
}

export const post = defineRoute<Req, string>({
  validate: (joi) => ({
    body: {
      requiredThing: joi.boolean().required(),
      anotherThing: joi.string().required(),
      someObject: joi
        .object({
          someKeyInObject: joi.string().required()
        })
        .required()
    },
    query: {
      something: joi.string().required()
    }
  }),

  async handler(req, res) {
    const { requiredThing } = req.body
    console.log({ requiredThing })
    return 'Ok'
  }
})
