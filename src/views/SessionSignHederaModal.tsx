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
import { type Transaction } from '@hashgraph/sdk'
import { Button, Divider, Modal, Text } from '@nextui-org/react'
import { SignClientTypes } from '@walletconnect/types'
import { Fragment } from 'react'

type RequestParams = SignClientTypes.EventArguments['session_request']['params']
type FormattedRequestParams = Omit<SignClientTypes.EventArguments['session_request'], 'params'> & {
  request: {
    params: {
      transactionType: string
      transaction: Transaction
    }
  }
}

const formatParams = (params: RequestParams) => {
  const {
    method,
    params: { transaction }
  } = params.request
  switch (method) {
    case HEDERA_SIGNING_METHODS.HEDERA_SIGN_AND_SEND_TRANSACTION:
      const txnBytes = new Uint8Array(Object.values(transaction))
      const txn = hederaWallet.transactionFromBytes(txnBytes)
      const formatted: FormattedRequestParams = JSON.parse(JSON.stringify(params))
      formatted.request.params.transaction = txn
      return formatted
    default:
      return params
  }
}

const SummaryDetail = ({ label, value }: { label: string; value: string | undefined }) => {
  if (!value) return null
  return (
    <Text>
      <Text span>
        {`${label}: `}
        <Text span color="$gray400" weight="normal">
          {value}
        </Text>
      </Text>
    </Text>
  )
}

const TransactionSummary = ({ params }: { params: FormattedRequestParams }) => {
  const { transaction, transactionType } = params.request.params
  const shouldShow = Boolean(transaction.transactionMemo || transactionType)

  if (!shouldShow) return null

  return (
    <>
      <>
        <Text h5>Summary</Text>
        <SummaryDetail label="Type" value={transactionType} />
        <SummaryDetail label="Memo" value={transaction.transactionMemo} />
      </>
      <Divider y={2} />
    </>
  )
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
  const formattedParams = formatParams(params)

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

        <TransactionSummary params={formattedParams as FormattedRequestParams} />

        <RequestDataCard data={formattedParams} />

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
