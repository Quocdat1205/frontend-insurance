import type { AppProps } from 'next/app'
import 'styles/index.scss'
import { Provider } from 'react-redux'
import Head from 'components/layout/Head'
import MetaMaskProvider from 'components/web3/MetaMaskProvider'
import 'types/declare'
import store from 'redux/store'
import { appWithTranslation } from 'next-i18next'
import NProgress from 'nprogress'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import 'react-datepicker/dist/react-datepicker.css'
import { registerLocale } from 'react-datepicker'
import vi from 'date-fns/locale/vi'
import en from 'date-fns/locale/en-US'
import { days, months } from 'utils/constants'
import Container from 'components/layout/Container'

vi.localize = {
    day: (n: number) => days[n]['vi'],
    month: (n: number) => months[n]['vi'],
    ordinalNumber: () => undefined,
    era: () => undefined,
    quarter: () => undefined,
    dayPeriod: () => undefined,
}

en.localize = {
    day: (n: number) => days[n]['en'],
    month: (n: number) => months[n]['en'],
    ordinalNumber: () => undefined,
    era: () => undefined,
    quarter: () => undefined,
    dayPeriod: () => undefined,
}
registerLocale('vi', {
    ...vi,
})

registerLocale('en', {
    ...en,
})
function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter()

    useEffect(() => {
        const handleRouteChange = (url: string) => {
            NProgress.done()
        }
        router.events.on('routeChangeStart', (url) => {
            NProgress.start()
        })
        router.events.on('routeChangeError', () => NProgress.done())
        router.events.on('routeChangeComplete', handleRouteChange)
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange)
        }
    }, [router.events])

    return (
        <Provider store={store}>
            <Container>
                <Head />
                <MetaMaskProvider>
                    <Component {...pageProps} />
                </MetaMaskProvider>
            </Container>
        </Provider>
    )
}

export default appWithTranslation(MyApp)
