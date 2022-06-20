import { agent } from './veramo/setup'

async function main() {
    const identifiers = await agent.didManagerFind()
    console.log(`Deleting ${identifiers.length} identifiers`)
    for (let i = 0; i < identifiers.length; i++) {
        const id = identifiers[i]
        console.log(`Deleting ${id.did}`)
        await agent.didManagerDelete(id)
    }
}

main().catch(console.log)