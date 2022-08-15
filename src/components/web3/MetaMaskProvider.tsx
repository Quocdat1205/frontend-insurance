import {
  initializeConnector,
  useWeb3React,
  Web3ReactHooks,
  Web3ReactProvider,
} from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { Connector } from '@web3-react/types'
import { WalletConnect } from '@web3-react/walletconnect'
import { createContext, ReactNode, useEffect, useMemo, useRef } from 'react'

import { getConnectorInfo } from 'components/web3/Web3Types'
import Web3WalletStateProvider from 'components/web3/Web3WalletStateProvider'

export interface Web3WalletProviderProps {
  children: ReactNode
  config?: {
    walletConnect: ConstructorParameters<typeof WalletConnect>['1']
  }
}

function MetaMaskProvider({ children, config }: Web3WalletProviderProps) {
  const [metaMask, metaMaskHooks] = useMemo(
    () => initializeConnector<MetaMask>((actions) => new MetaMask(actions)),
    [],
  )

  const connectors: [Connector, Web3ReactHooks][] = useMemo(
    () => [[metaMask, metaMaskHooks]],
    [metaMask, metaMaskHooks],
  )
  const connectorsData: any = {
    metaMask: getConnectorInfo(metaMask),
  }

  return (
    <Web3ReactProvider connectors={connectors}>
      <Web3WalletStateProvider connectorsData={connectorsData}>
        {children}
      </Web3WalletStateProvider>
    </Web3ReactProvider>
  )
}

export default MetaMaskProvider
