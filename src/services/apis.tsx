import Config from 'config/config'

export const API_VERSION = '/v1'

export const API_REGISTER_NOTIFICATON = '/v1/subscribe'
export const API_GET_INFO_GENERAL = '/v1/get-info-general'
export const API_GET_INDIVIDUAL_CONTRACT = '/v1/get-individual-contract'
export const API_GET_INSURANCE_BY_ADDRESS = '/v1/get-insurance-by-address'
export const API_GET_LIST_TOKEN = '/v1/get-list-token'
export const API_GET_COVER_PAYOUT = '/v1/get-cover-payout'
export const API_GET_BUY_INSURANCE = '/v1/buy-insurance'
export const API_CHECK_NOTICE = '/v1/check-notice'
export const API_GET_NOTICE = '/v1/get-notice'
export const API_UPDATE_NOTICE = '/v1/update-notice'
export const API_GET_CONFIG_ASSET = 'v1/get-config-asset'
export const API_CHECK_GUIDE_LINE = 'v1/check-guide-line'
export const API_UPDATE_GUIDE_LINE = 'v1/update-guide-line'
export const API_SUBSCRIBE = 'v1/subscribe'
export const API_GET_NONCE = 'v1/get-nonce'
export const API_LOGIN = 'v1/log-in'
export const API_GET_TOKEN_COOKIES = 'v1/get-token-cookies'
export const API_GET_INFO_USER = '/v1/get-info-user'
export const API_UPDATE_USER_INFO = '/v1/update-info-user'
export const API_CONTACT = '/v1/contact-user-email'

// commission
export const API_GET_FRIENDS = '/v1/get-friends'
export const API_GET_COMMISSION_HISTORY = '/v1/get-commission-history'
export const API_GET_INFO_USER_COMMISSION = '/v1/get-info-user-commission'
export const API_POST_WITHDRAW_COMMISSION = '/v1/withdraw-commission'
export const API_GET_FILTER_COMMISSION = '/v1/filter-commissionn'
export const API_CHECK_REF = '/v1/check-ref'


// futures
export const API_GET_UNIT_CONFIG = Config.env.NAMI_API_URL + '/api/v3/asset/config'
export const API_GET_FUTURES_MARKET_WATCH = Config.env.NAMI_API_URL + '/api/v3/futures/ticker'
export const API_GET_PRICE_CHART = Config.env.PRICE_API_URL + '/api/v1/chart/history'
