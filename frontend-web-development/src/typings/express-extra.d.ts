import { Request } from 'express'
import { Session } from 'express-session'

declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    userId?: number
  }
}
