import { Client, Hbar, PrivateKey, AccountCreateTransaction } from '@hashgraph/sdk'

type HederaWalletInitOptions = {
  accountId: string
  privateKey: string
}

export class HederaWallet {
  private static client: Client
  private accountId: string

  private constructor(accountId: string) {
    this.accountId = accountId
  }

  public static async init({ accountId, privateKey }: HederaWalletInitOptions) {
    if (!this.client) {
      this.client = this._initClient({ accountId, privateKey })
    }
    const { testAccountId } = await this._createTestAccount()
    return new HederaWallet(testAccountId)
  }

  private static _initClient({ accountId, privateKey }: HederaWalletInitOptions) {
    const client = Client.forTestnet()
    client.setOperator(accountId, privateKey)
    client.setDefaultMaxTransactionFee(new Hbar(100))
    client.setMaxQueryPayment(new Hbar(50))
    return client
  }

  private static async _createTestAccount() {
    const testAccountPublicKey = PrivateKey.generateED25519().publicKey
    const testAccount = await new AccountCreateTransaction()
      .setKey(testAccountPublicKey)
      .setInitialBalance(Hbar.fromTinybars(1000))
      .execute(this.client)
    const txnReceipt = await testAccount.getReceipt(this.client)
    const testAccountId = txnReceipt.accountId?.toString()
    if (!testAccountId) {
      throw new Error('Failed to get account ID for newly created test account')
    }
    return { testAccountId }
  }

  public getAccounts() {
    return [this.accountId]
  }
}
