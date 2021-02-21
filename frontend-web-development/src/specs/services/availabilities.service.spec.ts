import { Availability } from '../../services/availabilities.service'
import { expect } from '../specs-utils'

describe('Availability', () => {
  describe('negativeMask', () => {
    it('computes the negative mask', () => {
      const availability = new Availability(1, [{ start: 5, end: 100 }])

      availability.negativeMask({ start: 3, end: 9 })
      expect(availability.ranges).to.deep.eq([{ start: 9, end: 100 }])

      availability.negativeMask({ start: 9, end: 10 })
      expect(availability.ranges).to.deep.eq([{ start: 10, end: 100 }])

      availability.negativeMask({ start: 20, end: 30 })
      expect(availability.ranges).to.deep.eq([{ start: 10, end: 20 }, { start: 30, end: 100 }])

      availability.negativeMask({ start: 20, end: 31 })
      expect(availability.ranges).to.deep.eq([{ start: 10, end: 20 }, { start: 31, end: 100 }])

      availability.negativeMask({ start: 33, end: 35 })
      expect(availability.ranges).to.deep.eq([{ start: 10, end: 20 }, { start: 31, end: 33 }, { start: 35, end: 100 }])

      availability.negativeMask({ start: 15, end: 40 })
      expect(availability.ranges).to.deep.eq([{ start: 10, end: 15 }, { start: 40, end: 100 }])

      availability.negativeMask({ start: 95, end: 100 })
      expect(availability.ranges).to.deep.eq([{ start: 10, end: 15 }, { start: 40, end: 95 }])

      availability.negativeMask({ start: 90, end: 110 })
      expect(availability.ranges).to.deep.eq([{ start: 10, end: 15 }, { start: 40, end: 90 }])

      availability.negativeMask({ start: 12, end: 60 })
      expect(availability.ranges).to.deep.eq([{ start: 10, end: 12 }, { start: 60, end: 90 }])

      availability.negativeMask({ start: 10, end: 12 })
      expect(availability.ranges).to.deep.eq([{ start: 60, end: 90 }])
    })
  })
})
