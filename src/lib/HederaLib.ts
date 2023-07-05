import { Client, Hbar } from '@hashgraph/sdk'

type HederaWalletInitOptions = {
  accountId: string
  privateKey: string
}

export class HederaWallet {
  private client: Client
  private accountId: string

  public constructor({ accountId, privateKey }: HederaWalletInitOptions) {
    this.accountId = accountId
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
      accountId: this.accountId
    }
  }

  /**
   * This will be used to create an account to transfer HBAR to.
   * Will be used in conjunction with AccountDeleteTransaction
   */
  // private static async _createTestAccount() {
  //   const testAccountPublicKey = PrivateKey.generateED25519().publicKey
  //   const testAccount = await new AccountCreateTransaction()
  //     .setKey(testAccountPublicKey)
  //     .setInitialBalance(Hbar.fromTinybars(1000))
  //     .execute(this.client)
  //   const txnReceipt = await testAccount.getReceipt(this.client)
  //   const testAccountId = txnReceipt.accountId?.toString()
  //   if (!testAccountId) {
  //     throw new Error('Failed to get account ID for newly created test account')
  //   }
  //   return { testAccountId }
  // }
}
