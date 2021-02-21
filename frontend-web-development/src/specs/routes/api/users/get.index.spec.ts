import { chai, getApp, expect } from '../../../specs-utils'
import { userFactory } from "../../../factories/user.factory"

export function getApiUsersIndex () {
  describe('#GET /api/users', () => {
    it('lists all users as operator (without password hashes)', async () => {
      await userFactory.create({ role: 'customer' })
      await userFactory.create({ role: 'operator' })
      const operatorId = await userFactory.create({ role: 'operator' })
      const res = await chai.request(getApp()).get('/api/users').set('testauthid', operatorId.toString())

      expect(res).to.have.property('status', 200)
      expect(res.body).to.be.a('array')
      expect(res.body.length).to.eq(3)
      for (const user of res.body) expect(user).to.not.have.property('passwordHash')
    })

    it('lists only itself as customer (without password hashes)', async () => {
      const customerId = await userFactory.create({ role: 'customer' })
      await userFactory.create({ role: 'operator' })
      await userFactory.create({ role: 'operator' })
      const res = await chai.request(getApp()).get('/api/users').set('testauthid', customerId.toString())

      expect(res).to.have.property('status', 200)
      expect(res.body).to.be.a('array')
      expect(res.body.length).to.eq(1)
      expect(res.body[0]).to.not.have.property('passwordHash')
    })
  })
}
