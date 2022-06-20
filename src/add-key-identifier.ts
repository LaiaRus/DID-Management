import { agent } from './veramo/setup'

async function main() {
  var desired_identity = null
  var argument = process.argv.slice(2)[1]
  if (argument != null && argument.trim() != '') {
    desired_identity = await agent.didManagerGetByAlias({
      "alias": argument
    })
  } else {
    console.log("Please, add an argument i.e. npm run id:add-key --alias John")
  }
  if (desired_identity != null) {
    // The key must be created before adding it to the identifier
    const key = await agent.keyManagerCreate({ kms: 'local', type: 'Secp256k1' })

    // Adding a key to an identifier means making a blockchain transaction (paying Gas) 
    agent.didManagerAddKey({
      "did": desired_identity.did,
      "key": key
    }).then(response => {
      console.log(`Transaction: ${response}`)
      console.log("A new key has been added to DID with alias " + argument)
    }).catch(err => {
      console.error(err)
    })
  }
}

main().catch(console.log)