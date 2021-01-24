import FixtureFactory from './fixture-factory'
import User from '../../models/user'
import UserRelation from '../../models/relations/user.relation'
import * as faker from 'faker'
import * as bcrypt from 'bcrypt'

class UserFactory extends FixtureFactory<User, UserRelation> {
  constructor () { super(User) }

  get firstname () { return faker.name.firstName() }
  get lastname () { return faker.name.lastName() }
  get email () { return faker.internet.email().toLowerCase() }
  get passwordHash () { return bcrypt.hashSync('seedpass', 12) }

  role = 'customer'
}

export const userFactory = new UserFactory()
