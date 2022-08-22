import LayoutLanding from 'components/layout/LayoutLanding'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import SloganLanding from 'components/screens/LandingPage/SloganLanding'
import BannerLanding from 'components/screens/LandingPage/BannerLanding'
import FeaturesLanding from 'components/screens/LandingPage/FeaturesLanding'
import RegisterLanding from 'components/screens/LandingPage/RegisterLanding'

const LandingPage = (props: any) => {
    return (
        <LayoutLanding>
            <SloganLanding />
            <BannerLanding />
            <FeaturesLanding />
            <RegisterLanding />
        </LayoutLanding>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'home'])),
    },
})
export default LandingPage
