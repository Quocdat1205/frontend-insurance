import { BigNumber, ethers, providers } from 'ethers'
import { weiToEther } from 'components/web3/Web3Types'
import { INSURANCE_ABI } from 'components/web3/constants/abi/INSURANCE_ABI'
import { contractAddress } from 'components/web3/constants/contractAddress'
import ContractInterface from 'components/web3/contract/Insurance'
import { getMessageSign } from 'utils/utils'
import fetchApi from 'services/fetch-api'
import { API_GET_NONCE, API_LOGIN } from 'services/apis'
import Config from 'config/config'
import { TOKEN_ABI } from '../constants/abi/TOKEN_ABI'

export class ContractCaller {
    public provider: providers.Web3Provider
    public insuranceContract: ContractInterface

    constructor(provider: providers.Web3Provider) {
        this.provider = provider
        this.insuranceContract = new ContractInterface(this.provider, contractAddress, INSURANCE_ABI)
    }

    public tokenContract = (address: string) => {
        return new ContractInterface(this.provider, address, TOKEN_ABI)
    }

    public async getEtherBalance(from: string) {
        const balance: BigNumber = await this.provider.getBalance(from)
        return weiToEther(balance.toString())
    }

    public async sign(address: string) {
        try {
            const nonce = await getNonce(address)
            if (!nonce?.data) return nonce
            const signer = this.provider.getSigner()
            const signature = await signer.signMessage(getMessageSign(nonce?.data))
            return await fetchApi({ url: API_LOGIN, options: { method: 'POST' }, params: { owner: address, signature: signature } })
        } catch (error) {
            console.log('sign', error)

            // coinbase error la 1 string nen return ve object error
            if (typeof error === 'string')
                return {
                    message: error,
                }

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
