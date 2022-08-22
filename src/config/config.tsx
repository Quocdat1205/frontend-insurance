import env from 'config/env'
import { Ref } from 'react'
import { Notify } from 'types/types'

class Config {
    static env = env

    static client = typeof window !== 'undefined'
    static notify: Notify
    static alert: Notify

    static pattern = (key: string) => {
        let rs: any = ''
        switch (key) {
            case 'email':
                rs = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
                break
            case 'phone':
                rs = /(84|0[3|5|7|8|9])+([0-9]{8})\b/
                break
            case 'number':
                rs = /^(0|[1-9][0-9]*)$/
                break
            default:
                break
        }
        return rs
    }
}

export default Config
