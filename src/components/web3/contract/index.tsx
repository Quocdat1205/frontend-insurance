import { BigNumber, ethers, providers } from 'ethers'

import { weiToEther } from 'components/web3/Web3Types'
import { INSURANCE_ABI } from 'components/web3/constants/abi/INSURANCE_ABI'
import { contractAddress } from 'components/web3/constants/contractAddress'
import InsuranceContract from 'components/web3/contract/Insurance'

export class ContractCaller {
    provider: providers.Web3Provider

    insuranceContract: InsuranceContract

    constructor(provider: providers.Web3Provider) {
        this.provider = provider
        this.insuranceContract = new InsuranceContract(this.provider, contractAddress, INSURANCE_ABI)
    }

    public async getEtherBalance(from: string) {
        const balance: BigNumber = await this.provider.getBalance(from)
        return weiToEther(balance.toString())
    }

    // public async balanceOf(address: string) {
    //     const balance: BigNumber = await this.provider.balanceOf(address)
    //     console.log(this.provider)
    // }

    public async sign(message: string | ethers.utils.Bytes) {
        const signer = this.provider.getSigner()
        const signature = await signer.signMessage(message)
        return signature
    }
}
