import { BigNumber, ethers, providers } from 'ethers'
import { weiToEther } from 'components/web3/Web3Types'
import { INSURANCE_ABI } from 'components/web3/constants/abi/INSURANCE_ABI'
import { contractAddress, USDTaddress } from 'components/web3/constants/contractAddress'
import ContractInterface from 'components/web3/contract/Insurance'
import { USDT_ABI } from '../constants/abi/USDT_ABI'

export class ContractCaller {
    public provider: providers.Web3Provider
    public insuranceContract: ContractInterface
    public usdtContract: ContractInterface

    constructor(provider: providers.Web3Provider) {
        this.provider = provider
        this.insuranceContract = new ContractInterface(this.provider, contractAddress, INSURANCE_ABI)
        this.usdtContract = new ContractInterface(this.provider, USDTaddress, USDT_ABI)
    }

    public async getEtherBalance(from: string) {
        const balance: BigNumber = await this.provider.getBalance(from)
        return weiToEther(balance.toString())
    }

    public async getBalanceUsdt(address: string) {
        const balance = await this.usdtContract.getBalance(address)

        return balance
    }

    public async sign(message: string | ethers.utils.Bytes) {
        const signer = this.provider.getSigner()
        const signature = await signer.signMessage(message)
        return signature
    }
}
