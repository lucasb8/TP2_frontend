import User from '../user'
import Booking from '../booking'
import { BodyCreate, BodyEdit } from 'node-asuran-db/lib/model'
import Policy from './policy'

export default class userPolicy extends Policy {
  async canCreate (user: User, body: BodyCreate<Booking>) {
    return user.role === 'customer' && body.customerId === user.id
  }

  async canUpdate (user: User, object: User, body: BodyEdit<Booking>) {
    return user.role === 'customer' && body.customerId === user.id
  }

  async canDelete (user: User, object: Booking) {
    return user.role === 'operator'
  }

  getScope (user: User, scope = Booking.q) {
    if (user.role === 'operator') return scope
    if (user.role === 'customer') return scope.whereCustomer(user.id)
    return scope.none
  }

  serialize (user: User, object: Booking) {
    return object
  }
}
