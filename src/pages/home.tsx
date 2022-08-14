import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React, { useEffect } from 'react'

import Layout from 'components/layout/Layout'
import useLanguage from 'hooks/useLanguage'
import Banner from 'components/screens/HomePage/Banner'
import NewInsuarance from 'components/screens/HomePage/NewInsuarance'
import News from 'components/screens/HomePage/News'
import Statistic from 'components/screens/LandingPage/Statistic'

function Index() {
  const { t } = useTranslation()
  const [currentLocale, onChangeLang] = useLanguage()
  return (
    <Layout>
      <div className="flex flex-col gap-[120px]">
        <Banner />
        <NewInsuarance />
        <Statistic />
        <News />
      </div>
    </Layout>
  )
}

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['home'])),
  },
})

export default Index
