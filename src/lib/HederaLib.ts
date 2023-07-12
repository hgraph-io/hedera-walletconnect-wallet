import { Client, Hbar, Transaction, PrivateKey, AccountId } from '@hashgraph/sdk'

type HederaWalletInitOptions = {
  accountId: string
  privateKey: string
}

export class HederaWallet {
  private client: Client
  private accountId: AccountId
  private privateKey: PrivateKey

  public constructor({ accountId, privateKey }: HederaWalletInitOptions) {
    const accountAddress = Number(accountId.split('.').pop())
    this.accountId = new AccountId(accountAddress)
    this.privateKey = PrivateKey.fromString(privateKey)
    this.client = this._initClient({ accountId, privateKey })
  }

  private _initClient({ accountId, privateKey }: HederaWalletInitOptions) {
    const client = Client.forTestnet()
    client.setOperator(accountId, privateKey)
    client.setDefaultMaxTransactionFee(new Hbar(100))
    client.setMaxQueryPayment(new Hbar(50))
    return client
  }

  public async getAccount() {
    return {
      accountId: this.accountId.toString()
    }
  }

  public transactionFromBytes(transactionBytes: Uint8Array) {
    if (!transactionBytes?.byteLength) return null
    return Transaction.fromBytes(transactionBytes)
  }

  public async signAndSendTransaction(transaction: Transaction) {
    try {
      const signedTransaction = await transaction.sign(this.privateKey)
      const response = await signedTransaction.execute(this.client)
      const receipt = await response.getReceipt(this.client)
      return {
        response,
        receipt
      }
    } catch (e) {
      console.error(e)
      return { error: (e as Error).message }
    }
  }
}
