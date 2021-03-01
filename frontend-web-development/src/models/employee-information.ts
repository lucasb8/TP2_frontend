import newModel from 'node-asuran-db/lib/model'
import MySQLStore from '../mysql-store'
import EmployeeInformationPolicy from './policies/employee-information.policy'
import EmployeeInformationRelation from './relations/employee-information.relation'
import User from './user'

export default class EmployeeInformation extends newModel<EmployeeInformation>({ className: 'EmployeeInformation', connection () { return MySQLStore.connection } }) {
  employeeId: number
  latitude: number
  longitude: number

  static get policy (): EmployeeInformationPolicy { return new (require(`./policies/${__filename.split('/').pop().replace('.js', '')}.policy`).default)(this) }
  static get q (): EmployeeInformationRelation { return new (require(`./relations/${__filename.split('/').pop().replace('.js', '')}.relation`).default)(this) }
}

EmployeeInformation.registerFieldForeignKey('employeeId', User)
EmployeeInformation.registerFieldDecimal('latitude', 11, 7)
EmployeeInformation.registerFieldDecimal('longitude', 11, 7)

EmployeeInformation.extraDdl.push('ALTER TABLE `EmployeeInformation` ADD UNIQUE(`employeeId`);')
