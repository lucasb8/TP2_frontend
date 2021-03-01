import { Users$RegisterParams } from '../../../../routes/api/users/post.register'
import { chai, getApp, expect } from '../../../specs-utils'
import { userFactory } from '../../../factories/user.factory'
import EmployeeInformation from '../../../../models/employee-information'
import * as faker from 'faker'

export function postApiUsersRegister () {
  describe('#POST /api/users/register', () => {
    it('registers as customer', async () => {
      const body: Users$RegisterParams = {
        email: faker.internet.email().toLowerCase(),
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        password: faker.internet.password(),
        role: 'customer'
      }

      const res = await chai.request(getApp())
        .post('/api/users/register')
        .send(body)

      expect(res).to.have.property('status', 200)
      expect(res.body).to.be.a('object')
      expect(res.body.email).to.eq(body.email)
      expect(res.body.firstname).to.eq(body.firstname)
      expect(res.body.lastname).to.eq(body.lastname)
      expect(res.body.role).to.eq(body.role)
      expect(res.body).to.not.have.property('passwordHash')
    })

    it('registers as employee', async () => {
      const body: Users$RegisterParams = {
        email: faker.internet.email().toLowerCase(),
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        password: faker.internet.password(),
        role: 'employee',
        employeeInformation: {
          latitude: 48.79395,
          longitude: 2.36231
        }
      }

      const res = await chai.request(getApp())
        .post('/api/users/register')
        .send(body)

      expect(res).to.have.property('status', 200)
      expect(res.body).to.be.a('object')
      expect(res.body.email).to.eq(body.email)
      expect(res.body.firstname).to.eq(body.firstname)
      expect(res.body.lastname).to.eq(body.lastname)
      expect(res.body.role).to.eq(body.role)
      expect(res.body).to.not.have.property('passwordHash')
      expect(await EmployeeInformation.q.whereEmployee(res.body.id).exists()).to.be.true
    })

    it('fails because email is already used', async () => {
      const customer = await userFactory.createAndGet({ role: 'customer' })
      const res = await chai.request(getApp())
        .post('/api/users/register')
        .send({ ...customer.only(['email', 'firstname', 'lastname', 'role']), password: faker.internet.password() })

      expect(res).to.have.property('status', 400)
      expect(res.body).to.be.a('object')
      expect(res.body.messages).to.deep.eq(['This email address is already used.'])
    })

    it('fails because employeeInformation is required for employee', async () => {
      const body: Users$RegisterParams = {
        email: faker.internet.email().toLowerCase(),
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        password: faker.internet.password(),
        role: 'employee',
        employeeInformation: null
      }

      const res = await chai.request(getApp())
        .post('/api/users/register')
        .send(body)

      expect(res).to.have.property('status', 400)
      expect(res.body).to.be.a('object')
      expect(res.body.messages).to.deep.eq(['Missing parameter: employeeInformation.latitude.'])
    })
  })
}
