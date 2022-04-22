import { Response } from 'express'

export const res = {
  status(code: number) {
    console.log('status', code)
    return this
  },
  send(data: any) {
    return data
  },
  json(data: any) {
    return data
  }
} as Response
