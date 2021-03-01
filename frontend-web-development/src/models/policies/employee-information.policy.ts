import User from '../user'
import EmployeeInformation from '../employee-information'
import { BodyCreate, BodyEdit } from 'node-asuran-db/lib/model'
import Policy from './policy'

export default class userPolicy extends Policy {
  async canCreate (user: User, body: BodyCreate<EmployeeInformation>) {
    return false
  }

  async canUpdate (user: User, object: User, body: BodyEdit<EmployeeInformation>) {
    return false
  }

  async canDelete (user: User, object: EmployeeInformation) {
    return false
  }

  getScope (user: User, scope = EmployeeInformation.q) {
    if (user.role === 'operator') return scope
    return scope.none
  }

  serialize (user: User, object: EmployeeInformation) {
    return object
  }
}
