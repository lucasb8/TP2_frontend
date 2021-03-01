import ActiveRelation from 'node-asuran-db/lib/relation'
import EmployeeInformation from '../employee-information'
import User from '../user'

export default class UserRelation<T extends User> extends ActiveRelation<T> {
  get withEmployeeInformation (): UserRelation<T & { employeeInformation: EmployeeInformation }> {
    return this.joins('LEFT JOIN EmployeeInformation ON EmployeeInformation.employeeId = User.id')
      .includes(EmployeeInformation, '.employeeInformation') as any
  }

  get whereEmployee () {
    return this.where("User.role = 'employee'")
  }

  findByEmail (email: string) {
    return this.where('User.email = ?', [email]).first()
  }
}
