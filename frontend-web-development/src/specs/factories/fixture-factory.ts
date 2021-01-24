import Commit from '../../models/commit'
import { BodyPartial } from 'node-asuran-db/lib/model'

export default class FixtureFactory<T, TActiveRelation> {
  constructor (protected model: any) {}

  // tslint:disable-next-line: no-empty
  async beforeInit (defaults: BodyPartial<T>) {}

  async create (defaults: BodyPartial<T> = {} as any) {
    const bodyCreate = {} as any
    await this.beforeInit(defaults)

    for (const getterName of Object.keys(Object.getOwnPropertyDescriptors(Object.getPrototypeOf(this))).concat(Object.keys(this))) {
      if (['constructor', 'model', 'beforeInit'].includes(getterName)) continue
      if (getterName.startsWith('createPreset')) continue
      if (defaults.hasOwnProperty(getterName)) bodyCreate[getterName] = (defaults as any)[getterName]
      else bodyCreate[getterName] = await (this as any)[getterName]
    }

    const commit = await Commit.upsertCommit(null)
    const [id] = await this.model.create([bodyCreate], commit.id, { getId: true })
    return id as number
  }

  async createRelation (defaults: BodyPartial<T> = {} as any) {
    return this.model.q.whereId(await this.create(defaults)) as TActiveRelation
  }

  async createAndGet (defaults: BodyPartial<T> = {} as any) {
    return this.model.q.find(await this.create(defaults)) as T
  }
}
