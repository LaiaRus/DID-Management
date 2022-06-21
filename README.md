# Description

This program is implemented using Veramo APIs and it is able to create, list, modify and delete identifiers.

Infura is the connection point to  Ropsten testnet.

# Getting Started

Download all dependencies with npm:

```console
$ npm install
````

# Usage

## Create an identifier
```console
$ npm run id:create --alias John
```
This command creates a DID associated with an alias.  

## List all DID Documents
```console
$ npm run id:list
```
This functionality lists all created (and not already deleted) DIDs with its associated alias, service, keys, ethr address, balance and DID Document.

## Delete a specific identifier
```console
$ npm run id:delete --alias John
```
Use the alias to refer to a specific identifier.
## Delete all identifiers
```console
$ npm run id:delete-all
```
With this command you delete all DIDs stored in your SQLite database.
## Add a service 
> ⚠️ **WARING:** This action requires paying some Gas.
```console
$ npm run id:add-service --alias John
```
The added service is the following JSON, and it is an implementation of [Veramo’s IService](https://veramo.io/docs/api/core.iservice/):
```JSON
{
  "id": "did:web:veramo.dev#msg",
  "type": "Messaging",
  "serviceEndpoint": "https://veramo.dev/messaging",
  "description": "You can contact me by Telegram. My username is @Eu*****a."
}
```

## Add a key
> ⚠️ **WARING:** This action requires paying some Gas.
```console
$ npm run id:add-key --alias John
```
It adds a random public key to the DID Document of a DID with alias John.

For the actions that require paying some Gas, you can use [Ropsten testnet faucet](https://faucet.egorfine.com/) to get some free Ropsten Ethers to the DID's [*ether addr*](https://github.com/LaiaRus/DID-Management#list-all-did-documents).
