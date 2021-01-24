import MySQLStore from '../../mysql-store'
import { postLoginSpec } from './auth/post.login.spec'

describe('APIs', () => {
  beforeEach(() => MySQLStore.reset())
  after(() => MySQLStore.close())

  postLoginSpec()
})
