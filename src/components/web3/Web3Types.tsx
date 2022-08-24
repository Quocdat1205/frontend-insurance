import { MetaMask } from '@web3-react/metamask'
import type { AddEthereumChainParameter, Connector } from '@web3-react/types'
import { WalletConnect } from '@web3-react/walletconnect'
import { BigNumber, ethers } from 'ethers'

interface BasicChainInformation {
    urls: string[]
    name: string
}

interface ExtendedChainInformation extends BasicChainInformation {
    nativeCurrency: AddEthereumChainParameter['nativeCurrency']
    blockExplorerUrls: AddEthereumChainParameter['blockExplorerUrls']
}

export type ConnectorInfo = {
    id: ConnectorId
    name: string
    connector: Connector
}
export const wallets = {
    metaMask: 'metaMask',
    walletConnect: 'walletConnect',
    coinbaseWallet: 'coinbaseWallet',
}
export type ConnectorId = 'metaMask' | 'walletConnect' | 'coinbaseWallet'
export type ConnectorsData = Record<ConnectorId, ConnectorInfo>
export type ChainData = {
    chainId: number
    chain: string
    network: string
    networkId: number
    icon?: any
}
export type ChainDataList = {
    [chainId: number]: ChainData
}

export const getConnectorInfo = (connector: Connector): ConnectorInfo => {
    if (connector instanceof MetaMask) {
        return {
            id: 'metaMask',
            name: 'MetaMask',
            connector,
        }
    }
    if (connector instanceof WalletConnect) {
        return {
            id: 'walletConnect',
            name: 'WalletConnect',
            connector,
        }
    }
    return {
        id: 'coinbaseWallet',
        name: 'Coinbase Wallet',
        connector,
    }
}

export const CHAINS: {
    [chainId: number]: BasicChainInformation | ExtendedChainInformation
} = {
    1: {
        urls: ['https://mainnet.infura.io/v3/f87b967bc65a41c0a1a25635493fa482'],
        name: 'Mainnet',
    },

    4: {
        urls: ['https://rinkeby.infura.io/v3/f87b967bc65a41c0a1a25635493fa482'],
        name: 'Rinkeby',
    },

    42: {
        urls: ['https://kovan.infura.io/ws/v3/f87b967bc65a41c0a1a25635493fa482'],
        name: 'Kovan',
    },
}

function isExtendedChainInformation(chainInformation: BasicChainInformation | ExtendedChainInformation): chainInformation is ExtendedChainInformation {
    return !!(chainInformation as ExtendedChainInformation).nativeCurrency
}

export function getAddChainParameters(chainId: number): AddEthereumChainParameter | number {
    const chainInformation = CHAINS[chainId]
    if (isExtendedChainInformation(chainInformation)) {
        return {
            chainId,
            chainName: chainInformation.name,
            nativeCurrency: chainInformation.nativeCurrency,
            rpcUrls: chainInformation.urls,
            blockExplorerUrls: chainInformation.blockExplorerUrls,
        }
    }
    return chainId
}

export const etherToWei = (amount: number | string) => ethers.utils.parseEther(amount.toString())

export const weiToEther = (wei: string | BigNumber) => parseFloat(ethers.utils.formatEther(wei))
