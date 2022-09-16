import { useWeb3React } from '@web3-react/core'
import { Connector } from '@web3-react/types'
import { WalletConnect } from '@web3-react/walletconnect'
import { ethers, providers } from 'ethers'
import React, { useEffect, useMemo, ReactNode, useRef } from 'react'
import { getConnectorInfo, getAddChainParameters, ConnectorId, ConnectorsData } from 'components/web3/Web3Types'
import { ContractCaller } from 'components/web3/contract/index'
import { Web3WalletContext } from 'hooks/useWeb3Wallet'
import Config from 'config/config'
import { RootStore, useAppDispatch, useAppSelector } from 'redux/store'
import { onLoading } from 'redux/actions/setting'

const useWeb3WalletState = (connectorsData: Record<ConnectorId, { id: ConnectorId; name: string; connector: Connector }>) => {
    const { connector, account, chainId, isActive, error, provider } = useWeb3React()
    const loading_account = useAppSelector((state: RootStore) => state.setting.loading_account)
    const dispatch = useAppDispatch()

    const activate = async (connectorId: ConnectorId, _chainId?: number) => {
        const { connector: _connector } = connectorsData[connectorId]
        _connector.deactivate()
        _connector instanceof WalletConnect
            ? await _connector.activate(_chainId)
            : await _connector.activate(!_chainId ? undefined : getAddChainParameters(_chainId))
    }

    const deactivate = () => {
        connector.deactivate()
    }

    useEffect(() => {
        connector.connectEagerly && connector.connectEagerly()
    }, [connector])

    const timer = useRef<any>(null)
    useEffect(() => {
        if (loading_account) {
            clearTimeout(timer.current)
            timer.current = setTimeout(() => {
                dispatch(onLoading(false))
            }, 1000)
        } else {
            if (Config.chains.find((rs: number) => rs !== chainId) && chainId && isActive) {
                switchNetwork(Config.chains[0])
            }
        }
    }, [isActive, loading_account, chainId])

    const contractCaller = useMemo(() => (provider ? new ContractCaller(provider as providers.Web3Provider) : null), [provider])

    // const { data: balance } = useQuery(
    //     "balance",
    //     () =>
    //         provider!
    //             .getBalance(account!)
    //             .then((res) => parseFloat(ethers.utils.formatEther(res))),
    //     {
    //         enabled: !!provider && !!account,
    //         initialData: 0,
    //     }
    // );

    const switchNetwork = async (_chainId: number) => {
        activate(getConnectorInfo(connector).id, _chainId)
    }

    const getBalance = async () => {
        const balance = provider && (await provider!.getBalance(account!).then((res) => parseFloat(ethers.utils.formatEther(res))))
        return balance
    }

    // const balanceOf = async (address: string) => {
    //     const balance = provider && (await provider!.balanceOf(address).then((res) => parseFloat(ethers.utils.formatEther(res))))
    //     return balance
    // }

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
        // balanceOf,
        contractCaller,
        getBalance,
    }
}

function Web3WalletStateProvider({ children, connectorsData }: { children: ReactNode; connectorsData: ConnectorsData }) {
    const state = useWeb3WalletState(connectorsData)
    Config.web3 = state
    return (
        // cloneElement(children, {
        //     web3: state,
        // })
        <Web3WalletContext.Provider value={state}>{children}</Web3WalletContext.Provider>
    )
}

export default Web3WalletStateProvider
