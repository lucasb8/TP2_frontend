import Delivery from '../models/delivery'
import User from '../models/user'

export class Availability {
  constructor (public minDuration: number, public ranges: { start: number, end: number }[]) {}

  /**
   * Remove a range from current availability.
   * 
   * A = this = a set, B = a set.
   * It computes A = A INTER (NOT (A INTER B))
   */
  negativeMask ({ start, end }: Availability['ranges'][0]) {
    const newRanges: Availability['ranges'] = []

    for (const range of this.ranges) {
      // if overlaping, see https://stackoverflow.com/questions/13513932/algorithm-to-detect-overlapping-periods
      if ((start < range.end && range.start < end)) {
        if (range.start < start) newRanges.push({ start: range.start, end: start })
        if (range.end > end) newRanges.push({ start: end, end: range.end })
      } else {
        newRanges.push(range)
      }
    }

    this.ranges = newRanges.filter(range => range.end - range.start >= this.minDuration)
  }
}

export default class AvailabilitiesService {
  static async findEmployeeAvailabilitiesBetween (minDurationInHours: number, start: number, end: number) {
    const employees = await User.q.whereEmployee.toArray()
    const proposals: { employee: User, availability: Availability }[] = []

    for (const employee of employees) {
      const availability = new Availability(minDurationInHours * 3600 * 1000, [{ start, end }])
      const deliveries = await Delivery.q.whereEmployee(employee.id).sort('Delivery.start').whereOverlaps(start, end).toArray()
      for (const delivery of deliveries) availability.negativeMask(delivery)
      proposals.push({ employee, availability })
    }

    return proposals
  }
}
