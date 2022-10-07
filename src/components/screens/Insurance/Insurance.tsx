import Config from 'config/config'
import { ethers } from 'ethers'

export const getBalance = async (symbol: string, address: string, constractAdress: string, decimal: number) => {
    if (symbol === 'BNB') {
        const result = Config.web3.getBalance()
        return result.then((balance: number) => {
            return Number(balance.toFixed(decimal))
        })
    } else {
        const result = await Config.web3.contractCaller?.tokenContract(constractAdress).contract.balanceOf(address)
        if (result) {
            if (Number(ethers.utils.formatEther(result)) > 0) {
                return Number(Number(ethers.utils.formatEther(result)).toFixed(decimal))
            } else {
                return 0
            }
        } else {
            return false
        }
    }
}

const P_stop = (p_market: number, p_claim: number, hedge: number) => {
    const diffStopfutures = 0 / 100
    const ratio_min_profit = Math.abs(p_claim - p_market) / p_market / 2

    if (p_claim > p_market) {
        const p_stop = p_market - p_market * (hedge + ratio_min_profit - diffStopfutures)
        return Math.abs(Number(p_stop))
    } else {
        const p_stop = p_market + p_market * (hedge + ratio_min_profit - diffStopfutures)
        return Math.abs(Number(p_stop))
    }
}

const Leverage = (p_market: number, p_stop: number) => {
    const leverage = Math.floor(p_market / Math.abs(p_market - p_stop))
    return leverage < 1 ? 1 : leverage
}

export const getInfoCoveredDefault = (q_covered: number, p_claim: number, p_market: number) => {
    const margin = Number((8 * q_covered * p_market) / 100)
    const userCapital = margin
    const systemCapital = userCapital
    const hedge_capital = userCapital + systemCapital
    const hedge = Number(margin / (q_covered * p_market))
    const p_stop = P_stop(Number(p_market), Number(p_claim), Number(hedge))
    const laverage = Leverage(p_market, p_stop)
    const ratio_profit = Number(Math.abs(p_claim - p_market) / p_market)
    const q_claim = Number((ratio_profit / 2) * hedge_capital * laverage) * (1 - 0.05) + margin
}

export const getInfoCoveredCustom = (q_covered: number, p_claim: number, p_market: number, margin: number) => {
    const userCapital = margin
    const systemCapital = userCapital
    const hedge_capital = userCapital + systemCapital
    const hedge = Number(margin / (q_covered * p_market))
    const p_stop = P_stop(Number(p_market), Number(p_claim), Number(hedge))
    const laverage = Leverage(p_market, p_stop)
    const ratio_profit = Number(Math.abs(p_claim - p_market) / p_market)
    const q_claim = Number(ratio_profit * hedge_capital * laverage) * (1 - 0.05) + margin
}

export const setDefaultValue = (userBalance: number, minCoveredConfig: number, p_market: number, current: any, flillter: any) => {
    if (userBalance > minCoveredConfig) {
        current.q_covered = userBalance
        current.p_claim = p_market - (10 / 100) * p_market
        current.period = 5
        current.margin = 7
    } else {
    }
}
