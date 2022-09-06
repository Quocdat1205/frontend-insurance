import axios from 'axios'

const mandatory = () => Promise.reject(new Error('Fetch API Missing parameter!'))

export const buyInsurance = async ({ props }: any = mandatory(), cb: any = (f: any) => f) => {
    try {
        const { owner, transaction_hash, id_sc, asset_covered, asset_refund, margin, q_covered, p_claim, period } = props
        const { data } = await axios.post('/buy-insurance', {
            owner,
            transaction_hash,
            id_sc,
            asset_covered,
            asset_refund,
            margin,
            q_covered,
            p_claim,
            period,
        })

        return data
    } catch (error) {
        console.error(error)
        return false
    }
}
