import Breadcrumbs from 'components/layout/Breadcrumbs'
import LayoutWeb3 from 'components/layout/LayoutWeb3'
import InsuranceContractLoading from 'components/screens/InsuranceHistory/InsuranceContractLoading'
import { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import dynamic from 'next/dynamic'

const InsuranceHistory = dynamic(() => import('components/screens/InsuranceHistory/InsuranceHistory'), {
    ssr: false,
    loading: () => <InsuranceContractLoading />,
})

const InsuranceHistoryFrom = () => {
    const {
        t,
        i18n: { language },
    } = useTranslation()
    return (
        <LayoutWeb3 sponsor={false}>
            <Breadcrumbs>
                <div>{t('common:header:home')}</div>
                <div>{t('common:header:buy_covered')}</div>
                <div>{t('common:header:insurance_history')}</div>
            </Breadcrumbs>
            <InsuranceHistory />
        </LayoutWeb3>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'home', 'insurance', 'errors', 'insurance_history'])),
    },
})

export default InsuranceHistoryFrom
