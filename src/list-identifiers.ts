import { agent } from './veramo/setup'
import { getDefaultProvider, providers, utils } from 'ethers'

async function main() {
  const provider = getDefaultProvider('ropsten', { infura: '3010b402343c4a02ad8cf9b8e7c9b8c0' })
  const identifiers = await agent.didManagerFind()

  console.log(`There are ${identifiers.length} identifiers`)

  for (let i = 0; i < identifiers.length; i++) {
    const id = identifiers[i]
    console.log(id.did)
    console.log(`alias: ${id.alias}`)
    console.log(`service ID: ${id.services.map(service => service.id + ' Description: ' + service.description)}`)
    console.log(`key: ${id.keys.length}`)
    console.log("KEYS:")
    console.log(`\tkey id: ${id.keys.map(key => key.kid)}`)
    console.log(`\tkey kms: ${id.keys.map(key => key.kms)}`)
    console.log(`\tkey algorithm: ${id.keys.map(key => key.meta?.algorithms)}`)
    console.log(`\tkey publicKeyHex: ${id.keys.map(key => key.publicKeyHex)}`)
    console.log(`\tkey privateKeyHex: ${id.keys.map(key => key.privateKeyHex)}`)
    console.log(`\tkey type: ${id.keys.map(key => key.type)}`)
    const address = utils.computeAddress('0x' + id.keys[0].publicKeyHex)
    console.log(`ethr address: ${address} balance: ${await (await provider.getBalance(address))}`)

    // Example of DID Document at https://github.com/decentralized-identity/ethr-did-resolver

    // DID RESOLVE - GETTING THE DID DOCUMENT
    var didResolver = await agent.resolveDid({
      'didUrl': id.did
    })

    // id
    const didDodocument = didResolver.didDocument
    console.log("DID DOCUMENT:")
    console.log(` document id: ${didDodocument?.id}`)
    // @context
    if (didDodocument?.['@context'] != undefined && didDodocument?.['@context'].length > 0) {
      for (let index = 0; index < didDodocument?.['@context'].length; index++) {
        const element = didDodocument?.['@context'][index];
        console.log(` document context ${index}: ${element}`)
      }
    } else {
      console.log(" document context: none")
    }
    // verificationMethod
    if (didDodocument?.verificationMethod != undefined && didDodocument?.verificationMethod.length > 0) {
      for (let index = 0; index < didDodocument?.verificationMethod.length; index++) {
        const element = didDodocument?.verificationMethod[index];
        console.log(` document verificationMethod ID ${index}: ${element.id}`)
        console.log(` document verificationMethod type ${index}: ${element.type}`)
        console.log(` document verificationMethod controller ${index}: ${element.controller}`)
        console.log(` document verificationMethod blockChainAccountId ${index}: ${element.blockchainAccountId}`)
      }
      didDodocument?.verificationMethod.forEach(verificationMethod => {
      });
    }
    // authentication
    if (didDodocument?.authentication != undefined && didDodocument?.authentication.length > 0) {
      for (let index = 0; index < didDodocument?.authentication.length; index++) {
        const element = didDodocument?.authentication[index];
        console.log(` document authentication ${index}: ${element}`)
      }
    }
    // assertionMethod
    if (didDodocument?.assertionMethod != undefined && didDodocument?.assertionMethod.length > 0) {
      for (let index = 0; index < didDodocument?.assertionMethod.length; index++) {
        const element = didDodocument?.assertionMethod[index];
        console.log(` document assertionMethod ${index}: ${element}`)
      }
    }
    console.log('..................')
  }
}

main().catch(console.log)