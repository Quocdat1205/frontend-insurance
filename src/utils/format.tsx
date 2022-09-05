import { BigNumber, ethers } from 'ethers'

export const etherToWei = (amount: number | string) => ethers.utils.parseEther(amount.toString())

export const weiToEther = (wei: string | BigNumber) => parseFloat(ethers.utils.formatEther(wei))

export const formatDateToTimestamp = (_date: Date) => {
    let newDate = new Date(_date)
    return newDate.getTime() / 1000
}

export const formatTimestampToDate = (_date: number) => {
    let date = _date * 1000

    let newDate = new Date(date).toLocaleDateString()

    return newDate
}

export const formatPriceToWeiValue = (_num: number) => {
    return BigInt(_num * 10 ** 18)
}

export const formatWeiValueToPrice = (_num: number) => {
    return Number(_num) / 10 ** 18
}

export const parseNumber = (_number: any) => {
    return parseInt(_number)
}
