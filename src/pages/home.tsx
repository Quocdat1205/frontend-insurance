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
import { useTranslation } from 'next-i18next'

const Home = ({ news }: any) => {
    const { t } = useTranslation()
    return (
        <LayoutWeb3>
            <Slogan />
            <section className="pt-20 sm:pt-[7.5rem] px-4 max-w-screen-insurance m-auto">
                <div className="text-2xl sm:text-5xl font-semibold mb-6">{t('home:home:new_insurance_assets')}</div>
                <Assets />
            </section>
            <Banner />
            <News news={news} />
            <RegisterLanding />
        </LayoutWeb3>
    )
}
export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
    const news = await getArticles('crypto101', 6, locale)
    return {
        props: {
            news: news,
            ...(await serverSideTranslations(locale, ['common', 'home'])),
        },
    }
}

export default Home
