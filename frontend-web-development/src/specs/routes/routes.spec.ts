import MySQLStore from '../../mysql-store'
import { postLoginSpec } from './auth/post.login.spec'
import { deleteLogoutSpec } from './auth/delete.logout.spec'
import { getApiUsersMe } from './api/users/get.me.spec'
import { getApiUsersIndex } from './api/users/get.index.spec'
import { postApiUserRegister } from './api/users/post.register.spec'

describe('APIs', () => {
  beforeEach(() => MySQLStore.reset())
  after(() => MySQLStore.close())

  postLoginSpec()
  deleteLogoutSpec()
  getApiUsersMe()
  getApiUsersIndex()
  postApiUserRegister()
})
