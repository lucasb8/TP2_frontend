import { getModelByName, getModelsInDependencyOrder } from './models/model-by-name'
import * as readline from 'readline'
import Commit from './models/commit'

if (process.argv[process.argv.length - 1] === '--all') {
  run('all')
} else {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  })

  rl.on('line', run)
}

function run (className: string) {
  if (className === 'all') {
    for (const model of getModelsInDependencyOrder()) console.log(model.toSqlTables())
    console.log(Commit.toSqlTables())
  } else {
    const Resource = getModelByName(className)
    console.log(Resource.toSqlTables())
  }
}
