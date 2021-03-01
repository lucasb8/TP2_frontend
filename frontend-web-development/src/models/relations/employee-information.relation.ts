import ActiveRelation from 'node-asuran-db/lib/relation'
import EmployeeInformation from '../employee-information'

export default class EmployeeInformationRelation extends ActiveRelation<EmployeeInformation> {
  whereEmployee (employeeId: number) {
    return this.where('EmployeeInformation.employeeId = ?', [employeeId])
  }
}
