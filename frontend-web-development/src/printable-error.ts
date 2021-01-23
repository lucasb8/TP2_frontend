export default class PrintableError extends Error {
  constructor (public messages: string[]) {
    super(messages.join('. '))
  }
}