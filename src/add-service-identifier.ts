import { agent } from './veramo/setup'

async function main() {
  var desired_identity = null
  var argument = process.argv.slice(2)[1]
  if (argument != null && argument.trim() != '') {
    desired_identity = await agent.didManagerGetByAlias({
      "alias": argument
    })
  } else {
    console.log("Please, add an argument i.e. npm run id:add-service --alias John")
  }

  if (desired_identity != null) {
    var service = {
      "id": "did:web:veramo.dev#msg",
      "type": "Messaging",
      "serviceEndpoint": "https://veramo.dev/messaging",
      "description": "You can contact me by Telegram. My username is @Eu*****a."
    }
    agent.didManagerAddService({
      "did": desired_identity.did,
      "service": service
    }).then(response => {
      console.log(`Transaction: ${response}`)
      console.log("Service TELEGRAM has been added to DID with alias " + argument)
    }).catch(err => {
      console.log("err")
      console.error(err)
    })
  }
}

main().catch(console.log)