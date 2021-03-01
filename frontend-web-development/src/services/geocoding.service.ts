export default class GeocodingService {
  static geodesicDistance (from: { latitude: number, longitude: number }, to: { latitude: number, longitude: number }, decimal: number) {
    const radLat = (from.latitude - to.latitude) * (Math.PI / 180)
    const radLng = (from.longitude - to.longitude) * (Math.PI / 180)
    const a = Math.sin(radLat / 2) * Math.sin(radLat / 2) + Math.cos(from.latitude * (Math.PI / 180)) * Math.cos(to.latitude * (Math.PI / 180)) * Math.sin(radLng / 2) * Math.sin(radLng / 2)
    return Math.round((12742 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * (10 ^ decimal))) / (10 ^ decimal)
  }
}
