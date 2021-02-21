import { Request, Response } from 'express'
import AvailabilitiesService from '../../../services/availabilities.service'
import { mandatory, route, sanetizeBody } from '../../../docs/routes'

export interface Bookings$ProposalsParams {
  latitude: number
  longitude: number
  startTime: number
  durationInHours: number
}

route(computeProposals, 'POST', '/api/bookings/proposals', 'Bookings', 'Proposals', 'Computes employee availabilities in zone which matches the booking.')
mandatory(computeProposals, 'latitude', 'number', 'Latitude of the delivery location. Filter employees in same zone (up to 50 km).')
mandatory(computeProposals, 'longitude', 'number', 'Longitude of the delivery location. Filter employees in same zone (up to 50 km).')
mandatory(computeProposals, 'startTime', 'number', 'Unix timestamp with milliseconds of the start date and time. See Date#getTime()')
mandatory(computeProposals, 'durationInHours', 'number', 'How long is each delivery')
export default async function computeProposals (req: Request, res: Response) {
  const safeBody: Bookings$ProposalsParams = sanetizeBody(computeProposals, req.body)

  // TODO: find employees by longitude and longitude
  const results = await AvailabilitiesService.findEmployeeAvailabilitiesBetween(safeBody.durationInHours, safeBody.startTime, safeBody.startTime + 24 * 3600 * 1000)
  res.json(results.map(({ employee, availability }) => ({ employee, availability: availability.ranges })))
}
