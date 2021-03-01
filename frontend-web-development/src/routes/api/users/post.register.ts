import { Request, Response } from 'express'
import PrintableError from '../../../printable-error'
import { params, route, sanetizeBody } from '../../../docs/routes'
import User from '../../../models/user'
import Commit from '../../../models/commit'
import * as bcrypt from 'bcrypt'
import EmployeeInformation from '../../../models/employee-information'

const allowedRoles = ['customer', 'employee']

export type Users$RegisterParams = {
  email: string
  password: string
  firstname: string
  lastname: string
} & (
  { role: 'customer' } |
  {
    role: 'employee', 
    employeeInformation: {
      latitude: number
      longitude: number
    }
  }
)

route(register, 'POST', '/api/users/register', 'Users', 'Register', 'Designed for self registration of customers and employees.')
params(register, { key: 'email', type: 'string', required: true, desc: 'Valid email address' })
params(register, { key: 'password', type: 'string', required: true, desc: 'Password of the new user' })
params(register, { key: 'firstname', type: 'string', required: true, desc: 'Firstname of the new user' })
params(register, { key: 'lastname', type: 'string', required: true, desc: 'Lastname of the new user' })
params(register, { key: 'role', type: 'string', required: true, desc: `Role of the self-registering user. Can be one of [${allowedRoles.join(', ')}].` })
params(register, { key: 'employeeInformation', type: 'object', required: false, desc: 'For role=employee only' })
params(register, { key: 'employeeInformation.latitude', type: 'number', required: true, desc: 'Latitude of the intervention center' })
params(register, { key: 'employeeInformation.longitude', type: 'number', required: true, desc: 'Longitude of the intervention center' })
export default async function register (req: Request & { conn: any }, res: Response) {
  const safeBody: Users$RegisterParams = sanetizeBody(register, req.body)
  if (!allowedRoles.includes(safeBody.role)) throw new PrintableError(['This role is not permitted for self registration.'])

  const commit = await Commit.upsertCommit(null, req.conn)
  const [id] = await User.create([{
    email: safeBody.email,
    role: safeBody.role,
    passwordHash: await bcrypt.hash(safeBody.password, 12),
    firstname: safeBody.firstname,
    lastname: safeBody.lastname
  }], commit.id, { getId: true, conn: req.conn })

  if (safeBody.role === 'employee') await EmployeeInformation.create([{ ...safeBody.employeeInformation, employeeId: id }], commit.id, { conn: req.conn })
  res.json(await User.q.withConnection(req.conn).find(id))
}
