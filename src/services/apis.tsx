import Config from 'config/config'

export const API_VERSION = '/v1'

export const API_REGISTER_NOTIFICATON: string = '/v1/subscribe'
export const API_GET_INFO_GENERAL: string = '/v1/get-info-general'
export const API_GET_INDIVIDUAL_CONTRACT: string = '/v1/get-individual-contract'
export const API_GET_INSURANCE_BY_ADDRESS: string = '/v1/get-insurance-by-address'
export const API_GET_LIST_TOKEN: string = '/v1/get-list-token'
export const API_GET_COVER_PAYOUT: string = '/v1/get-cover-payout'
export const API_GET_BUY_INSURANCE: string = '/v1/buy-insurance'
export const API_CHECK_NOTICE: string = '/v1/check-notice'
export const API_GET_NOTICE: string = '/v1/get-notice'
export const API_UPDATE_NOTICE: string = '/v1/update-notice'
export const API_GET_CONFIG_ASSET: string = 'v1/get-config-asset'
export const API_CHECK_GUIDE_LINE: string = 'v1/check-guide-line'
export const API_UPDATE_GUIDE_LINE: string = 'v1/update-guide-line'
export const API_SUBSCRIBE = 'v1/subscribe'
export const API_GET_NONCE: string = 'v1/get-nonce'
export const API_LOGIN: string = 'v1/log-in'
export const API_GET_TOKEN_COOKIES: string = 'v1/get-token-cookies'
export const API_GET_INFO_USER = '/v1/get-info-user'
export const API_UPDATE_USER_INFO = '/v1/update-info-user'
export const API_CONTACT = '/v1/contact-user-email'

//commission
export const API_GET_FRIENDS: string = '/v1/get-friends'
export const API_GET_COMMISSION_HISTORY: string = '/v1/get-commission-history'
export const API_GET_INFO_USER_COMMISSION: string = '/v1/get-info-user-commission'


//futures
export const API_GET_UNIT_CONFIG: string = Config.env.NAMI_API_URL + '/api/v3/asset/config'
export const API_GET_FUTURES_MARKET_WATCH = Config.env.NAMI_API_URL + '/api/v3/futures/ticker'
export const API_GET_PRICE_CHART = Config.env.PRICE_API_URL + '/api/v1/chart/history'
