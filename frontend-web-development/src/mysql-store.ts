import config from './config'
import * as mysql from 'mysql2/promise'
import Utils from './utils'

export default class MySQLStore {
  public static connection: any

  static async init (env: 'prod' | 'test' = 'prod', runTrigger = env === 'prod') {
    this.connection = await mysql.createPool({
      ...config.mysql,
      database: config.mysql.database + (env === 'test' ? '_test' : ''),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      multipleStatements: true
    })

    if (runTrigger) await this.prepareTriggers()
  }

  static async close () {
    if (this.connection) this.connection.end()
    this.connection = null
  }

  static async reset () {
    if (!this.connection) await this.init('test')
    const models = (await import('./models/model-by-name')).getModelsInDependencyOrder()
    const sql = `SET FOREIGN_KEY_CHECKS = 0; ${models.map((_: any) => 'DELETE FROM `' + _.className + '`;').join(' ')} SET FOREIGN_KEY_CHECKS = 1`
    await MySQLStore.connection.query(sql)
  }

  static async buildTables () {
    const models = (await import('./models/model-by-name')).getModelsInDependencyOrder()
    for (const model of models) await this.connection.query(model.toSqlTables())
    await this.connection.query((await import('./models/commit')).default.toSqlTables())
  }

  static async prepareTriggers () {
    Utils.debug(module, 'Upgrading SQL triggers...')
    const models = (await import('./models/model-by-name')).getModelsInDependencyOrder()
    for (const model of models) await this.connection.query(model.toSqlTriggers())
    Utils.debug(module, 'Triggers updated successfully')
  }

  static async rebuildDatabase (env: 'prod' | 'test' = 'test') {
    const database = config.mysql.database + (env === 'test' ? '_test' : '')
    await this.init(env, false)
    await this.connection.query(`DROP DATABASE ${database}; CREATE DATABASE ${database} CHARACTER SET = 'utf8mb4' COLLATE = 'utf8mb4_bin';`)
    await this.init(env, false)
    await this.buildTables()
    await this.prepareTriggers()
  }
}
