import { initializeConnector, Web3ReactHooks, Web3ReactProvider } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { Connector } from '@web3-react/types'
import { WalletConnect } from '@web3-react/walletconnect'
import { ReactNode, useMemo } from 'react'

import { getConnectorInfo } from 'components/web3/Web3Types'
import Web3WalletStateProvider from 'components/web3/Web3WalletStateProvider'
import { CoinbaseWallet } from '@web3-react/coinbase-wallet'

export interface Web3WalletProviderProps {
    children: ReactNode
    config: {
        walletConnect?: ConstructorParameters<typeof WalletConnect>['1']
        coinbaseWallet: ConstructorParameters<typeof CoinbaseWallet>['1']
    }
}

function MetaMaskProvider({ children, config }: Web3WalletProviderProps) {
    const [metaMask, metaMaskHooks] = useMemo(() => initializeConnector<MetaMask>((actions) => new MetaMask(actions)), [])

    const [coinbaseWallet, coinbaseHooks] = useMemo(
        () => initializeConnector<CoinbaseWallet>((actions) => new CoinbaseWallet(actions, config.coinbaseWallet)),
        [config.coinbaseWallet],
    )

    const connectors: [Connector, Web3ReactHooks][] = useMemo(
        () => [
            [metaMask, metaMaskHooks],
            [coinbaseWallet, coinbaseHooks],
        ],
        [metaMask, metaMaskHooks, coinbaseWallet, coinbaseHooks],
    )
    const connectorsData: any = {
        metaMask: getConnectorInfo(metaMask),
        coinbaseWallet: getConnectorInfo(coinbaseWallet),
    }

    return (
        <Web3ReactProvider connectors={connectors}>
            <Web3WalletStateProvider connectorsData={connectorsData}>{children}</Web3WalletStateProvider>
        </Web3ReactProvider>
    )
}

export default MetaMaskProvider
