import axios from 'axios'
import Config from 'config/config'
import { API_GET_GET_LIST_TOKEN } from './apis'

export const getListToken = async () => {
    try {
        let list: never[] = []
        await axios.get(`${Config.env.API_URL}${API_GET_GET_LIST_TOKEN}`).then((e) => {
            return (list = e.data)
        })
        return list
    } catch (err) {
        console.error(err)
    }
}
