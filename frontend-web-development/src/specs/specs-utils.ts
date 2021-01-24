import * as _chai from 'chai'
import * as chaiHttp from 'chai-http'
import * as express from 'express'
import server from '../server'
import { userFactory } from './factories/user.factory'

_chai.use(chaiHttp)
_chai.should()

export const chai = _chai
export const expect = _chai.expect

let app: express.Express

export function getApp () {
  if (!app) app = express().use(setSessionInTestEnv).use(server())
  return app
}

export async function setSessionInTestEnv (req: express.Request, res: express.Response, next: express.NextFunction) {
  if (process.env.NODE_ENV !== 'test') throw new Error('Never call that in production! Authentification bypass.')

  if (req.headers.testauthbypassrole === 'customer') {
    req.session = { userId: await userFactory.create(), save: () => null as any, destroy: () => null as any } as any
  }

  next()
}
