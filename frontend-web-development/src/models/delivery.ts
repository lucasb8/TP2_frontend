import newModel from 'node-asuran-db/lib/model'
import MySQLStore from '../mysql-store'
import Booking from './booking'
import DeliveryPolicy from './policies/delivery.policy'
import DeliveryRelation from './relations/delivery.relation'

export default class Delivery extends newModel<Delivery>({ className: 'Delivery', connection () { return MySQLStore.connection } }) {
  bookingId: number
  start: number
  end: number
  jointure: { booking?: Booking }

  static get policy (): DeliveryPolicy { return new (require(`./policies/${__filename.split('/').pop().replace('.js', '')}.policy`).default)(this) }
  static get q (): DeliveryRelation { return new (require(`./relations/${__filename.split('/').pop().replace('.js', '')}.relation`).default)(this) }
}

Delivery.registerFieldForeignKey('bookingId', Booking)
Delivery.registerFieldDatetime('start')
Delivery.registerFieldDatetime('end')

Delivery.extraDdl.push('ALTER TABLE `Delivery` ADD INDEX(`start`);')
Delivery.extraDdl.push('ALTER TABLE `Delivery` ADD INDEX(`end`);')
