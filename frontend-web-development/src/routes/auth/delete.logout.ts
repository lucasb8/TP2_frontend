import { Request, Response } from 'express'
import { route } from '../../docs/routes'

route(logout, 'DELETE', '/auth/logout', 'Authentification', 'Logout')
export default async function logout (req: Request, res: Response) {
  req.session.destroy(null)
  res.json({ success: true })
}
