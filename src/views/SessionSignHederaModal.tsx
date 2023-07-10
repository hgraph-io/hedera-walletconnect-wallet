import ProjectInfoCard from '@/components/ProjectInfoCard'
import RequestDataCard from '@/components/RequestDataCard'
import RequestDetailsCard from '@/components/RequestDetalilsCard'
import RequestMethodCard from '@/components/RequestMethodCard'
import RequestModalContainer from '@/components/RequestModalContainer'
import { HEDERA_SIGNING_METHODS } from '@/data/HederaData'
import ModalStore from '@/store/ModalStore'
import { approveHederaRequest, rejectHederaRequest } from '@/utils/HederaRequestHandlerUtil'
import { hederaWallet } from '@/utils/HederaWalletUtil'
import { signClient } from '@/utils/WalletConnectUtil'
import { Button, Divider, Modal, Text } from '@nextui-org/react'
import { SignClientTypes } from '@walletconnect/types'
import { Fragment } from 'react'

type RequestParams = SignClientTypes.EventArguments['session_request']['params']

const formatParams = (params: RequestParams): RequestParams => {
  switch (params.request.method) {
    case HEDERA_SIGNING_METHODS.HEDERA_SIGN_AND_SEND_TRANSACTION:
      const txnBytes = new Uint8Array(Object.values(params.request.params.transaction))
      const transaction = hederaWallet.transactionFromBytes(txnBytes)
      const formatted = JSON.parse(JSON.stringify(params))
      formatted.request.params.transaction = transaction
      return formatted
    default:
      return params
  }
}

export default function SessionSignNearModal() {
  // Get request and wallet data from store
  const requestEvent = ModalStore.state.data?.requestEvent
  const requestSession = ModalStore.state.data?.requestSession

  // Ensure request and wallet are defined
  if (!requestEvent || !requestSession) {
    return <Text>Missing request data</Text>
  }

  // Get required request data
  const { topic, params } = requestEvent
  const { request, chainId } = params

  // Handle approve action (logic varies based on request method)
  async function onApprove() {
    if (requestEvent) {
      const response = await approveHederaRequest(requestEvent)
      await signClient.respond({
        topic,
        response
      })
      ModalStore.close()
    }
  }

  // Handle reject action
  async function onReject() {
    if (requestEvent) {
      const response = rejectHederaRequest(requestEvent)
      await signClient.respond({
        topic,
        response
      })
      ModalStore.close()
    }
  }

  return (
    <Fragment>
      <RequestModalContainer title="Hedera">
        <ProjectInfoCard metadata={requestSession.peer.metadata} />

        <Divider y={2} />

        <RequestDetailsCard chains={[chainId ?? '']} protocol={requestSession.relay.protocol} />

        <Divider y={2} />

        <RequestDataCard data={formatParams(params)} />

        <Divider y={2} />

        <RequestMethodCard methods={[request.method]} />
      </RequestModalContainer>

      <Modal.Footer>
        <Button auto flat color="error" onClick={onReject}>
          Reject
        </Button>
        <Button auto flat color="success" onClick={onApprove}>
          Approve
        </Button>
      </Modal.Footer>
    </Fragment>
  )
}
