import { HEDERA_SIGNING_METHODS } from '@/data/HederaData'
import { formatJsonRpcError, formatJsonRpcResult } from '@json-rpc-tools/utils'
import { SignClientTypes } from '@walletconnect/types'
import { getSdkError } from '@walletconnect/utils'

export async function approveHederaRequest(
  requestEvent: SignClientTypes.EventArguments['session_request']
) {
  const { params, id, topic } = requestEvent
  const { chainId, request } = params

  switch (request.method) {
    case HEDERA_SIGNING_METHODS.HEDERA_SIGN_AND_SEND_TRANSACTION:
      console.log('approve', { method: request.method, id, params })
      return formatJsonRpcResult(id, { requestParams: request.params })
    default:
      throw new Error(getSdkError('INVALID_METHOD').message)
  }
}

export function rejectHederaRequest(request: SignClientTypes.EventArguments['session_request']) {
  const { id } = request

  return formatJsonRpcError(id, getSdkError('USER_REJECTED_METHODS').message)
}
