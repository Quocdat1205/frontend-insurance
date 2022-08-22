import type { AppProps } from 'next/app'
import 'styles/index.scss'
import { Provider } from 'react-redux'
import Head from 'components/layout/Head'
import MetaMaskProvider from 'components/web3/MetaMaskProvider'
import 'types/declare'
import store from 'redux/store'
import { appWithTranslation } from 'next-i18next'
import Notifications from 'components/layout/Notifications'
import Config from 'config/config'
import AlertModal from 'components/common/Modal/AlertModal'

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Provider store={store}>
            <Notifications ref={(ref: any) => (Config.notify = ref)} />
            <AlertModal portalId="alert-modal" ref={(ref: any) => (Config.alert = ref)} />
            <Head />
            <MetaMaskProvider>
                <Component {...pageProps} />
            </MetaMaskProvider>
        </Provider>
    )
}

export default appWithTranslation(MyApp)
