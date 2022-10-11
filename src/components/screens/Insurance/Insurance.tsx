import { USDTaddress } from 'components/web3/constants/contractAddress'
import Config from 'config/config'
import { ethers } from 'ethers'
import { countDecimals, formatNumber } from 'utils/utils'

const configRatioMarketClaim = [
    {
        min: 0.02,
        max: 0.1,
        period: 2,
        hedge: 8,
    },
    {
        min: 0.1,
        max: 0.2,
        period: 3,
        hedge: 7.5,
    },
    {
        min: 0.2,
        max: 0.3,
        period: 7,
        hedge: 7,
    },
    {
        min: 0.3,
        max: 0.5,
        period: 10,
        hedge: 6.5,
    },
    {
        min: 0.5,
        max: 0.6,
        period: 13,
        hedge: 6,
    },
    {
        min: 0.6,
        max: 0.7,
        period: 15,
        hedge: 5.5,
    },
]

export const getBalance = async (symbol: string, address: string, constractAdress: string, decimal: number) => {
    switch (symbol) {
        case 'BNB':
            const result = Config.web3.getBalance()
            return result.then(async (balance: number) => {
                return await Number(balance.toFixed(decimal))
            })
            break
        default:
            const res = await Config.web3.contractCaller?.tokenContract(constractAdress).contract.balanceOf(address)
            if (res) {
                if (Number(ethers.utils.formatEther(res)) > 0) {
                    return await Number(Number(ethers.utils.formatEther(res)).toFixed(decimal))
                } else {
                    return 0
                }
            } else {
                return 0
            }
            break
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

export const getInfoCoveredDefault = (state: any, decimalList: any) => {
    const margin = Number((8 * state?.q_covered * state?.p_market) / 100)
    const userCapital = margin
    const systemCapital = userCapital
    const hedge_capital = userCapital + systemCapital
    const hedge = Number(margin / (state?.q_covered * state?.p_market))
    const p_stop = P_stop(Number(state?.p_market), Number(state?.p_claim), Number(hedge))
    const laverage = Leverage(state?.p_market, p_stop)
    const ratio_profit = Number(Math.abs(state?.p_claim - state?.p_market) / state?.p_market)
    const q_claim = Number((ratio_profit / 2) * hedge_capital * laverage) * (1 - 0.05) + margin

    const item = {
        q_claim: Number(q_claim.toFixed(decimalList?.decimal_q_covered)),
        r_claim: Number((Number(q_claim / margin) * 100).toFixed(decimalList?.decimal_q_covered)),
        p_expired: Number(p_stop.toFixed(decimalList?.decimal_q_covered)),
        margin: Number(margin.toFixed(decimalList?.decimal_margin)),
    }
    return item
}

export const getInfoCoveredCustom = (state: any, decimalList: any) => {
    const userCapital = state?.margin
    const systemCapital = userCapital
    const hedge_capital = userCapital + systemCapital
    const hedge = Number(state?.margin / (state?.q_covered * state?.p_market))
    const p_stop = P_stop(Number(state?.p_market), Number(state?.p_claim), Number(hedge))
    const laverage = Leverage(state?.p_market, p_stop)
    const ratio_profit = Number(Math.abs(state?.p_claim - state?.p_market) / state?.p_market)
    const q_claim = Number(ratio_profit * hedge_capital * laverage) * (1 - 0.05) + state?.margin

    const item = {
        q_claim: Number(q_claim.toFixed(decimalList?.decimal_q_covered)),
        r_claim: Number((Number(q_claim / state?.margin) * 100).toFixed(decimalList?.decimal_q_covered)),
        p_expired: Number(p_stop.toFixed(decimalList?.decimal_q_covered)),
    }

    return item
}

export const setDefaultValue = async (userBalance: number, state: any, fillter: any) => {
    const configP_claim = fillter?.find((rs: any) => rs.filterType === 'PRICE_FILTER')
    const configPrice = fillter?.find((rs: any) => rs.filterType === 'LOT_SIZE')
    const decimalQ_covered = countDecimals(configPrice?.stepSize)
    const configMin = fillter?.find((rs: any) => rs.filterType === 'MIN_NOTIONAL')
    const configMargin = fillter?.find((rs: any) => rs.filterType === 'MARGIN')
    const balanceUSDT = await getBalance('USDT', Config.web3.account, USDTaddress, Number(decimalQ_covered))
    const decimalMargin = countDecimals(configMargin?.stepSize)
    const decimalP_claim = countDecimals(configP_claim?.tickSize)

    let _data = state
    if (userBalance > configPrice?.minQty) {
        const p_claim = state?.p_market - 0.1 * state?.p_market
        const ratioMarClaim = formatNumber(Math.abs((p_claim - state?.p_market) / state?.p_market), 2)

        const _res = configRatioMarketClaim.find((item: any, key: number) => {
            if (key === 0) {
                if (item?.min <= +ratioMarClaim && +ratioMarClaim <= item?.max) {
                    return item
                }
            } else {
                if (item?.min < +ratioMarClaim && +ratioMarClaim <= item?.max) {
                    return item
                }
            }
        })
        if (_res) {
            const margin = _res?.hedge * userBalance * state?.p_market

            _data.q_covered = userBalance
            _data.p_claim = +formatNumber(p_claim, +decimalP_claim)
            _data.period = _res?.period
            _data.margin = +formatNumber(margin, +decimalMargin)

            return await _data
        }
    } else {
        const minMargin = (configMin?.notional / state?.p_market) * configMargin?.minQtyRatio
        const margin = minMargin > balanceUSDT * 0.25 ? minMargin : balanceUSDT * 0.25
        const p_claim = state?.p_market - 0.1 * state?.p_market
        const ratioMarClaim = Math.abs((p_claim - state?.p_market) / state?.p_market)
        const _res = configRatioMarketClaim.find((item: any, key: number) => {
            if (key === 0) {
                if (item?.min <= ratioMarClaim && ratioMarClaim <= item?.max) {
                    return item
                }
            } else {
                if (item?.min < ratioMarClaim && ratioMarClaim <= item?.max) {
                    return item
                }
            }
        })

        if (_res) {
            _data.q_covered = +formatNumber(margin / (_res?.hedge * state?.p_market), +decimalQ_covered)
            _data.margin = +formatNumber(margin, +decimalMargin)
            _data.p_claim = +formatNumber(p_claim, +decimalP_claim)
            _data.period = _res?.period

            return await _data
        }
    }
}
