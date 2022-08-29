import type { AppProps } from 'next/app'
import 'styles/index.scss'
import { Provider } from 'react-redux'
import Head from 'components/layout/Head'
import MetaMaskProvider from 'components/web3/MetaMaskProvider'
import 'types/declare'
import store from 'redux/store'
import { appWithTranslation } from 'next-i18next'
import Toast from 'components/layout/Toast'
import Config from 'config/config'
import AlertModal from 'components/common/Modal/AlertModal'
import NProgress from 'nprogress'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

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
            <Toast ref={(ref: any) => (Config.toast = ref)} />
            <AlertModal portalId="alert-modal" ref={(ref: any) => (Config.alert = ref)} />
            <Head />
            <MetaMaskProvider>
                <Component {...pageProps} />
            </MetaMaskProvider>
        </Provider>
    )
}

export default appWithTranslation(MyApp)
