import { chai, getApp, expect } from '../../specs-utils'
import { userFactory } from "../../factories/user.factory"

export function postLoginSpec () {
  describe('#POST /auth/login', () => {
    it('accepts valid credentials', async () => {
      const customer = await userFactory.createAndGet({ role: 'customer' })
      const res = await chai.request(getApp())
        .post('/auth/login')
        .send({ email: customer.email, password: 'changeme' })

      expect(res).to.have.property('status', 200)
      expect(res.body).to.be.a('object')
      expect(res.body.success).to.eq(true)
    })

    it('rejects invalid email', async () => {
      const customer = await userFactory.createAndGet({ role: 'customer' })
      const res = await chai.request(getApp())
        .post('/auth/login')
        .send({ email: customer.email + 'suffix', password: 'changeme' })

      expect(res).to.have.property('status', 400)
      expect(res.body).to.be.a('object')
      expect(res.body).to.have.property('messages')
      expect(res.body.messages).to.include('No account found for this email.')
    })

    it('rejects invalid password', async () => {
      const customer = await userFactory.createAndGet({ role: 'customer' })
      const res = await chai.request(getApp())
        .post('/auth/login')
        .send({ email: customer.email, password: 'wrong' })

      expect(res).to.have.property('status', 400)
      expect(res.body).to.be.a('object')
      expect(res.body).to.have.property('messages')
      expect(res.body.messages).to.include('Password is invalid.')
    })

    it('rejects missing parameters', async () => {
      const customer = await userFactory.createAndGet({ role: 'customer' })
      const res = await chai.request(getApp())
        .post('/auth/login')
        .send({ email: customer.email })

      expect(res).to.have.property('status', 400)
      expect(res.body).to.be.a('object')
      expect(res.body).to.have.property('messages')
      expect(res.body.messages).to.include('Missing parameter: password.')
    })
  })
}
