import { chai, getApp, expect } from '../../../specs-utils'
import { userFactory } from "../../../factories/user.factory"

export function getApiUsersMe () {
  describe('#GET /api/users/me', () => {
    it('gets non sensitive informations about currently logged user', async () => {
      const customer = await userFactory.createAndGet({ role: 'customer' })
      const res = await chai.request(getApp()).get('/api/users/me').set('testauthid', customer.id.toString())

      expect(res).to.have.property('status', 200)
      expect(res.body).to.be.a('object')
      expect(res.body.id).to.eq(customer.id)
      expect(res.body.email).to.eq(customer.email)
      expect(res.body).to.not.have.property('passwordHash')
    })
  })
}
