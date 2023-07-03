import SettingsStore from '@/store/SettingsStore'
import { eip155Addresses } from '@/utils/EIP155WalletUtil'
import { nearAddresses } from '@/utils/NearWalletUtil'
import { solanaAddresses } from '@/utils/SolanaWalletUtil'
import { multiversxAddresses } from '@/utils/MultiversxWalletUtil'
import { tezosAddresses } from '@/utils/TezosWalletUtil'
import { useSnapshot } from 'valtio'

export default function AccountPicker() {
  const { account } = useSnapshot(SettingsStore.state)

  function onSelect(value: string) {
    const account = Number(value)
    SettingsStore.setAccount(account)
    SettingsStore.setEIP155Address(eip155Addresses[account])
    SettingsStore.setSolanaAddress(solanaAddresses[account])
    SettingsStore.setNearAddress(nearAddresses[account])
    SettingsStore.setMultiversxAddress(multiversxAddresses[account])
    SettingsStore.setTezosAddress(tezosAddresses[account])
  }

  return (
    <select value={account} onChange={e => onSelect(e.currentTarget.value)} aria-label="addresses">
      <option value={0}>Account 1</option>
      <option value={1}>Account 2</option>
    </select>
  )
}
