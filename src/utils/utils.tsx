import { formatDistanceToNow, format } from 'date-fns'
import isNil from 'lodash/isNil'
import numeral from 'numeral'

import Config from 'config/config'

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

export const formatNumber = (
  value: number,
  digits = 2,
  forceDigits = 0,
  acceptNegative = false,
) => {
  const defaultValue = `0${
    forceDigits > 0 ? `.${'0'.repeat(forceDigits)}` : ''
  }`
  if (isNil(value)) return defaultValue
  if (Math.abs(+value) < 1e-9) return defaultValue
  if (!acceptNegative && +value < 0) return defaultValue
  return numeral(+value).format(
    `0,0.${'0'.repeat(forceDigits)}${
      digits > 0 ? `[${'0'.repeat(digits)}]` : ''
    }`,
    Math.floor,
  )
}

export const formatCurrency = (n: number, digits = 4) => {
  if (n < 1e3) return formatNumber(n, 0, 0, true)
  if (n >= 1e3 && n < 1e6)
    return `${formatNumber(+(n / 1e3).toFixed(4), digits, 0, true)}K`
  if (n >= 1e6 && n < 1e9)
    return `${formatNumber(+(n / 1e6).toFixed(4), digits, 0, true)}M`
  if (n >= 1e9 && n < 1e12)
    return `${formatNumber(+(n / 1e9).toFixed(4), digits, 0, true)}B`
  if (n >= 1e12)
    return `${formatNumber(+(n / 1e12).toFixed(4), digits, 0, true)}T`
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
