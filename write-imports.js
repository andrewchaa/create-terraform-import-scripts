import fs from 'fs'
import _ from 'lodash'
import clipboardy from 'clipboardy'
import constructStatement from './constructStatement.js'

const args = process.argv.slice(2)
const stateFile = args[0]
const planFile = args[1]
const tfModule = args[2]
const env = args[3]
const region = args[4]
const state = JSON.parse(fs.readFileSync(stateFile))
const plans = fs.readFileSync(planFile, 'utf-8').split('\n')

const commands = []
const notFoundResources = []
_.forEach(plans, (x) => {
    if (!x) {
        return
    }

    console.log(`composing import for ${x}`)
    const [notFounds, returns] = constructStatement(
        `- ./scripts/import.sh moonpig ${region} ${env} ${tfModule}`,
        `${region}`,
        state, x
        )

    notFoundResources.push(...notFounds)
    commands.push(...returns)
})

const importStatements = _.uniqWith(commands, _.isEqual).join('\n')
console.log('\n found')
console.log(importStatements)
clipboardy.writeSync(importStatements)

console.log('\nNot found resources ...')
console.log(notFoundResources)

