import ActiveRelation from 'node-asuran-db/lib/relation'
import User from '../user'

export default class UserRelation extends ActiveRelation<User> {
  get whereEmployee () {
    return this.where("User.role = 'employee'")
  }

  findByEmail (email: string) {
    return this.where('User.email = ?', [email]).first()
  }
}
