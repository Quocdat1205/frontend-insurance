import { BigNumber, Contract, ethers, providers } from 'ethers'
import { weiToEther } from 'components/web3/Web3Types'
import { USDT_ABI } from 'components/web3/constants/abi/USDT_ABI'

class USDT_Contract {
    provider: providers.Web3Provider
    contract: Contract

    constructor(provider: providers.Web3Provider, contractAddress: string, contractAbi?: any) {
        this.provider = provider
        this.contract = new ethers.Contract(contractAddress, contractAbi || USDT_ABI, provider.getSigner())
    }

    async balanceOf(address: string): Promise<number> {
        const value = await this.contract.balanceOf(address)
        console.log(value)

        return weiToEther(value)
    }
}

export default USDT_Contract
