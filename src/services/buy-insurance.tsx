import axios from 'axios'
import { parseNumber } from 'utils/format'

const mandatory = () => Promise.reject(new Error('Fetch API Missing parameter!'))

export const buyInsurance = async ({ props }: any = mandatory(), cb: any = (f: any) => f) => {
    try {
        const { owner, current_price, liquidation_price, deposit, expired } = props
        const price = JSON.stringify(deposit, (_, v) => (typeof v === 'bigint' ? `${v}n` : v)).replace(/"(-?\d+)n"/g, (_, a) => a)

        const { data } = await axios.post('/buy-insurance', {
            owner,
            current_price: parseNumber(current_price as unknown as string),
            liquidation_price: parseNumber(liquidation_price),
            deposit: parseNumber(price),
            expired,
        })

        return data
    } catch (error) {
        console.error(error)
        return false
    }
}
