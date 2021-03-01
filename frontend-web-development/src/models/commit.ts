import MySQLStore from '../mysql-store'
import { IGetAll } from 'node-asuran-db/lib/model'
import User from './user'

export default class Commit {
  static async getAll ({ where, conn }: IGetAll & { conn?: any } = {}) {
    if (typeof where === 'undefined') where = { sql: '', bindings: [] }
    const sql = 'SELECT * FROM `Commit`' + (where.sql.length ? ' WHERE ' + where.sql : '') + ' ORDER BY `Commit`.`id` ASC'
    const [rows] = await (conn || MySQLStore.connection).query(sql, where.bindings) as any[][]
    return rows.map(_ => new Commit(_.id, _.author, _.message, _.openedAt, _.closedAt))
  }

  static async upsertCommit (user: User, conn = MySQLStore.connection) {
    const where = { where: { sql: 'author = ? AND closedAt IS NULL', bindings: [user?.email || 'internal'] } }
    const existing = (await this.getAll(where))[0]
    if (existing) return existing

    await this.create({ author: user?.email || 'internal', message: null }, conn)
    return (await this.getAll(where))[0]
  }

  static async create (body: { author: string, message: string }, conn = MySQLStore.connection) {
    await conn.query('INSERT INTO Commit (author, message) VALUES (?, ?)', [ body.author, body.message ])
  }

  static async close (id: number, message: string, conn = MySQLStore.connection) {
    await conn.query('UPDATE Commit SET message = ?, closedAt = NOW() WHERE id = ?', [message, id])
  }

  static toSqlTables () {
    const comment = `-- ---------------------- Commit ----------------------`

    const tableSql = 'CREATE TABLE `Commit` (\n' +
      '`id` int(11) NOT NULL,\n' +
      '`author` varchar(64) NOT NULL,\n' +
      '`message` text DEFAULT NULL,\n' +
      '`openedAt` datetime NOT NULL DEFAULT current_timestamp(),\n' +
      '`closedAt` datetime DEFAULT NULL\n' +
      ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;'

    const indexes = 'ALTER TABLE `Commit` ADD PRIMARY KEY (`id`);'
    const autoinc = 'ALTER TABLE `Commit` CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT;'

    return [comment, tableSql, indexes, autoinc].join('\n\n')
  }

  constructor (public id: number, public author: string, public message: string, public openedAt: number, public closedAt: number) {}
}
