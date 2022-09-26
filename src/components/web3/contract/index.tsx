import { BigNumber, ethers, providers } from 'ethers'
import { weiToEther } from 'components/web3/Web3Types'
import { INSURANCE_ABI } from 'components/web3/constants/abi/INSURANCE_ABI'
import { contractAddress, ETHaddress, USDTaddress } from 'components/web3/constants/contractAddress'
import ContractInterface from 'components/web3/contract/Insurance'
import { USDT_ABI } from '../constants/abi/USDT_ABI'
import { getMessageSign } from 'utils/utils'
import fetchApi from 'services/fetch-api'
import { API_GET_NONCE, API_LOGIN } from 'services/apis'
import Config from 'config/config'
import { ETH_ABI } from '../constants/abi/ETH_ABI'

export class ContractCaller {
    public provider: providers.Web3Provider
    public insuranceContract: ContractInterface
    public usdtContract: ContractInterface
    public ethContract: ContractInterface

    constructor(provider: providers.Web3Provider) {
        this.provider = provider
        this.insuranceContract = new ContractInterface(this.provider, contractAddress, INSURANCE_ABI)
        this.usdtContract = new ContractInterface(this.provider, USDTaddress, USDT_ABI)
        this.ethContract = new ContractInterface(this.provider, ETHaddress, ETH_ABI)
    }

    public async getEtherBalance(from: string) {
        const balance: BigNumber = await this.provider.getBalance(from)
        return weiToEther(balance.toString())
    }

    public async getBalanceUsdt(address: string) {
        const balance = await this.usdtContract.getBalance(address)
        return balance
    }

    public async getBalanceETH(address: string) {
        const balance = await this.ethContract.getBalance(address)
        return balance
    }

    public async sign(address: string) {
        try {
            const nonce = await getNonce(address)
            if (nonce?.code === 'ERR_NETWORK' || !nonce) return nonce
            const signer = this.provider.getSigner()
            const signature = await signer.signMessage(getMessageSign(nonce))
            return await fetchApi({ url: API_LOGIN, options: { method: 'POST' }, params: { owner: address, signature: signature } })
        } catch (error) {
            return error
        }
    }
}

export const getNonce = async (address: string) => {
    try {
        return await fetchApi({ url: API_GET_NONCE, params: { owner: address } })
    } catch (error) {
        if (Config.env.NODE_ENV === 'dev') console.log('getNonce', error)
        return error
    }
}
