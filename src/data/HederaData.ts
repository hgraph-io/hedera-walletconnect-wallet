import { ChainMetadata } from './types'

export type THederaChain = 'hedera:testnet'

type HederaChain = Record<THederaChain, ChainMetadata>

export const HEDERA_MAINNET_CHAINS = {
  // TODO
}

export const HEDERA_TESTNET_CHAINS: HederaChain = {
  'hedera:testnet': {
    chainId: 'testnet',
    name: 'Hedera Testnet',
    logo: '/chain-logos/hedera-hbar-logo.png',
    rgb: '118, 90, 234',
    // TODO: not going to use this endpoint I don't think, just a placeholder for now
    rpc: 'https://testnet.hashio.io/api'
  }
}

export const HEDERA_CHAINS = { ...HEDERA_TESTNET_CHAINS }

export enum HEDERA_SIGNING_METHODS {
  HEDERA_SIGN_AND_EXECUTE_TRANSACTION = 'hedera_signAndExecuteTransaction',
  HEDERA_SIGN_AND_RETURN_TRANSACTION = 'hedera_signAndReturnTransaction',
  HEDERA_SIGN_MESSAGE = 'hedera_signMessage'
}
