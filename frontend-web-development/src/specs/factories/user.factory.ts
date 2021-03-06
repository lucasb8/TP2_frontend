import FixtureFactory, { FactoryInterface } from './fixture-factory'
import User from '../../models/user'
import UserRelation from '../../models/relations/user.relation'
import * as faker from 'faker'
import * as bcrypt from 'bcrypt'
import { BodyCreate } from 'node-asuran-db/lib/model'
import { employeeInformationFactory } from './employee-information.factory'

class UserFactory extends FixtureFactory<User, UserRelation<User>> implements FactoryInterface<User> {
  constructor () { super(User) }

  get firstname () { return faker.name.firstName() }
  get lastname () { return faker.name.lastName() }
  get email () { return faker.internet.email().toLowerCase() }
  get passwordHash () { return bcrypt.hashSync('seedpass', 12) }

  role = 'customer' as 'customer'

  async afterCreate (bodyCreate: BodyCreate<User>, id: number) {
    if (bodyCreate.role === 'employee') await employeeInformationFactory.create({ employeeId: id })
  }
}

export const userFactory = new UserFactory()
