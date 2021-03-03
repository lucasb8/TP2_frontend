import { loadSession } from './routes/middlewares/load-session.middleware'
import * as bodyParser from 'body-parser'
import * as express from 'express'
import * as session from 'express-session'
import * as SessionStorage from 'express-mysql-session'
import * as morgan from 'morgan'
import * as fs from 'fs'
import MySQLStore from './mysql-store'
import config from './config'
import authRoutes from './routes/auth/routes'
import apiRoutes from './routes/api/routes'
import PrintableError from './printable-error'
import Utils from './utils'

export default () => {
  const assetsPath = autoDetectAssetsPath()
  const cookieParser = session({
    secret: config.cookies.encryptionKey,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: config.cookies.secure, maxAge: 90 * 24 * 3600 * 1000 },
    store: new SessionStorage({ expiration: config.cookies.maxAgeInDays * 24 * 3600 * 1000 }, MySQLStore.connection)
  })

  const router = express.Router()

  if (process.env.NODE_ENV !== 'test') {
    router.use(morgan(
      ':date :method :url :status :response-time ms - :res[content-length]',
      { skip: (req: express.Request) => req.baseUrl && req.baseUrl.startsWith('/assets') || req.url === '/' }
    ))
  }

  router.use(bodyParser.json({ limit: '5mb' }))
  router.use(bodyParser.urlencoded({ extended: true }))
  router.use(cookieParser)
  router.use(loadSession)
  router.use(overrideResponseJsonSerializer)

  router.use('/docs', express.static('build/docs'))
  router.use('/auth', authRoutes)
  router.use('/api', apiRoutes)
  router.use(express.static(assetsPath))

  // serve static files (static files contains .)
  router.get('*.*', express.static(assetsPath, { maxAge: '1y' }));

  // serve angular bundle when loading an angular route (routes unknown by server)
  router.get('*', (req, res) => res.status(200).sendFile('/', { root: assetsPath }))

  router.use(logFailedRequest)

  return router
}

async function overrideResponseJsonSerializer (req: express.Request, res: express.Response, next: express.NextFunction) {
  res.json = (data: any) => {
    const json = JSON.stringify(data, (key: string, value: any) => {
      if (key === 'jointure') return undefined

      if (value && value.constructor && value.constructor.policy) {
        return value.constructor.policy.serialize(req.user, value)
      }

      if (value && value.id && value.editCommitId) {
        throw new Error('JSON serializer cannot find policy to apply')
      }

      return value
    })

    return res.contentType('application/json').send(json)
  }

  next()
}

async function logFailedRequest (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
  if (err instanceof PrintableError) res.status(400).json({ messages: err.messages })
  else { console.log(err); next(err) }
}

function autoDetectAssetsPath () {
  try {
    const results = fs.readdirSync('build/frontend/dist').filter(path => path !== '.' && path !== '..')

    if (results.length === 1) return `build/frontend/dist/${results[0]}`
    else if (results.length === 0) Utils.debug(module, 'Failed to find assets folder. Use build/frontend/dist/frontend instead')
    else Utils.debug(module, 'Ambiguous assets folder. Use build/frontend/dist/frontend instead')
  } catch (err) {
    Utils.debug(module, err.message)
  }

  return 'build/frontend/dist/frontend'
}
