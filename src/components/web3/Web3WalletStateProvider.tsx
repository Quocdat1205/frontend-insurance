import { useWeb3React } from '@web3-react/core'
import { Connector } from '@web3-react/types'
import { WalletConnect } from '@web3-react/walletconnect'
import { ethers, providers } from 'ethers'
import React, { useEffect, useMemo, ReactNode, useRef, useState } from 'react'
import { getConnectorInfo, getAddChainParameters, ConnectorId, ConnectorsData } from 'components/web3/Web3Types'
import { ContractCaller } from 'components/web3/contract/index'
import { Web3WalletContext } from 'hooks/useWeb3Wallet'
import Config from 'config/config'
import { RootStore, useAppSelector } from 'redux/store'
import { isMobile } from 'react-device-detect'
import { setAccount, setting } from 'redux/actions/setting'
import { Web3Provider } from "@ethersproject/providers";

const useWeb3WalletState = (connectorsData: Record<ConnectorId, { id: ConnectorId; name: string; connector: Connector }>) => {
    const { connector, account, chainId, isActive, error, provider } = useWeb3React()
    const connected = useAppSelector((state: RootStore) => state.setting.account)
    const loading = useAppSelector((state: RootStore) => state.setting.loading_account)
    const dispatch = useAppDispatch()
    const contractCaller = useRef<any>(null)
    const [doReload, setDoReload] = useState(false)

    const activate = async (connectorId: ConnectorId, _chainId?: number) => {
        const wallet = sessionStorage.getItem('PUBLIC_WALLET')
        const { connector: _connector } = connectorsData[connectorId ?? connected?.wallet ?? wallet]
        _connector instanceof WalletConnect
            ? await _connector.activate(_chainId)
            : await _connector.activate(!_chainId ? undefined : getAddChainParameters(_chainId))
    }

    const deactivate = async () => {
        await connector.deactivate()
    }

    console.log('providerrrr', contractCaller)
    console.log('connector', connector)

    useEffect(() => {
        connector.connectEagerly && connector.connectEagerly()
    }, [])

    // useEffect(() => {
    //     if (!isActive && !loading && connected?.address) {
    //         Config.logout()
    //     } else if (isActive && !connected?.address) {
    //         dispatch(setting())
    //     }
    // }, [isActive, loading, connected, isActivating])

    // const contractCaller = useMemo(() => {
    //     console.log('changed provider', currentProvider)
    //     return currentProvider ? new ContractCaller(currentProvider as providers.Web3Provider) : null
    // }, [currentProvider])


    const switchNetwork = async (_chainId: number) => {
        activate(getConnectorInfo(connector).id, _chainId)
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
        account: account?.toLowerCase(),
        switchNetwork,
        chain: chainId ? { ...Config.networks[chainId], id: chainId } : undefined,
        activate,
        deactivate,
        isActive,
        error,
        connector: getConnectorInfo(connector),
        provider,
        // balance,
        contractCaller,
        getBalance,
    }
}

function Web3WalletStateProvider({ children, connectorsData }: { children: ReactNode; connectorsData: ConnectorsData }) {
    const state = useWeb3WalletState(connectorsData)

    console.log('state_____', state)

    useEffect(() => {
        if (isMobile || state?.account !== Config.web3?.account || state?.contractCaller !== Config.web3?.contractCaller) {
            Config.web3 = state
        } else {
            Config.web3 = Config.web3 ?? state
        }
    }, [state.account, state.contractCaller])

    return <Web3WalletContext.Provider value={state}>{children}</Web3WalletContext.Provider>
}

export default Web3WalletStateProvider
