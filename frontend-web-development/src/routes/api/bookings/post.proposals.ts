import { Request, Response } from 'express'
import AvailabilitiesService from '../../../services/availabilities.service'
import { params, route, sanetizeBody } from '../../../docs/routes'
import User from '../../../models/user'
import GeocodingService from '../../../services/geocoding.service'
import EmployeeInformation from '../../../models/employee-information'

export interface Bookings$ProposalsParams {
  latitude: number
  longitude: number
  startTime: number
  durationInHours: number
}

export interface Bookings$ProposalsResponse {
  proposals: {
    employee: User & { employeeInformation: EmployeeInformation },
    availability: { start: number, end: number }[]
  }[]
}

route(computeProposals, 'POST', '/api/bookings/proposals', 'Bookings', 'Proposals', 'Computes employee availabilities in zone which matches the booking.')
params(computeProposals, { key: 'latitude', type: 'number', required: true, desc: 'Latitude of the delivery location. Filter employees in same zone (up to 10 km).' })
params(computeProposals, { key: 'longitude', type: 'number', required: true, desc: 'Longitude of the delivery location. Filter employees in same zone (up to 10 km).' })
params(computeProposals, { key: 'startTime', type: 'number', required: true, desc: 'Unix timestamp with milliseconds of the start date and time. See Date#getTime()' })
params(computeProposals, { key: 'durationInHours', type: 'number', required: true, desc: 'How long is each delivery' })
export default async function computeProposals (req: Request, res: Response) {
  const safeBody: Bookings$ProposalsParams = sanetizeBody(computeProposals, req.body)

  let employees = await User.q.whereEmployee.withEmployeeInformation.toArray()
  employees = employees.filter(employee => GeocodingService.geodesicDistance(safeBody, employee.employeeInformation, 1) <= 10)

  const results = await AvailabilitiesService.findEmployeeAvailabilitiesBetween(employees, safeBody.durationInHours, safeBody.startTime, safeBody.startTime + 24 * 3600 * 1000)
  const response: Bookings$ProposalsResponse = { proposals: results.map(({ employee, availability }) => ({ employee, availability: availability.ranges })) }
  res.json(response)
}
