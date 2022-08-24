import { useWeb3React } from '@web3-react/core'
import { Connector } from '@web3-react/types'
import { WalletConnect } from '@web3-react/walletconnect'
import { ethers, providers } from 'ethers'
import React, { useEffect, useMemo, ReactNode } from 'react'
import { getConnectorInfo, CHAINS, getAddChainParameters, ConnectorId, ConnectorsData } from 'components/web3/Web3Types'
import { ContractCaller } from 'components/web3/contract/index'
import { Web3WalletContext } from 'hooks/useWeb3Wallet'
import { useAppDispatch } from 'redux/store'
import { setProfile } from 'redux/actions/setting'

const useWeb3WalletState = (connectorsData: Record<ConnectorId, { id: ConnectorId; name: string; connector: Connector }>) => {
    const { connector, account, chainId, isActive, error, provider } = useWeb3React()
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

    useEffect(() => {
        if (error) {
            if (error.message.includes('Disconnected from chain')) {
                activate(getConnectorInfo(connector).id)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error?.message])

    return {
        account: account?.toLowerCase(),
        switchNetwork,
        chain: chainId ? { ...CHAINS[chainId], id: chainId } : undefined,
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
    return (
        // cloneElement(children, {
        //     web3: state,
        // })
        <Web3WalletContext.Provider value={state}>{children}</Web3WalletContext.Provider>
    )
}

export default Web3WalletStateProvider
