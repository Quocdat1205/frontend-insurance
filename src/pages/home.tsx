import LayoutWeb3 from 'components/layout/LayoutWeb3'
import Assets from 'components/screens/HomePage/Assets'
import Banner from 'components/screens/HomePage/Banner'
import News from 'components/screens/HomePage/News'
import Slogan from 'components/screens/HomePage/Slogan'
import RegisterLanding from 'components/screens/LandingPage/RegisterLanding'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React from 'react'

const Home = () => {
    return (
        <LayoutWeb3>
            <Slogan />
            <Assets />
            <Banner />
            <News />
            <RegisterLanding />
        </LayoutWeb3>
    )
}
export const getStaticProps: GetStaticProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'home'])),
    },
})

export default Home
