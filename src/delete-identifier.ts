import { agent } from './veramo/setup'

async function main() {
  var desired_identity = null
  var argument = process.argv.slice(2)[1]
  if (argument !== undefined && argument.trim() !== '') {
    desired_identity = await agent.didManagerGetByAlias({
      "alias": argument
    })
  } else {
    console.log("Please, add an argument i.e. npm run id:delete --alias John")
    console.log('argument:')
    console.log(argument)
  }
  if (desired_identity != null) {
    agent.didManagerDelete({
      "did": desired_identity.did,
    })
  }
}

main().catch(console.log)