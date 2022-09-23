import { formatDistanceToNow, format } from 'date-fns'
import isNil from 'lodash/isNil'
import numeral from 'numeral'
import Config from 'config/config'
import GhostContentAPI from '@tryghost/content-api'
import { PairConfig, UnitConfig } from 'types/types'
import { createSelector } from 'reselect'
import { RootStore } from 'redux/store'
import { stateInsurance } from './constants'
import get from 'lodash/get'

export const getS3Url = (url: string) => Config.env.CDN + url

export const countDecimals = (value: number) => {
    if (Math.floor(value) === value) return 0
    const str = value?.toString()
    if (str?.indexOf('.') !== -1 && str?.indexOf('-') !== -1) {
        return str?.split('-')[1] || 0
    }
    if (str?.indexOf('.') !== -1) {
        return str?.split('.')[1].length || 0
    }
    return str?.split('-')[1] || 0
}

export const formatNumber = (value: number, digits = 2, forceDigits = 0, acceptNegative = false) => {
    const defaultValue = `0${forceDigits > 0 ? `.${'0'.repeat(forceDigits)}` : ''}`
    if (isNil(value)) return defaultValue
    if (Math.abs(+value) < 1e-9) return defaultValue
    if (!acceptNegative && +value < 0) return defaultValue
    return numeral(+value).format(`0,0.${'0'.repeat(forceDigits)}${digits > 0 ? `[${'0'.repeat(digits)}]` : ''}`, Math.floor)
}

export const formatCurrency = (n: number, digits = 4, e: number = 1e3) => {
    if (n < e) return formatNumber(n, digits, 0, true)
    if (n >= 1e3 && n < 1e6) return `${formatNumber(+(n / 1e3).toFixed(4), digits, 0, true)}K`
    if (n >= 1e6 && n < 1e9) return `${formatNumber(+(n / 1e6).toFixed(4), digits, 0, true)}M`
    if (n >= 1e9 && n < 1e12) return `${formatNumber(+(n / 1e9).toFixed(4), digits, 0, true)}B`
    if (n >= 1e12) return `${formatNumber(+(n / 1e12).toFixed(4), digits, 0, true)}T`
    return n
}

export const formatTime = (value: Date | number, f = 'yyyy-MM-dd HH:mm') => {
    if (value) {
        const date = value instanceof Date ? value : new Date(value)
        return format(date, f)
    }
    return null
}

export const getTimeAgo = (value: Date, options?: any) => {
    if (!value) return null
    const date = value instanceof Date ? value : new Date(value)
    if (options) {
        return formatDistanceToNow(date, options)
    }
    return formatDistanceToNow(date)
}

export const parseNumber = (_number: any) => parseInt(_number)

export const ghost = new GhostContentAPI({
    url: process.env.NEXT_PUBLIC_BLOG_API_URL || '',
    key: process.env.NEXT_PUBLIC_BLOG_API_CONTENT_KEY || '',
    version: 'v3',
})

export const getArticles = async (tag: string = '', limit: number = 10, language: string = 'vi', isHighlighted: boolean = false) => {
    const filter = []
    const options: any = {
        limit: limit,
        include: 'tags',
        order: 'published_at DESC',
    }
    const lang = language === 'vi' ? '-en' : 'en'

    if (tag) {
        filter.push(`tags:${lang}+tags:${tag}`)
    } else {
        filter.push(`tags:${lang}`)
    }

    if (isHighlighted) {
        filter.push('featured:true')
    }

    options.filter = filter.join('+')
    return await ghost.posts.browse(options)
}

export const timeMessage = (previous: any) => {
    const current = Date.now()
    const msPerMinute = 60 * 1000
    const msPerHour = msPerMinute * 60
    const msPerDay = msPerHour * 24
    const msPerMonth = msPerDay * 30
    const msPerYear = msPerDay * 365

    const elapsed = current - previous

    if (Math.round(elapsed / 1000) < 15) {
        if (elapsed < msPerMinute) {
            return Math.round(elapsed / 1000) + ' giây trước'
        }
    }
    const date = new Date(previous)
    let tempMinutes
    date.getMinutes() < 10 ? (tempMinutes = `0${date.getMinutes()}`) : (tempMinutes = `${date.getMinutes()}`)

    return date.getHours() + ':' + tempMinutes + ' ' + date.getDate() + '/' + (date.getMonth() + 1)
}

