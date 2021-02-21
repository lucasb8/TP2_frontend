import User from '../user'
import Delivery from '../delivery'
import { BodyCreate, BodyEdit } from 'node-asuran-db/lib/model'
import Policy from './policy'

export default class userPolicy extends Policy {
  async canCreate (user: User, body: BodyCreate<Delivery>) {
    return false
  }

  async canUpdate (user: User, object: User, body: BodyEdit<Delivery>) {
    return false
  }

  async canDelete (user: User, object: Delivery) {
    return false
  }

  getScope (user: User, scope = Delivery.q) {
    if (user.role === 'operator') return scope
    return scope.none
  }

  serialize (user: User, object: Delivery) {
    return object
  }
}
