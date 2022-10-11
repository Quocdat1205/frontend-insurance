import { useWeb3React } from '@web3-react/core'
import { Connector } from '@web3-react/types'
import { ethers } from 'ethers'
import React, { useEffect, ReactNode, useState } from 'react'
import { getConnectorInfo, getAddChainParameters, ConnectorId, ConnectorsData } from 'components/web3/Web3Types'
import { ContractCaller } from 'components/web3/contract/index'
import { Web3WalletContext } from 'hooks/useWeb3Wallet'
import Config from 'config/config'
import { RootStore, useAppSelector } from 'redux/store'
import { Web3Provider } from '@ethersproject/providers'

const useWeb3WalletState = (connectorsData: Record<ConnectorId, { id: ConnectorId; name: string; connector: Connector }>) => {
    const { connector, account, isActive, error, provider } = useWeb3React()
    const connected = useAppSelector((state: RootStore) => state.setting.account)
    const [flag, setFlag] = useState(false)

    const activate = async (connectorId: ConnectorId, _chainId?: number, cb?: () => void) => {
        const wallet = sessionStorage.getItem('PUBLIC_WALLET')
        const _wallet = connectorId ?? connected?.wallet ?? wallet
        const { connector: _connector } = connectorsData[_wallet]
        await _connector.deactivate()
        await _connector.activate(!_chainId ? undefined : getAddChainParameters(_chainId))
        initConfig(_connector, _wallet, cb)
    }

    const initConfig = async (connector: any, wallet: ConnectorId, cb?: () => void) => {
        const chainId = Number(connector?.provider?.chainId ?? (window as any).ethereum?.providers[0]?.getChainId())
        if (!connector.provider) {
            await connector.activate(chainId || getAddChainParameters(chainId))
        }
        const contractCaller: any = new ContractCaller(new Web3Provider(connector.provider as any))
        Config.web3.chain = { ...Config.networks[chainId], id: chainId }
        Config.web3.connector = connectorsData[wallet]
        Config.web3.contractCaller = contractCaller
        Config.web3.provider = contractCaller?.provider
        Config.web3.account = contractCaller?.provider?.provider?.selectedAddress ?? Config.web3.account
        setFlag(!flag)
        if (cb) cb()
    }

    const deactivate = async () => {
        await connector.deactivate()
    }

    useEffect(() => {
        connector.connectEagerly && connector.connectEagerly()
        const address = sessionStorage.getItem('PUBLIC_ADDRESS')
        const wallet = sessionStorage.getItem('PUBLIC_WALLET')
        if (wallet && address) {
            const { connector: _connector }: any = connectorsData[wallet as ConnectorId]
            setTimeout(() => {
                initConfig(_connector, wallet as ConnectorId)
            }, 500)
        }
    }, [])

    const switchNetwork = async (_chainId: number) => {
        await activate(getConnectorInfo(connector).id, _chainId)
    }

    const getBalance = async () => {
        const balance = provider && (await provider!.getBalance(account!).then((res) => parseFloat(ethers.utils.formatEther(res))))
        return balance
    }

    useEffect(() => {
        if (error) {
            // console.log(error)
            if (error.message.includes('Disconnected from chain')) {
                activate(getConnectorInfo(connector).id)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error?.message])

    return {
        account: Config.web3?.account,
        switchNetwork,
        chain: Config.web3?.chain,
        activate,
        deactivate,
        isActive,
        error,
        connector: Config.web3?.connector,
        provider: Config.web3?.provider,
        // balance,
        contractCaller: Config.web3?.contractCaller,
        getBalance,
    }
}

function Web3WalletStateProvider({ children, connectorsData }: { children: ReactNode; connectorsData: ConnectorsData }) {
    const state = useWeb3WalletState(connectorsData)
    Config.web3 = state
    return <Web3WalletContext.Provider value={state}>{children}</Web3WalletContext.Provider>
}

export default Web3WalletStateProvider
