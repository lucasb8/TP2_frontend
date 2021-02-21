import FixtureFactory, { FactoryInterface } from './fixture-factory'
import Booking from '../../models/booking'
import BookingRelation from '../../models/relations/booking.relation'
import { userFactory } from './user.factory'
import * as faker from 'faker'

class BookingFactory extends FixtureFactory<Booking, BookingRelation> implements FactoryInterface<Booking> {
  constructor () { super(Booking) }

  get customerId () { return userFactory.create({ role: 'customer' }) }
  get employeeId () { return userFactory.create({ role: 'employee' }) }
  get durationInHours () { return faker.random.number({ min: 1, max: 4, precision: 0.25 }) }
  get hourlyPrice () { return faker.random.number({ min: 15, max: 30, precision: 0.01 }) }

  get startTime () {
    const startTime = new Date()
    startTime.setMinutes(0)
    startTime.setSeconds(0)
    return startTime.getTime()
  }
  
  postalAddress = '94800, Villejuif'
  latitude = 48.79395
  longitude = 2.36231
}

export const bookingFactory = new BookingFactory()
