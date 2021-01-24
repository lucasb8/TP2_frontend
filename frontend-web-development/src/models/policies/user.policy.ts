import User from '../user'
import { BodyCreate, BodyEdit } from 'node-asuran-db/lib/model'
import Policy from './policy'

export default class userPolicy extends Policy {
  async canCreate (user: User, body: BodyCreate<User>) {
    return user.role === 'operator'
  }

  async canUpdate (user: User, object: User, body: BodyEdit<User>) {
    return user.role === 'operator'
  }

  async canDelete (user: User, object: User) {
    return user.role === 'operator'
  }

  getScope (user: User, scope = User.q) {
    return scope.none
  }

  serialize (user: User, object: User) {
   return object.except(['passwordHash'])
  }
}
