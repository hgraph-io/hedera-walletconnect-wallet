import { proxy } from 'valtio'

/**
 * Types
 */
interface State {
  testNets: boolean
  account: number
  eip155Address: string
  solanaAddress: string
  nearAddress: string
  tezosAddress: string
  relayerRegionURL: string
  activeChainId: string
}

/**
 * State
 */
const state = proxy<State>({
  testNets: typeof localStorage !== 'undefined' ? Boolean(localStorage.getItem('TEST_NETS')) : true,
  account: 0,
  activeChainId: '1',
  eip155Address: '',
  solanaAddress: '',
  nearAddress: '',
  tezosAddress: '',
  relayerRegionURL: ''
})

/**
 * Store / Actions
 */
const SettingsStore = {
  state,

  setAccount(value: number) {
    state.account = value
  },

  setEIP155Address(eip155Address: string) {
    state.eip155Address = eip155Address
  },

  setSolanaAddress(solanaAddress: string) {
    state.solanaAddress = solanaAddress
  },

  setNearAddress(nearAddress: string) {
    state.nearAddress = nearAddress
  },

  setRelayerRegionURL(relayerRegionURL: string) {
    state.relayerRegionURL = relayerRegionURL
  },

  setTezosAddress(tezosAddress: string) {
    state.tezosAddress = tezosAddress
  },

  setActiveChainId(value: string) {
    state.activeChainId = value
  },

  toggleTestNets() {
    state.testNets = !state.testNets
    if (state.testNets) {
      localStorage.setItem('TEST_NETS', 'YES')
    } else {
      localStorage.removeItem('TEST_NETS')
    }
  }
}

export default SettingsStore
