import { useContext, createContext } from 'react'

export const Web3WalletContext = createContext<any>(null)

const useWeb3USDT = () => {
    const context = useContext(Web3WalletContext)

    return context
}

export default useWeb3USDT
