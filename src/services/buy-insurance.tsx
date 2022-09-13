import axios from 'axios'
import Config from 'config/config'
import { API_GET_BUY_INSURANCE, API_GET_GET_TOKEN } from './apis'

export const buyInsurance = async (props: {
    owner: string
    transaction_hash: string
    id_sc: number
    asset_covered: string
    asset_refund: string
    margin: number
    q_covered: number
    p_claim: number
    period: number
}) => {
    try {
        const { owner, transaction_hash, id_sc, asset_covered, asset_refund, margin, q_covered, p_claim, period } = props

        const AuthToken = await axios.get(`${Config.env.API_URL}${API_GET_GET_TOKEN}`, { params: { walletAddress: owner } })

        const { data } = await axios.post(
            `${Config.env.API_URL}${API_GET_BUY_INSURANCE}`,
            {
                owner,
                transaction_hash,
                id_sc,
                asset_covered,
                asset_refund,
                margin,
                q_covered,
                p_claim,
                period,
            },
            { headers: { Authorization: `Bearer ${AuthToken.data}` } },
        )

        console.log(data)

        return data
    } catch (error) {
        console.error(error)
        return false
    }
}
