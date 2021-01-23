import './user'
import { FieldForeignKey, registredModels } from 'node-asuran-db/lib/model'

export function getModels () {
  return Object.values(registredModels) as (FieldForeignKey & { toSqlTriggers: () => string, toSqlTables: () => string })[]
}

export function getModelsInDependencyOrder () {
  let returnedModels = []
  let remainingModels = getModels()

  while (remainingModels.length) {
    const nextWithoutUnprocessedDependency = remainingModels.find(model => !remainingModels.find(otherModel => model.getForeigns().includes(otherModel) && model !== otherModel))
    if (!nextWithoutUnprocessedDependency) throw new Error('Interdependency found in models: ' + remainingModels.map(_ => _.className).join())
    returnedModels.push(nextWithoutUnprocessedDependency)
    remainingModels = remainingModels.filter(_ => _ !== nextWithoutUnprocessedDependency)
  }

  return returnedModels
}

export function getModelByName (type: string) {
  for (const model of getModels()) {
    if (model.className === type) return model
  }

  throw new Error(`Unsupported resource type ${type}`)
}
