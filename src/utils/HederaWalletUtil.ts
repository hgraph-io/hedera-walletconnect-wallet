import { HederaWallet } from '@/lib/HederaLib'

export async function createOrRestoreHederaWallet() {
  const accountId = process.env.NEXT_PUBLIC_HEDERA_ACCOUNT_ID
  const privateKey = process.env.HEDERA_PRIVATE_KEY
  if (!accountId || !privateKey) {
    throw new Error(
      'Missing required env vars: `NEXT_PUBLIC_HEDERA_ACCOUNT_ID` and/or `HEDERA_TEST_ACCOUNT_PRIVATE_KEY`'
    )
  }

  const hederaWallet = await HederaWallet.init({ accountId, privateKey })
  const hederaAddresses = hederaWallet.getAccounts()

  return {
    hederaWallet,
    hederaAddresses
  }
}
