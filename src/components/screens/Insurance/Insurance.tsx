import Modal from 'components/common/Modal/Modal'
import { USDTaddress } from 'components/web3/constants/contractAddress'
import Config from 'config/config'
import { ethers } from 'ethers'
import { useEffect, useRef, useState } from 'react'
import { API_GET_PRICE_CHART } from 'services/apis'
import fetchApi from 'services/fetch-api'
import { countDecimals, formatNumber } from 'utils/utils'

export const fetchApiNami = async (symbol: string, from: string, to: string, resolution: string, setDataChart: any) => {
    try {
        const params = {
            broker: 'NAMI_SPOT',
            symbol,
            from,
            to,
            resolution: resolution,
        }

        const test = await fetchApi({ url: API_GET_PRICE_CHART, baseURL: '', params: params })
        if (test && Array.isArray(test)) {
            let data: { date: number; value: any }[] = []
            test?.map((item: any) => {
                data.push({
                    date: item[0] * 1000,
                    value: item[1],
                })
            })
            setTimeout(() => {
                if (data.length > 0) {
                    setDataChart(data)
                }
            }, 1000)
        }
    } catch (err) {
        console.log('fecth current price error')
    }
}

export const GuidelineModal = ({ visible, onClose, t, onShowTerminologyModal, onShowGuildline }: any) => {
    return (
        <Modal isMobile containerClassName="flex-col justify-end" isVisible={visible} onBackdropCb={onClose}>
            <div className="text-xl leading-8 font-semibold mb-6">{t('insurance:guild:title')}</div>
            <div className="flex flex-col text-sm divide-solid divide-y divide-divider">
                <div
                    onClick={() => {
                        onShowGuildline()
                        onClose()
                    }}
                    className="py-4"
                >
                    {t('insurance:buy:help1')}
                </div>
                <div
                    onClick={() => {
                        onShowTerminologyModal()
                        onClose()
                    }}
                    className="py-4"
                >
                    {t('insurance:guild:the_glossary')}
                </div>
            </div>
        </Modal>
    )
}

export const getInfoCoveredDefault = (p_market: number, q_covered: number, p_claim: number, decimalList: any) => {
    const margin = Number((8 * q_covered * p_market) / 100)
    const userCapital = margin
    const systemCapital = userCapital
    const hedge_capital = userCapital + systemCapital
    const hedge = Number(margin / (q_covered * p_market))
    const p_stop = P_stop(Number(p_market), Number(p_claim), Number(hedge))
    const laverage = Leverage(p_market, p_stop)
    const ratio_profit = Number(Math.abs(p_claim - p_market) / p_market)
    const q_claim = Number((ratio_profit / 2) * hedge_capital * laverage) * (1 - 0.05) + margin

    default_r_claim.current = Number((Number(q_claim / margin) * 100).toFixed(decimalList?.decimal_q_covered))

    return {
        q_claim: Number(q_claim.toFixed(decimalList?.decimal_q_covered)),
        r_claim: Number((Number(q_claim / margin) * 100).toFixed(decimalList?.decimal_q_covered)),
        p_expired: Number(p_stop.toFixed(decimalList?.decimal_q_covered)),
        margin: Number(margin.toFixed(decimalList?.decimal_margin)),
    }
}

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

export const getInfoCoveredCustom = (margin: number, q_covered: number, p_claim: number, p_market: number, decimalList: any) => {
    const userCapital = margin
    const systemCapital = userCapital
    const hedge_capital = userCapital + systemCapital
    const hedge = Number(margin / (q_covered * p_market))
    const p_stop = P_stop(Number(p_market), Number(p_claim), Number(hedge))
    const laverage = Leverage(p_market, p_stop)
    const ratio_profit = Number(Math.abs(p_claim - p_market) / p_market)
    const q_claim = Number(ratio_profit * hedge_capital * laverage) * (1 - 0.05) + margin

    default_r_claim.current = Number((Number(q_claim / margin) * 100).toFixed(decimalList?.decimal_q_covered))
    return {
        q_claim: Number(q_claim.toFixed(decimalList?.decimal_q_covered)),
        r_claim: Number((Number(q_claim / margin) * 100).toFixed(decimalList?.decimal_q_covered)),
        p_expired: Number(p_stop.toFixed(decimalList?.decimal_q_covered)),
    }
}

