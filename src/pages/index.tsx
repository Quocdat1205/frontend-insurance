import { useWeb3React } from '@web3-react/core'
import { useEffect } from 'react'

import LayoutLanding from 'components/layout/LayoutLanding'
import BannerLP from 'components/screens/LandingPage/BannerLP'
import CategoryLP from 'components/screens/LandingPage/CategoryLP'
import Statistic from 'components/screens/LandingPage/Statistic'
import Config from 'config/config'
import useWeb3Wallet from 'hooks/useWeb3Wallet'

function Home(props: any) {
  return (
    <LayoutLanding>
      <div className="mt-9">
        <BannerLP />
        <Statistic />
        <div className="mt-[120px]">
          <CategoryLP />
        </div>
      </div>
    </LayoutLanding>
  )
}

export default Home
