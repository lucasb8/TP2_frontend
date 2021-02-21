import FixtureFactory, { FactoryInterface } from './fixture-factory'
import Delivery from '../../models/delivery'
import DeliveryRelation from '../../models/relations/delivery.relation'
import { bookingFactory } from './booking.factory'
import { BodyPartial } from 'node-asuran-db/lib/model'
import Booking from '../../models/booking'

class DeliveryFactory extends FixtureFactory<Delivery, DeliveryRelation> implements FactoryInterface<Delivery> {
  constructor () { super(Delivery) }

  get bookingId () { throw new Error('Internal Error, should be bandled in `beforeInit` hook') }
  get start () { throw new Error('Internal Error, should be bandled in `beforeInit` hook') }
  get end () { throw new Error('Internal Error, should be bandled in `beforeInit` hook') }

  async beforeInit (defaults: BodyPartial<Delivery>) {
    if (!defaults.bookingId) defaults.bookingId = await bookingFactory.create()
    const booking = await Booking.q.find(defaults.bookingId)

    defaults.start = booking.startTime
    defaults.end = booking.startTime + 3600 * 1000 * booking.durationInHours
  }
}

export const deliveryFactory = new DeliveryFactory()
