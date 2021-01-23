import RootPolicy from 'node-asuran-db/lib/policy'
import User from '../user'

export default class Policy extends RootPolicy {
  protected async checkForeignsScope (user: User, foreignModel: any, foreignIds: number[]) {
    if (!foreignModel) return true
    return await foreignModel.policy.getScope(user).whereIds(foreignIds).count() === foreignIds.length
  }
}
