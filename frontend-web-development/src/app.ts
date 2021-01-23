import MySQLStore from './mysql-store'
import * as express from 'express'
import Utils from './utils'
import config from './config'
import server from './server'

async function run () {
  await MySQLStore.init()

  const app = express()
  app.use(server())
  app.listen(config.port, () => Utils.debug(module, `App listening on port ${config.port}...`))
}

run().catch(err => console.error(err))
