# Wallet Example (React, Typescript, Ethers, NextJS)

This demo wallet is a pared down version of WalletConnect's [react-wallet-v2 demo](https://github.com/WalletConnect/web-examples/tree/main/wallets/react-wallet-v2). This version of the app only showcases connecting a dApp and a wallet for Ethereum (EVM) chains via JSON-RPC and Hedera via the official `@hashgraph/sdk` [library](https://github.com/hashgraph/hedera-sdk-js).

This wallet is meant to be used in conjuction with the corresponding [hedera-walletconnect-dapp](https://github.com/hgraph-io/hedera-walletconnect-dapp). Please also set up that project.

## Getting started

Example is built atop of [NextJS](https://nextjs.org/) in order to abstract complexity of setting up bundlers, routing etc. So there are few steps you need to follow in order to set everything up

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/sign-in) and obtain a project id

2. Add your project details in [WalletConnectUtil.ts](https://github.com/WalletConnect/web-examples/blob/main/wallets/react-wallet-v2/src/utils/WalletConnectUtil.ts) file

3. Go to [Hedera Portal](https://portal.hedera.com/) to create a Testnet account

4. Install dependencies `yarn install`

5. Setup your environment variables

```bash
cp .env.local.example .env.local
```

Your `.env.local` now contains the following environment variables:

- `NEXT_PUBLIC_PROJECT_ID` (placeholder) - You can generate your own ProjectId at https://cloud.walletconnect.com
- `NEXT_PUBLIC_RELAY_URL` (already set)
- `NEXT_PUBLIC_HEDERA_ACCOUNT_ID` (placeholder) - Get your testnet account id from https://portal.hedera.com/
- `HEDERA_PRIVATE_KEY` (placeholder) - Get your testnet account id from https://portal.hedera.com/

6. Run `yarn dev` or `npm run dev` to start local development
7. Go to http://localhost:3001 (Note that you may have a better experience running in an incognito browser window)

## Navigating through example

1. Initial setup and initializations happen in [_app.ts](https://github.com/WalletConnect/web-examples/blob/main/wallets/react-wallet-v2/src/pages/_app.tsx) file
2. WalletConnect client and ethers are initialized in [useInitialization.ts ](https://github.com/WalletConnect/web-examples/blob/main/wallets/react-wallet-v2/src/hooks/useInitialization.ts) hook
3. Subscription and handling of WalletConnect events happens in [useWalletConnectEventsManager.ts](https://github.com/WalletConnect/web-examples/blob/main/wallets/react-wallet-v2/src/hooks/useWalletConnectEventsManager.ts) hook, that opens related [Modal views](https://github.com/WalletConnect/web-examples/tree/main/wallets/react-wallet-v2/src/views) and passes them all necessary data
4. [Modal views](https://github.com/WalletConnect/web-examples/tree/main/wallets/react-wallet-v2/src/views) are responsible for data display and handling approval or rejection actions
5. Upon approval or rejection, modals pass the request data to [RequestHandlerUtil.ts](https://github.com/WalletConnect/web-examples/blob/main/wallets/react-wallet-v2/src/utils/RequestHandlerUtil.ts) that performs all necessary work based on the request method and returns formated json rpc result data that can be then used for WalletConnect client responses

## Preview of wallet and dapp examples in action

https://user-images.githubusercontent.com/3154053/156764521-3492c232-7a93-47ba-88bd-2cee3f8366d4.mp4
