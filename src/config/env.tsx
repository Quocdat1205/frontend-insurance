interface Env {
    APP_URL: string
    API_URL: string
    PORT: string | number
    CDN: string
    NODE_ENV: string
    BSC: string
    CHAINS: string
}

const env: Env = {
    APP_URL: process?.env?.NEXT_PUBLIC_APP_URL ?? '',
    API_URL: process?.env?.NEXT_PUBLIC_API_URL ?? '',
    PORT: process?.env?.NEXT_PUBLIC_PORT ?? 3000,
    CDN: process.env.NEXT_PUBLIC_CDN ?? '',
    NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV ?? 'dev',
    BSC: process.env.NEXT_PUBLIC_BSCSCAN ?? '',
    CHAINS: process.env.NEXT_PUBLIC_CHAINS ?? '',
}

export default env
