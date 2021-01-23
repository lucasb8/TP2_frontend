import debug from 'debug'

export default class Utils {
  static debug (module: NodeModule, message: string) {
    debug('backend:' + module.filename.split('build/server/').pop().slice(0, -3))(message)
  }
}
