import newModel from 'node-asuran-db/lib/model'
import MySQLStore from '../mysql-store'
import BookingPolicy from './policies/booking.policy'
import BookingRelation from './relations/booking.relation'
import User from './user'

export default class Booking extends newModel<Booking>({ className: 'Booking', connection () { return MySQLStore.connection } }) {
  customerId: number
  postalAddress: string
  latitude: number
  longitude: number
  startTime: number
  durationInHours: number
  employeeId: number
  hourlyPrice: number

  static get policy (): BookingPolicy { return new (require(`./policies/${__filename.split('/').pop().replace('.js', '')}.policy`).default)(this) }
  static get q (): BookingRelation { return new (require(`./relations/${__filename.split('/').pop().replace('.js', '')}.relation`).default)(this) }
}

Booking.registerFieldForeignKey('customerId', User)
Booking.registerFieldString('postalAddress', 128)
Booking.registerFieldDecimal('latitude', 10, 5)
Booking.registerFieldDecimal('longitude', 10, 5)
Booking.registerFieldDatetime('startTime')
Booking.registerFieldDecimal('durationInHours', 6, 2)
Booking.registerFieldForeignKey('employeeId', User)
Booking.registerFieldDecimal('hourlyPrice', 6, 2)
