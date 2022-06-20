
import { CredentialIssuer, W3cMessageHandler } from '@veramo/credential-w3c'
import { JwtMessageHandler } from '@veramo/did-jwt';
import { createAgent, IDIDManager, IResolver, IDataStore, IKeyManager} from '@veramo/core'
import { DIDManager } from '@veramo/did-manager'
import { EthrDIDProvider } from '@veramo/did-provider-ethr'
import { WebDIDProvider } from '@veramo/did-provider-web'
import { KeyManager } from '@veramo/key-manager'
import { MessageHandler } from '@veramo/message-handler'
import { KeyManagementSystem, SecretBox } from '@veramo/kms-local'
import { DIDResolverPlugin } from '@veramo/did-resolver'
import { Resolver } from 'did-resolver'
import { getResolver as ethrDidResolver } from 'ethr-did-resolver'
import { getResolver as webDidResolver } from 'web-did-resolver'
import { Entities, KeyStore, DIDStore, IDataStoreORM, PrivateKeyStore, migrations } from '@veramo/data-store'
import { createConnection } from 'typeorm'
import secrets from '../secret'

const DATABASE_FILE = 'database.sqlite'
const INFURA_PROJECT_ID = secrets.INFURA_PROJECT_ID 
const KMS_SECRET_KEY =  secrets.KMS_SECRET_KEY

const dbConnection = createConnection({
    type: 'sqlite',
    database: DATABASE_FILE,
    synchronize: false,
    migrations,
    migrationsRun: true,
    logging: ['error', 'info', 'warn'],
    entities: Entities,
})

export const agent = createAgent<IDIDManager & IKeyManager & IDataStore & IDataStoreORM & IResolver>({
    plugins: [
      new KeyManager({
        store: new KeyStore(dbConnection),
        kms: {
          local: new KeyManagementSystem(new PrivateKeyStore(dbConnection, new SecretBox(KMS_SECRET_KEY))),
        },
      }),
      new DIDManager({
        store: new DIDStore(dbConnection),
        defaultProvider: 'did:ethr:ropsten',
        providers: {
          'did:ethr:ropsten': new EthrDIDProvider({
            defaultKms: 'local',
            network: 'ropsten',
            rpcUrl: 'https://ropsten.infura.io/v3/' + INFURA_PROJECT_ID,
            gas: 500000,
          }),
          'did:ethr:rinkeby': new EthrDIDProvider({
            defaultKms: 'local',
            network: 'rinkeby',
            rpcUrl: 'https://rinkeby.infura.io/v3/' + INFURA_PROJECT_ID,
            gas: 500000,
          }),
          'did:web': new WebDIDProvider({
            defaultKms: 'local',
          }),
        },
      }),
      new DIDResolverPlugin({
        resolver: new Resolver({
          ...ethrDidResolver({ infuraProjectId: INFURA_PROJECT_ID }),
          ...webDidResolver(),
        }),
      }),
      new CredentialIssuer(),
      new MessageHandler({
        messageHandlers: [
          new JwtMessageHandler(),
          new W3cMessageHandler(),
        ],
      }),
    ],
  })


