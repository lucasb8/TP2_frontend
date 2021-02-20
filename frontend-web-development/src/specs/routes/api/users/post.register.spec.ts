import { Users$RegisterParams } from '../../../../routes/api/users/post.register'
import { chai, getApp, expect } from '../../../specs-utils'
import { userFactory } from '../../../factories/user.factory'
import * as faker from 'faker'

export function postApiUserRegister () {
  describe('#POST /api/users/register', () => {
    it('register as customer', async () => {
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

    it('fails because email is already used', async () => {
      const customer = await userFactory.createAndGet({ role: 'customer' })
      const res = await chai.request(getApp())
        .post('/api/users/register')
        .send({ ...customer.only(['email', 'firstname', 'lastname', 'role']), password: faker.internet.password() })

      expect(res).to.have.property('status', 400)
      expect(res.body).to.be.a('object')
      expect(res.body.messages).to.deep.eq(['This email address is already used.'])
    })
  })
}
