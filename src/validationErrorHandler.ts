import { ErrorRequestHandler } from 'express'
import { ValidationError } from 'express-validation'
import { ValidationErrorItem } from 'joi'

const detailsKeys = ['body', 'cookies', 'headers', 'params', 'query', 'signedCookies'] as const
type DetailsKeys = typeof detailsKeys[number]

interface Detail {
  path: string
  message: string
}

type Details = {
  [key in DetailsKeys]?: Detail[]
}

/** Helper function for parsing error details */
const parseDetail = (detail: ValidationErrorItem[]): Detail[] => {
  return detail.map((x) => {
    return {
      path: x.path.join('.'),
      message: x.message
    }
  })
}

/** The validation error middleware makes the validation error messages nicer */
export const validationErrorHandler: ErrorRequestHandler = (err, _, res, __) => {
  if (err instanceof ValidationError) {
    const details: Details = {}

    detailsKeys.forEach((key) => {
      // These are types incorrectly in express-validation so we cast them
      const deet = err.details[key] as unknown as undefined | ValidationErrorItem[]
      if (deet) details[key] = parseDetail(deet)
    })

    return res.status(err.statusCode).json({ ...err, details })
  }

  return res.status(500).json(err)
}
