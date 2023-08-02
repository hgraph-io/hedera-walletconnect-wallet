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
    case HEDERA_SIGNING_METHODS.HEDERA_SIGN_AND_EXECUTE_TRANSACTION:
      console.log('approve', { method: request.method, id, params })
      try {
        const transaction = hederaWallet.transactionFromEncodedBytes(
          params.request.params.transaction.bytes
        )
        if (!transaction) {
          return formatJsonRpcError(id, 'Unable to build transaction from bytes.')
        }
        const result = await hederaWallet.signAndSendTransaction(transaction)
        return formatJsonRpcResult(id, result)
      } catch (e) {
        console.log(e)
      }

    default:
      return formatJsonRpcError(id, getSdkError('INVALID_METHOD').message)
  }
}

export function rejectHederaRequest(request: SignClientTypes.EventArguments['session_request']) {
  const { id } = request

  return formatJsonRpcError(id, getSdkError('USER_REJECTED_METHODS').message)
}
