import LayoutWeb3 from 'components/layout/LayoutWeb3'
import Assets from 'components/screens/HomePage/Assets'
import Banner from 'components/screens/HomePage/Banner'
import News from 'components/screens/HomePage/News'
import Slogan from 'components/screens/HomePage/Slogan'
import RegisterLanding from 'components/screens/LandingPage/RegisterLanding'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React from 'react'
import { getArticles } from 'utils/utils'

const Home = ({ news }: any) => {
    return (
        <LayoutWeb3>
            <Slogan />
            <Assets />
            <Banner />
            <News news={news} />
            <RegisterLanding />
        </LayoutWeb3>
    )
}
export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
    const news = await getArticles('noti', 6, locale)
    return {
        props: {
            news: news,
            ...(await serverSideTranslations(locale, ['common', 'home'])),
        },
    }
}

export default Home
