import { Request, Response, NextFunction } from 'express'
import User from '../../models/user'

/** Si une session est valide, initialise req.user: User */
export async function loadSession (req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) return next()

  const user = await User.q.find(req.session.userId)
  if (!user) return next()

  req.user = user
  next()
}
