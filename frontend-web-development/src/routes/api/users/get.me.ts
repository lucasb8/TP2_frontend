import { Request, Response } from 'express'
import { route } from '../../../docs/routes'

route(getMe, 'GET', '/api/users/me', 'Users', 'Get me', 'Returns information about yourself (the currently logged user). Also usefull to check if user is authenticated.')
export default async function getMe (req: Request, res: Response) {
  res.json(req.user)
}
