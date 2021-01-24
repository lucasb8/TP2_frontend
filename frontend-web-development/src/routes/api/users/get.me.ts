import { Request, Response } from 'express'
import { route } from '../../../docs/routes'

route(getMe, 'GET', '/api/users/me', 'Users', 'Get user (me)')
export default async function getMe (req: Request, res: Response) {
  res.json(req.user)
}
