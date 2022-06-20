import { agent } from './veramo/setup'

async function main() {
  var identity = null
  var argument = process.argv.slice(2)[1]
  if (argument != null && argument.trim() != '') {
    identity = await agent.didManagerCreate({
      "alias": argument
    })
  } else {
    identity = await agent.didManagerCreate()
  }
  console.log(`New identity created`)
  console.log(identity)
}

main().catch(console.log)