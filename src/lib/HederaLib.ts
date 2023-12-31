import { Client, Hbar, Transaction, PrivateKey, AccountId } from '@hashgraph/sdk'

type HederaWalletOptions = {
  accountId: AccountId
  privateKey: PrivateKey
}

type InitOptions = {
  accountId: ConstructorParameters<typeof AccountId>[0]
  privateKey: string
}

export class HederaWallet {
  private client: Client
  private accountId: AccountId
  private privateKey: PrivateKey

  public constructor({ accountId, privateKey }: HederaWalletOptions) {
    this.accountId = accountId
    this.privateKey = privateKey
    this.client = this._initClient({ accountId, privateKey })
  }

  private _initClient({ accountId, privateKey }: HederaWalletOptions) {
    const client = Client.forTestnet()
    client.setOperator(accountId, privateKey)
    client.setDefaultMaxTransactionFee(new Hbar(100))
    client.setMaxQueryPayment(new Hbar(50))
    return client
  }

  public static init({ accountId, privateKey }: InitOptions) {
    return new HederaWallet({
      accountId: new AccountId(accountId),
      privateKey: PrivateKey.fromString(privateKey)
    })
  }

  public getAccountAddress() {
    return this.accountId.toString()
  }

  public transactionFromEncodedBytes(transactionBytes: string) {
    if (!transactionBytes) return null
    const decoded = Buffer.from(transactionBytes, 'base64')
    return Transaction.fromBytes(decoded)
  }

  public async signAndExecuteTransaction(transaction: Transaction) {
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

  public async signAndReturnTransaction(transaction: Transaction, type: string) {
    try {
      const signedTransaction = await transaction.sign(this.privateKey)
      const signedTransactionBytes = signedTransaction.toBytes()
      const encodedTransactionBytes = Buffer.from(signedTransactionBytes).toString('base64')
      return {
        transaction: {
          type,
          bytes: encodedTransactionBytes
        }
      }
    } catch (e) {
      console.error(e)
      return { error: (e as Error).message }
    }
  }

  public signMessage(bytes: string) {
    const buf = Buffer.from(bytes, 'base64')
    const signedMessage = this.privateKey.sign(buf)
    return {
      signature: Buffer.from(signedMessage).toString('base64')
    }
  }
}
