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

function MyApp({ Component, pageProps }: AppProps) {
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
