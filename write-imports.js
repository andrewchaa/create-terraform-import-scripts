import fs from 'fs'
import _ from 'lodash'
import clipboardy from 'clipboardy'
import constructStatement from './constructStatement.js'

const args = process.argv.slice(2)
const stateFile = args[0]
const planFile = args[1]
const env = args[2]
const region = args[3]
const state = JSON.parse(fs.readFileSync(stateFile))
const plans = fs.readFileSync(planFile, 'utf-8').split('\n')

const commands = []
_.forEach(plans, (x) => {
    if (!x) {
        return
    }

    console.log(`composing import for ${x}`)
    const returns = constructStatement(
        `- ./scripts/import.sh api ${env} ${region} regional`,
        `${region}`,
        state, x
        )
    commands.push(...returns)
})

const importStatements = _.uniqWith(commands, _.isEqual).join('\n')
console.log(importStatements)
clipboardy.writeSync(importStatements)

