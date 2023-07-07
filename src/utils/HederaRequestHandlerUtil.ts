import { HEDERA_SIGNING_METHODS } from '@/data/HederaData'
import { formatJsonRpcError, formatJsonRpcResult } from '@json-rpc-tools/utils'
import { SignClientTypes } from '@walletconnect/types'
import { getSdkError } from '@walletconnect/utils'
import { hederaWallet } from './HederaWalletUtil'

export async function approveHederaRequest(
  requestEvent: SignClientTypes.EventArguments['session_request']
) {
  const { params, id } = requestEvent
  const { request } = params

  switch (request.method) {
    case HEDERA_SIGNING_METHODS.HEDERA_SIGN_AND_SEND_TRANSACTION:
      console.log('approve', { method: request.method, id, params })
      try {
        const transactionBytes = new Uint8Array(Object.values(request.params.transaction))
        const result = await hederaWallet.signAndSendTransaction(transactionBytes)
        return formatJsonRpcResult(id, result)
      } catch (e) {
        console.log(e)
      }

    default:
      throw new Error(getSdkError('INVALID_METHOD').message)
  }
}

export function rejectHederaRequest(request: SignClientTypes.EventArguments['session_request']) {
  const { id } = request

  return formatJsonRpcError(id, getSdkError('USER_REJECTED_METHODS').message)
}
