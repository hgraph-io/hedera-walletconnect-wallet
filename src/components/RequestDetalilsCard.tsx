import { EIP155_CHAINS, TEIP155Chain } from '@/data/EIP155Data'
import { NEAR_TEST_CHAINS, TNearChain } from '@/data/NEARData'
import { HEDERA_CHAINS, THederaChain } from '@/data/HederaData'
import { Col, Divider, Row, Text } from '@nextui-org/react'
import { Fragment } from 'react'

/**
 * Types
 */
interface IProps {
  chains: string[]
  protocol: string
}

/**
 * Component
 */
export default function RequesDetailsCard({ chains, protocol }: IProps) {
  return (
    <Fragment>
      <Row>
        <Col>
          <Text h5>Blockchain(s)</Text>
          <Text color="$gray400">
            {chains
              .map(
                chain =>
                  EIP155_CHAINS[chain as TEIP155Chain]?.name ??
                  NEAR_TEST_CHAINS[chain as TNearChain]?.name ??
                  HEDERA_CHAINS[chain as THederaChain]?.name ??
                  chain
              )
              .join(', ')}
          </Text>
        </Col>
      </Row>

      <Divider y={2} />

      <Row>
        <Col>
          <Text h5>Relay Protocol</Text>
          <Text color="$gray400">{protocol}</Text>
        </Col>
      </Row>
    </Fragment>
  )
}
