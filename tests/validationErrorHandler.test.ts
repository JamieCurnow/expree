import { describe, expect, test } from 'vitest'
import { validationErrorHandler } from '../src/validationErrorHandler'
import { res } from './mockRes'
import { ValidationErrorItem } from 'joi'
import { ValidationError } from 'express-validation'

describe('validationErrorHandler', () => {
  test('should return the validation error messages', () => {
    const details: { body: ValidationErrorItem[] } = {
      body: [
        {
          message: '"firstName" must be an object',
          path: ['someObject', 'firstName'],
          type: 'object.type',
          context: { label: 'body', key: 'body', value: undefined }
        }
      ]
    }

    // express-validation types are incorrect
    // @ts-ignore-next-line
    const err = new ValidationError(details, {
      statusCode: 400
    })

    const result = validationErrorHandler(err, null, res, null)

    expect(result).toEqual({
      ...err,
      details: {
        body: [
          {
            message: '"firstName" must be an object',
            path: 'someObject.firstName'
          }
        ]
      }
    })
  })
})
