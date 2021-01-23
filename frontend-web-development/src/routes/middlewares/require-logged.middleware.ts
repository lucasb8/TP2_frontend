import { Request, Response, NextFunction } from 'express'

export function requireLogged (req: Request, res: Response, next: NextFunction) {
  if (req.user) next()
  else res.status(403).json({ messages: ["Please login."] })
}
