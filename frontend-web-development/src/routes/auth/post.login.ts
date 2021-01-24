import { Request, Response } from 'express'
import { mandatory, route, sanetizeBody } from '../../docs/routes'
import User from '../../models/user'
import * as util from 'util'
import * as bcrypt from 'bcrypt'
import PrintableError from '../../printable-error'

export interface Auth$LoginParams {
  email: string
  password: string
}

route(login, 'POST', '/auth/login', 'Authentification', 'Login')
mandatory(login, 'email', 'string', 'Email of a valid user account')
mandatory(login, 'password', 'string', 'Password of the same user')
export default async function login (req: Request, res: Response) {
  const safeBody: Auth$LoginParams = sanetizeBody(login, req.body)
  const user = await User.q.findByEmail(safeBody.email)
  if (!user) throw new PrintableError(['No account found for this email.'])
  
  const validPassword = await bcrypt.compare(safeBody.password, user.passwordHash)
  if (!validPassword) throw new PrintableError(['Password is invalid.'])

  req.user = user
  req.session.userId = user.id
  await util.promisify(req.session.save.bind(req.session))()
  res.json({ success: true })
}
