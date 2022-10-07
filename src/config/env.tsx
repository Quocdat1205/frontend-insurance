interface Env {
    APP_URL: string
    API_URL: string
    PORT: string | number
    CDN: string
    NODE_ENV: string
    BSC: string
    CHAINS: string
    PRICE_API_URL: string
    NAMI_API_URL: string
    USER_SOCKET: string
    PUBLIC_SOCKET: string
}

const env: Env = {
    APP_URL: process?.env?.NEXT_PUBLIC_APP_URL ?? '',
    API_URL: process?.env?.NEXT_PUBLIC_API_URL ?? '',
    PORT: process?.env?.NEXT_PUBLIC_PORT ?? 3000,
    CDN: process.env.NEXT_PUBLIC_CDN ?? '',
    NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV ?? 'dev',
    BSC: process.env.NEXT_PUBLIC_BSCSCAN ?? '',
    CHAINS: process.env.NEXT_PUBLIC_CHAINS ?? '',
    PRICE_API_URL: process.env.NEXT_PUBLIC_PRICE_API_URL ?? '',
    NAMI_API_URL: process.env.NEXT_PUBLIC_NAMI_API_URL ?? '',
    USER_SOCKET: process.env.NEXT_PUBLIC_USER_SOCKET ?? '',
    PUBLIC_SOCKET: process.env.NEXT_PUBLIC_STREAM_SOCKET ?? '',
}

export default env
