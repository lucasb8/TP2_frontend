import FixtureFactory, { FactoryInterface } from './fixture-factory'
import EmployeeInformation from '../../models/employee-information'
import EmployeeInformationRelation from '../../models/relations/employee-information.relation'

class EmployeeInformationFactory extends FixtureFactory<EmployeeInformation, EmployeeInformationRelation> implements FactoryInterface<EmployeeInformation> {
  constructor () { super(EmployeeInformation) }

  get employeeId () { throw new Error('Internal Error, should be given as argument') }

  latitude = 48.79395
  longitude = 2.36231
}

export const employeeInformationFactory = new EmployeeInformationFactory()
