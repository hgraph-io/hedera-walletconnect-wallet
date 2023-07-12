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
import {
  type TransferTransaction,
  RequestType,
  TopicMessageSubmitTransaction
} from '@hashgraph/sdk'
import { Button, Divider, Modal, Text } from '@nextui-org/react'
import { SignClientTypes } from '@walletconnect/types'
import { Fragment } from 'react'

type HederaSignAndSendTransactionParams = {
  transaction: {
    type: string
    bytes: Record<string, number>
  }
}

type SessionRequestParams = SignClientTypes.EventArguments['session_request']['params']

const buildTransactionFromBytes = (
  transaction: HederaSignAndSendTransactionParams['transaction']
) => {
  const txnBytes = new Uint8Array(Object.values(transaction.bytes))
  return hederaWallet.transactionFromBytes(txnBytes)
}

type SummaryDetailProps = {
  label: string
  data: JSX.Element | string | null | undefined
}

const SummaryDetail = ({ label, data }: SummaryDetailProps) => {
  if (!data) return null
  return (
    <div style={{ paddingTop: 8 }}>
      <Text b>{`${label}`}</Text>
      {typeof data === 'string' ? (
        <Text color="$gray400" weight="normal">
          {data}
        </Text>
      ) : (
        data
      )}
    </div>
  )
}

const SignAndSendTransactionSummary = ({ params }: { params: SessionRequestParams }) => {
  const { transaction } = params.request.params as HederaSignAndSendTransactionParams
  const transactionFromBytes = buildTransactionFromBytes(transaction)
  const shouldShow = transaction.bytes && transactionFromBytes

  if (!shouldShow) return null

  let dataSummary: SummaryDetailProps[] = []

  if (transaction.type === RequestType.CryptoTransfer.toString()) {
    const hbarTransferMap = (transactionFromBytes as TransferTransaction).hbarTransfers
    if (hbarTransferMap) {
      const hbarTransfers = Array.from(hbarTransferMap)

      const HbarTransferSummary = (
        <>
          {hbarTransfers.map(([accountId, amount]) => (
            <div>
              <Text span color="$gray400">
                {`• ${accountId.toString()}: `}
                <Text span color={amount.isNegative() ? 'error' : 'success'}>
                  {amount.toString()}
                </Text>
              </Text>
            </div>
          ))}
        </>
      )
      dataSummary.push({ label: 'HBAR Transfers', data: HbarTransferSummary })
    }

    /**
     * TODO: Handle token transfers and NFT transfers as well
     */
  }

  if (transaction.type === RequestType.ConsensusSubmitMessage.toString()) {
    const txn = transactionFromBytes as TopicMessageSubmitTransaction
    const uint8Message = txn.getMessage()
    const message = uint8Message && Buffer.from(uint8Message as any, 'base64').toString()

    dataSummary.push({ label: 'Topic ID', data: txn.topicId?.toString() })
    dataSummary.push({ label: 'Message', data: message })
  }

  return (
    <>
      <Text h5>Summary</Text>
      <SummaryDetail label="Type" data={transaction.type} />
      <SummaryDetail label="Memo" data={transactionFromBytes?.transactionMemo} />
      {dataSummary.length > 0 &&
        dataSummary.map(({ label, data }) => <SummaryDetail label={label} data={data} />)}
    </>
  )
}

const RequestSummary = ({ params }: { params: SessionRequestParams }) => {
  switch (params.request.method) {
    case HEDERA_SIGNING_METHODS.HEDERA_SIGN_AND_SEND_TRANSACTION:
      return <SignAndSendTransactionSummary params={params} />
    default:
      return null
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

        <RequestSummary params={params} />

        <Divider y={2} />

        <RequestDataCard data={params} />

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