export const setDefaultValue = async (userBalance: number, p_market: number, fillter: any) => {
    const configP_claim = await fillter?.find((rs: any) => rs.filterType === 'PRICE_FILTER')
    const configPrice = await fillter?.find((rs: any) => rs.filterType === 'LOT_SIZE')
    const decimalQ_covered = countDecimals(configPrice?.stepSize)
    const configMin = await fillter?.find((rs: any) => rs.filterType === 'MIN_NOTIONAL')
    const configMargin = await fillter?.find((rs: any) => rs.filterType === 'MARGIN')
    const balanceUSDT = await getBalance('USDT', Config.web3.account, USDTaddress, Number(decimalQ_covered))
    const decimalMargin = countDecimals(configMargin?.stepSize)
    const decimalP_claim = countDecimals(configP_claim?.tickSize)
    // console.log(fillter[1])

    if (configPrice && userBalance > fillter[1]?.minQty) {
        console.log('zo')

        const p_claim = p_market - 0.1 * p_market
        const ratioMarClaim = formatNumber(Math.abs((p_claim - p_market) / p_market), 2)

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
            const margin = _res?.hedge * userBalance * p_market
            default_period.current = _res?.period
            return {
                q_covered: userBalance,
                p_claim: +(p_market - 0.1 * p_market).toFixed(+decimalP_claim),
                period: _res?.period,
                margin: +formatNumber(margin, +decimalMargin),
            }
        }
    } else {
        const minMargin = (configMin?.notional / p_market) * configMargin?.minQtyRatio
        const margin = minMargin > balanceUSDT * 0.25 ? minMargin : balanceUSDT * 0.25
        const p_claim = p_market - 0.1 * p_market
        const ratioMarClaim = Math.abs((p_claim - p_market) / p_market)
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
            default_period.current = _res?.period
            return {
                q_covered: +formatNumber(margin / (_res?.hedge * p_market), +decimalQ_covered),
                margin: +formatNumber(margin, +decimalMargin),
                p_claim: +(p_market - 0.1 * p_market).toFixed(+decimalP_claim),
                period: _res?.period,
            }
        }
    }
}

const default_period = useRef<number>(0)
const default_r_claim = useRef<number>(0)

// export const changePeriod = (value: number, margin: number, q_claim: any, r_claim: any) => {
//     if (value > default_period.current) {
//         const step = value - default_period.current
//         switch (step) {
//             case 1:
//                 new_r_claim(31.5 / 100, margin, q_claim, r_claim)
//                 break
//             case 2:
//                 new_r_claim(36.5 / 100, margin, q_claim, r_claim)
//                 break
//             case 3:
//                 new_r_claim(40.5 / 100, margin, q_claim, r_claim)
//                 break
//             case 4:
//                 new_r_claim(45.5 / 100, margin, q_claim, r_claim)
//                 break
//             case 5:
//                 new_r_claim(48.5 / 100, margin, q_claim, r_claim)
//                 break
//             case 6:
//                 new_r_claim(52.5 / 100, margin, q_claim, r_claim)
//                 break
//             case 7:
//                 new_r_claim(57.5 / 100, margin, q_claim, r_claim)
//                 break
//             case 8:
//                 new_r_claim(60.5 / 100, margin, q_claim, r_claim)
//                 break
//             case 9:
//                 new_r_claim(64.5 / 100, margin, q_claim, r_claim)
//                 break
//             case 10:
//                 new_r_claim(69.5 / 100, margin, q_claim, r_claim)
//                 break
//             case 11:
//                 new_r_claim(72.5 / 100, margin, q_claim, r_claim)
//                 break
//             case 12:
//                 new_r_claim(76.5 / 100, margin, q_claim, r_claim)
//                 break
//             case 13:
//                 new_r_claim(83.5 / 100, margin, q_claim, r_claim)
//                 break
//         }
//     } else {
//         const step = default_period.current - value
//         switch (step) {
//             case 1:
//                 new_r_claim_(70 / 100, margin, q_claim, r_claim)
//                 break
//             case 2:
//                 new_r_claim_(67 / 100, margin, q_claim, r_claim)
//                 break
//             case 3:
//                 new_r_claim_(63 / 100, margin, q_claim, r_claim)
//                 break
//             case 4:
//                 new_r_claim_(58 / 100, margin, q_claim, r_claim)
//                 break
//             case 5:
//                 new_r_claim_(55 / 100, margin, q_claim, r_claim)
//                 break
//             case 6:
//                 new_r_claim_(51 / 100, margin, q_claim, r_claim)
//                 break
//             case 7:
//                 new_r_claim_(46 / 100, margin, q_claim, r_claim)
//                 break
//             case 8:
//                 new_r_claim_(43 / 100, margin, q_claim, r_claim)
//                 break
//             case 9:
//                 new_r_claim_(39 / 100, margin, q_claim, r_claim)
//                 break
//             case 10:
//                 new_r_claim_(34 / 100, margin, q_claim, r_claim)
//                 break
//             case 11:
//                 new_r_claim_(31 / 100, margin, q_claim, r_claim)
//                 break
//             case 12:
//                 new_r_claim_(27 / 100, margin, q_claim, r_claim)
//                 break
//             case 13:
//                 new_r_claim_(20 / 100, margin, q_claim, r_claim)
//                 break
//         }
//     }
// }

const new_r_claim = (x: number, margin: number, q_claim: any, r_claim: any) => {
    const new_r_claim = (100 / 100 + (default_r_claim.current - 100 / 100) * (1 - x)) * 100
    const new_q_claim = r_claim * margin
    r_claim.current = new_r_claim
    q_claim.current = new_q_claim
}

const new_r_claim_ = (x: number, margin: number, q_claim: any, r_claim: any) => {
    const new_r_claim = (100 / 100 + (default_r_claim.current - 100 / 100) * (1 + x)) * 100
    const new_q_claim = r_claim * margin
    r_claim.current = new_r_claim
    q_claim.current = new_q_claim
}
