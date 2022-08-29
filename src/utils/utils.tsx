import { formatDistanceToNow, format } from 'date-fns'
import isNil from 'lodash/isNil'
import numeral from 'numeral'
import Config from 'config/config'
import GhostContentAPI from '@tryghost/content-api'
//import { slugify } from '@tryghost/string'
//import algoliasearch from 'algoliasearch'
import { wallets } from 'components/web3/Web3Types'

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

export const formatCurrency = (n: number, digits = 4) => {
    if (n < 1e3) return formatNumber(n, 0, 0, true)
    if (n >= 1e3 && n < 1e6) return `${formatNumber(+(n / 1e3).toFixed(4), digits, 0, true)}K`
    if (n >= 1e6 && n < 1e9) return `${formatNumber(+(n / 1e6).toFixed(4), digits, 0, true)}M`
    if (n >= 1e9 && n < 1e12) return `${formatNumber(+(n / 1e9).toFixed(4), digits, 0, true)}B`
    if (n >= 1e12) return `${formatNumber(+(n / 1e12).toFixed(4), digits, 0, true)}T`
    return n
}

export const formatTime = (value: Date, f = 'yyyy-MM-dd HH:mm') => {
    if (value) {
        const date = value instanceof Date ? value : new Date(value)
        return format(date, f)
    }
    return null
}

export const getTimeAgo = (value: Date, options: any) => {
    if (!value) return null
    const date = value instanceof Date ? value : new Date(value)
    if (options) {
        return formatDistanceToNow(date, options)
    }
    return formatDistanceToNow(date)
}

export const parseNumber = (_number: any) => parseInt(_number)

export const ghost = new GhostContentAPI({
    url: process.env.NEXT_PUBLIC_BLOG_API_URL ?? '',
    key: process.env.NEXT_PUBLIC_BLOG_API_CONTENT_KEY ?? '',
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
