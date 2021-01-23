import { Request, Response, NextFunction } from 'express'

export function autoCatch (middleware: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    middleware(req, res, next).catch(next)
  }
}
