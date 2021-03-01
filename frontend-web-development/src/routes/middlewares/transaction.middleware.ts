import { Request, Response, NextFunction } from 'express'
import MySQLStore from '../../mysql-store'

export function encapsulateInTransaction (middleware: any) {
  return async (req: Request & { conn: any }, res: Response, next: NextFunction) => {
    try {
      req.conn = await MySQLStore.connection.getConnection()
      await req.conn.query('START TRANSACTION')
      await middleware(req, res, next)
      await req.conn.commit()
    } catch (err) {
      await req.conn?.query('ROLLBACK')
      next(err)
    } finally {
      await req.conn?.release()
      delete req.conn
    }
  }
}
