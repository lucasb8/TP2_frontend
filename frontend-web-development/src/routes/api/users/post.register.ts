import { Request, Response } from 'express'
import PrintableError from '../../../printable-error'
import { params, route, sanetizeBody } from '../../../docs/routes'
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
params(register, { key: 'email', type: 'string', required: true, desc: 'Valid email address' })
params(register, { key: 'password', type: 'string', required: true, desc: 'Password of the new user' })
params(register, { key: 'firstname', type: 'string', required: true, desc: 'Firstname of the new user' })
params(register, { key: 'lastname', type: 'string', required: true, desc: 'Lastname of the new user' })
params(register, { key: 'role', type: 'string', required: true, desc: `Role of the self-registering user. Can be one of [${allowedRoles.join(', ')}].` })
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
