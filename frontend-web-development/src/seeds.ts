import MySQLStore from './mysql-store'
import { userFactory } from './specs/factories/user.factory'

async function run () {
  await MySQLStore.init()

  // users
  await userFactory.create({ email: 'operator@cleaning.com', role: 'operator' })
  await userFactory.create({ email: 'customer@cleaning.com', role: 'customer' })
  await userFactory.create({ email: 'employee@cleaning.com', role: 'employee' })

  MySQLStore.connection.end()
}

run().catch(err => console.error(err))
