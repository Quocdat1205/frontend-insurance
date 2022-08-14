import React, {
  createContext,
  useRef,
  useEffect,
  useState,
  cloneElement,
  useMemo,
  ReactNode,
} from 'react'
import { useWeb3React } from '@web3-react/core'
import { WalletConnect } from '@web3-react/walletconnect'
import { ethers, providers } from 'ethers'
import { Connector } from '@web3-react/types'

import {
  getConnectorInfo,
  CHAINS,
  getAddChainParameters,
  ConnectorId,
  ConnectorsData,
} from 'components/web3/Web3Types'
import { Web3WalletContext } from 'hooks/useWeb3Wallet'
import { ContractCaller } from 'components/web3/contract/index'

const useWeb3WalletState = (
  connectorsData: Record<
    ConnectorId,
    { id: ConnectorId; name: string; connector: Connector }
  >,
) => {
  const { connector, account, chainId, isActive, error, provider } =
    useWeb3React()

  const activate = async (connectorId: ConnectorId, chainId?: number) => {
    const { connector } = connectorsData[connectorId]
    connector.deactivate()
    connector instanceof WalletConnect
      ? await connector.activate(chainId)
      : await connector.activate(
          !chainId ? undefined : getAddChainParameters(chainId),
        )
  }

  const deactivate = () => {
    connector.deactivate()
  }

  useEffect(() => {
    connector.connectEagerly && connector.connectEagerly()
  }, [connector])

  const contractCaller = useMemo(
    () =>
      provider ? new ContractCaller(provider as providers.Web3Provider) : null,
    [provider],
  )

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

  const switchNetwork = async (chainId: number) => {
    activate(getConnectorInfo(connector).id, chainId)
  }

  const getBalance = async () => {
    const balance =
      provider &&
      (await provider!
        .getBalance(account!)
        .then((res) => parseFloat(ethers.utils.formatEther(res))))
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

function Web3WalletStateProvider({
  children,
  connectorsData,
}: {
  children: ReactNode
  connectorsData: ConnectorsData
}) {
  const state = useWeb3WalletState(connectorsData)
  return (
    // cloneElement(children, {
    //     web3: state,
    // })
    <Web3WalletContext.Provider value={state}>
      {children}
    </Web3WalletContext.Provider>
  )
}

export default Web3WalletStateProvider
