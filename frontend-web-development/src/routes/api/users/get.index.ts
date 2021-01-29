import { Request, Response } from 'express'
import { route } from '../../../docs/routes'
import User from '../../../models/user'

route(getIndex, 'GET', '/api/users', 'Users', 'List users', 'Returns users the current_user can see. Operator can list all users.')
export default async function getIndex (req: Request, res: Response) {
  res.json(await User.policy.getScope(req.user).toArray())
}
