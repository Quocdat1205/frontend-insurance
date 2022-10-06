export const PublicSocketEvent = {
    SPOT_RECENT_TRADE_ADD: 'spot:recent_trade:add',
    SPOT_DEPTH_UPDATE: 'spot:depth:update',
    SPOT_TICKER_UPDATE: 'spot:ticker:update',

    FUTURES_DEPTH_UPDATE: 'futures:depth:update',
    FUTURES_TICKER_UPDATE: 'futures:ticker:update',
    FUTURES_MINI_TICKER_UPDATE: 'futures:mini_ticker:update',
    FUTURES_MARK_PRICE_UPDATE: 'futures:mark_price:update',

    IEO_PERCENTAGE_UPDATE: 'ieo:project_update',
    IEO_TICKET_STATUS_UPDATE: 'ieo:buy_response',
    CALCULATE_WITHDRAW_FEE: 'calculate_withdrawal_fee',
}
