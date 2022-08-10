import type { AppProps } from 'next/app'
import 'styles/index.scss'
import Head from 'components/layout/Head';
import MetaMaskProvider from 'components/web3/MetaMaskProvider';
import { Provider } from 'react-redux';
import store from 'redux/store';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
      <Head />
      <MetaMaskProvider>
        <Component {...pageProps} />
      </MetaMaskProvider>
    </Provider>
  )
}
export default MyApp
