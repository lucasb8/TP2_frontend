import MySQLStore from '../../mysql-store'
import { postLoginSpec } from './auth/post.login.spec'
import { getApiUsersMe } from './api/users/get.me.spec'
import { getApiUsersIndex } from './api/users/get.index.spec'

describe('APIs', () => {
  beforeEach(() => MySQLStore.reset())
  after(() => MySQLStore.close())

  postLoginSpec()
  getApiUsersMe()
  getApiUsersIndex()
})
