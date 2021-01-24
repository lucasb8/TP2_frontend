import { chai, getApp, expect } from '../../specs-utils'
import { userFactory } from "../../factories/user.factory"

export function deleteLogoutSpec () {
  describe('#DELETE /auth/logout', () => {
    it('has success http code', async () => {
      const customerId = await userFactory.create({ role: 'customer' })
      const res = await chai.request(getApp()).delete('/auth/logout').set('testauthid', customerId.toString())

      expect(res).to.have.property('status', 200)
      expect(res.body).to.be.a('object')
      expect(res.body.success).to.eq(true)
    })
  })
}
