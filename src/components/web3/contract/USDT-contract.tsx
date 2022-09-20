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
        return weiToEther(value)
    }

    async allowance(ownerAddress: string, targetAddress: string): Promise<BigNumber> {
        return await this.contract.allowance(ownerAddress, targetAddress)
    }

    async approve(targetAddress: string, value: BigNumber): Promise<void> {
        const signer = this.provider.getSigner()
        const tx = await this.contract.connect(signer).approve(targetAddress, value)
        await tx.wait()
    }
}

export default USDT_Contract
