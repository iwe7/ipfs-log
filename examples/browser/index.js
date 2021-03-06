'use strict'

const IPFS = require('ipfs')
const Keystore = require('orbit-db-keystore')
const IdentityProvider = require('orbit-db-identity-provider')
const Log = require('../../src/log')
const { AccessController } = Log

const dataPath = './ipfs-log/examples/browser/ipfs-0.30.0'
const ipfs = new IPFS({
  repo: dataPath + '/index.js',
  start: false,
  EXPERIMENTAL: {
    pubsub: true
  }
})

ipfs.on('error', (e) => console.error(e))

ipfs.on('ready', async () => {
  const keystore = Keystore.create(dataPath + '/keystore')
  const access = new AccessController()
  const identity = await IdentityProvider.createIdentity({ id: 'exampleUser', keystore })
  const outputElm = document.getElementById('output')

  // When IPFS is ready, add some log entries
  let log = new Log(ipfs, access, identity, 'example-log')

  await log.append('one')
  const values = JSON.stringify(log.values, null, 2)
  console.log('\n', values)
  outputElm.innerHTML += values + '<br><br><hr>'

  await log.append({ two: 'hello' })
  const values2 = JSON.stringify(log.values, null, 2)
  console.log('\n', values2)
  outputElm.innerHTML += values2 + '<br><br>'
})
