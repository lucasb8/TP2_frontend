import { getApiDoc } from './docs/routes'
import { createDoc } from 'apidoc'
import * as fs from 'fs'
import server from './server'

server()

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))

const apiDocConfig = {
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  title: "API documentation for service-shop backend",
  url : "http://localhost:8080",
  template: { forceLanguage: 'en' }
}

try {
  fs.mkdirSync('/tmp/service-shop')
} catch (err) {
  if (err.code !== 'EEXIST') throw err
}

fs.writeFileSync('/tmp/service-shop/comments.js', getApiDoc().join('\n'), 'utf-8')
fs.writeFileSync('/tmp/service-shop/apidoc.json', JSON.stringify(apiDocConfig, null, 2), 'utf-8')

createDoc({ src: '/tmp/service-shop/', dest: './build/docs' })
process.exit()
