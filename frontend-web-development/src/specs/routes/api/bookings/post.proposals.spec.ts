import { chai, getApp, expect } from '../../../specs-utils'
import { Bookings$ProposalsParams } from '../../../../routes/api/bookings/post.proposals'
import { userFactory } from '../../../factories/user.factory'
import { deliveryFactory } from '../../../factories/delivery.factory'

export function postApiBookingsProposals () {
  describe('#POST /api/bookings/proposals', () => {
    it('computes proposals with employee available at startTime', async () => {
      await userFactory.create({ role: 'employee' })

      const startTime = new Date()
      startTime.setMinutes(0)
      startTime.setSeconds(0)

      const body: Bookings$ProposalsParams = {
        latitude: 48.79395,
        longitude: 2.36231,
        durationInHours: 1.5,
        startTime: startTime.getTime()
      }

      const res = await chai.request(getApp())
        .post('/api/bookings/proposals')
        .send(body)
      
      expect(res).to.have.property('status', 200)
      expect(res.body).to.be.a('array')
      expect(res.body[0]).to.have.property('employee')
      expect(res.body[0]).to.have.property('availability')
      expect(res.body[0].availability.length).to.eq(1)
      expect(res.body[0].availability[0].start).to.eq(startTime.getTime())
    })

    it('computes proposals with employee available after startTime', async () => {
      const delivery = await deliveryFactory.createAndGet()

      const body: Bookings$ProposalsParams = {
        latitude: 48.79395,
        longitude: 2.36231,
        durationInHours: 1.5,
        startTime: delivery.start
      }

      const res = await chai.request(getApp())
        .post('/api/bookings/proposals')
        .send(body)
      
      expect(res).to.have.property('status', 200)
      expect(res.body).to.be.a('array')
      expect(res.body[0]).to.have.property('employee')
      expect(res.body[0]).to.have.property('availability')
      expect(res.body[0].availability.length).to.eq(1)
      expect(res.body[0].availability[0].start).to.eq(delivery.end)
    })
  })
}