export const getDecimalPrice = (config: PairConfig) => {
    const decimalScalePrice = config?.filters.find((rs: any) => rs.filterType === 'PRICE_FILTER') ?? 1
    return +countDecimals(decimalScalePrice?.tickSize)
}

export const getUnit = createSelector([(state: RootStore) => state.setting.unitConfig, (unitConfig, params) => params], (unitConfig, params) => {
    return unitConfig.find((rs: UnitConfig) => rs?.assetCode === params)
})

export const CStatus = ({ state, t }: any) => {
    let bg = 'bg-gradient-blue text-blue-5'
    switch (state) {
        case stateInsurance.EXPIRED:
        case stateInsurance.LIQUIDATED:
            bg = 'bg-gradient-gray text-gray'
            break
        case stateInsurance.CLAIM_WAITING:
            bg = 'bg-gradient-yellow text-yellow-5'
            break
        case stateInsurance.REFUNDED:
        case stateInsurance.CLAIMED:
            bg = 'bg-gradient-green text-success'
            break
        default:
            break
    }
    return (
        <div style={{ minWidth: 120 }} className={`px-3 cursor-pointer text-xs sm:text-sm text-center font-semibold py-[6px] rounded-[600px] ${bg}`}>
            {t(`common:status:${String(state).toLowerCase()}`)}
        </div>
    )
}

export const initMarketWatchItem = (pair: any, debug: boolean = false) => {
    const _ = {
        symbol: get(pair, 's', null), // this.symbol = source.s;
        lastPrice: get(pair, 'p', null), // this.lastPrice = +source.p;
        lastPrice24h: get(pair, 'ld', null), // this.lastPrice24h = +source.ld;
        high: get(pair, 'h', null), // this.high = +source.h;
        low: get(pair, 'l', null), // this.low = +source.l;
        high1h: get(pair, 'hh', null), // this.high1h = +source.hh;
        low1h: get(pair, 'lh', null), // this.low1h = +source.lh;
        totalExchangeVolume: get(pair, 'vb', null), // this.totalExchangeVolume = source.vb;
        volume24h: get(pair, 'vq', null), // this.volume24h = source.vq;
        quoteAsset: get(pair, 'q', null),
        quoteAssetId: get(pair, 'qi', null),
        baseAsset: get(pair, 'b'),
        baseAssetId: get(pair, 'bi', null),
        up: get(pair, 'u', false), // this.up = source.u;
        lastHistoryId: get(pair, 'li', null), // this.lastHistoryId = source.li;
        supply: get(pair, 'sp', null), // this.supply = source.sp;
        label: get(pair, 'lbl', null), // this.label = source.lbl;
    }
    return _
}

export const sparkLineBuilder = (symbol: string, color: string, border: number = 0.5) => {
    return `${Config.env.PRICE_API_URL}/api/v1/chart/sparkline?symbol=${symbol}&broker=NAMI_SPOT&color=%23${color?.replace('#', '')}&stroke_width=${border}`
}

export const getExchange24hPercentageChange = (price: any) => {
    let change24h = 0
    if (price) {
        const { p: lastPrice, ld: lastPrice24h, q: quoteAsset } = price
        if (lastPrice && lastPrice24h) {
            change24h = ((lastPrice - lastPrice24h) / lastPrice24h) * 100
        } else if (lastPrice && !lastPrice24h) {
            change24h = 100
        } else if (!lastPrice && lastPrice24h) {
            change24h = -100
        }
    }
    // log.d('get exchange 24h ', change24h)
    return change24h
}

export const formatPercentage = (value: number, digits: number = 2, acceptNegative: boolean = false) => {
    if (isNil(value)) return '0'
    if (Math.abs(+value) < 1e-2) return '0'
    if (!acceptNegative && +value < 0) return '0'
    return numeral(+value).format(`0,0.[${'0'.repeat(digits)}]`, Math.floor)
}

export function isFunction(functionToCheck: any) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}
