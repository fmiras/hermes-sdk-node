import dotenv from 'dotenv'
import { PluggyClient } from 'pluggy-sdk'
import { PLUGGY_BANK_CONNECTOR, PLUGGY_BANK_CREDENTIALS, sleep } from './utils'

dotenv.config()

void (async function(): Promise<void> {
  const { CLIENT_ID = '', CLIENT_SECRET = '' } = process.env

  const client = new PluggyClient({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
  })

  const { acquirer } = client

  // We create the sandbox item to review its data
  let item = await client.createItem(PLUGGY_BANK_CONNECTOR, PLUGGY_BANK_CREDENTIALS)
  while (!['LOGIN_ERROR', 'OUTDATED', 'UPDATED'].includes(item.status)) {
    await sleep(3000)
    item = await client.fetchItem(item.id)
  }

  console.log(`Item completed execution with status ${item.status}`)
  if (['LOGIN_ERROR', 'OUTDATED'].includes(item.status)) return

  // Once the connection was done successfully, lets review its acquirer sales
  const acquirerSalesPage = await acquirer.fetchSales(item.id)
  
  console.log(acquirerSalesPage)
})()
