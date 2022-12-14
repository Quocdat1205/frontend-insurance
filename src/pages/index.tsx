import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import LayoutLanding from 'components/layout/LayoutLanding'
import BannerLanding from 'components/screens/LandingPage/BannerLanding'
import FaqLanding from 'components/screens/LandingPage/FAQLanding'
import FeaturesLanding from 'components/screens/LandingPage/FeaturesLanding'
// import RegisterLanding from 'components/screens/LandingPage/RegisterLanding'
import HeroSection from 'components/screens/LandingPage/SectionHero'
import SloganLanding from 'components/screens/LandingPage/SloganLanding'

const LandingPage = (props: any) => (
    <LayoutLanding>
        {/* <SloganLanding /> */}
        {/* <SloganLanding /> */}
        {/* <BannerLanding /> */}
        <HeroSection />
        <FeaturesLanding />
        <FaqLanding />
        {/* <RegisterLanding /> */}
    </LayoutLanding>
)

export const getStaticProps: GetStaticProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'home', 'errors'])),
    },
})
export default LandingPage
