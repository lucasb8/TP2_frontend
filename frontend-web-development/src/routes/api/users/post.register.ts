import { Request, Response } from 'express'
import PrintableError from '../../../printable-error'
import { mandatory, route, sanetizeBody } from '../../../docs/routes'
import User from '../../../models/user'
import Commit from '../../../models/commit'
import * as bcrypt from 'bcrypt'

const allowedRoles = ['customer', 'employee']
export interface Users$RegisterParams {
  email: string
  password: string
  role: 'customer' | 'employee'
  firstname: string
  lastname: string
}

route(register, 'POST', '/api/users/register', 'Users', 'Register', 'Designed for self registration of customers and employees.')
mandatory(register, 'email', 'string', 'Valid email address')
mandatory(register, 'password', 'string', 'Password of the new user')
mandatory(register, 'firstname', 'string', 'Firstname of the new user')
mandatory(register, 'lastname', 'string', 'Lastname of the new user')
mandatory(register, 'role', 'string', `Role of the self-registering user. Can be one of [${allowedRoles.join(', ')}].`)
export default async function register (req: Request, res: Response) {
  const safeBody: Users$RegisterParams = sanetizeBody(register, req.body)
  if (!allowedRoles.includes(safeBody.role)) throw new PrintableError(['This role is not permitted for self registration.'])
  const commit = await Commit.upsertCommit(null)
  
  const [id] = await User.create([{
    email: safeBody.email,
    role: safeBody.role,
    passwordHash: await bcrypt.hash(safeBody.password, 12),
    firstname: safeBody.firstname,
    lastname: safeBody.lastname
  }], commit.id, { getId: true })

  res.json(await User.q.find(id))
}
