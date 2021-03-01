import { Request, Response } from 'express'
import User from '../../../models/user'
import { params, route, sanetizeBody } from '../../../docs/routes'
import GeocodingService from '../../../services/geocoding.service'

export interface Bookings$CoverageParams {
  latitude: number
  longitude: number
}

export interface Bookings$CoverageResponse {
  covered: boolean
}

route(checkCoverage, 'POST', '/api/bookings/coverage', 'Bookings', 'Coverage', 'Check if there are at least one employee within 10km.')
params(checkCoverage, { key: 'latitude', type: 'number', required: true, desc: 'Latitude of the delivery location. Filter employees in same zone (up to 10 km).' })
params(checkCoverage, { key: 'longitude', type: 'number', required: true, desc: 'Latitude of the delivery location. Filter employees in same zone (up to 10 km).' })
export default async function checkCoverage (req: Request, res: Response) {
  const safeBody: Bookings$CoverageParams = sanetizeBody(checkCoverage, req.body)
  const employees = await User.q.whereEmployee.withEmployeeInformation.toArray()
  const foundEmployee = employees.find(employee => GeocodingService.geodesicDistance(safeBody, employee.employeeInformation, 1) <= 10)
  const response: Bookings$CoverageResponse = { covered: !!foundEmployee }
  res.json(response)
}
