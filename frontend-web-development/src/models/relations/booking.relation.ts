import ActiveRelation from 'node-asuran-db/lib/relation'
import Booking from '../booking'

export default class BookingRelation extends ActiveRelation<Booking> {
  whereCustomer (customerId: number) {
    return this.where('Booking.customerId = ?', [customerId])
  }
}
