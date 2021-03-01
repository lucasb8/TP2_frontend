import { chai, getApp, expect } from '../../../specs-utils'
import { userFactory } from '../../../factories/user.factory'
import { Bookings$CoverageParams } from '../../../../routes/api/bookings/post.coverage'

export function postApiBookingsCoverage () {
  describe('#POST /api/bookings/coverage', () => {
    it('returns zone is covered', async () => {
      await userFactory.create({ role: 'employee' })

      const body: Bookings$CoverageParams = { latitude: 48.79395, longitude: 2.36231 }
      const res = await chai.request(getApp())
        .post('/api/bookings/coverage')
        .send(body)
      
      expect(res).to.have.property('status', 200)
      expect(res.body).to.be.a('object')
      expect(res.body.covered).to.be.true
    })

    it('returns zone is not covered', async () => {
      await userFactory.create({ role: 'employee' })

      const body: Bookings$CoverageParams = { latitude: 48, longitude: 2.36231 }
      const res = await chai.request(getApp())
        .post('/api/bookings/coverage')
        .send(body)
      
      expect(res).to.have.property('status', 200)
      expect(res.body).to.be.a('object')
      expect(res.body.covered).to.be.false
    })
  })
}
