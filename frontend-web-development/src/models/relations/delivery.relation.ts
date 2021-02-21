import ActiveRelation from 'node-asuran-db/lib/relation'
import Booking from '../booking'
import Delivery from '../delivery'

export default class DeliveryRelation extends ActiveRelation<Delivery> {
  get joinsBooking () {
    return this.joins('INNER JOIN Booking ON Booking.id = Delivery.bookingId')
  }

  get withBooking () {
    return this.joinsBooking.includes(Booking, '.jointure.booking')
  }

  whereEmployee (employeeId: number) {
    return this.joinsBooking.where('Booking.employeeId = ?', [employeeId])
  }

  whereOverlaps (start: number, end: number) {
    // see https://stackoverflow.com/questions/13513932/algorithm-to-detect-overlapping-periods
    return this.where('FROM_UNIXTIME(? DIV 1000) < Delivery.end && Delivery.start < FROM_UNIXTIME(? DIV 1000)', [start, end])
  }
}
