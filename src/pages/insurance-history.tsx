import Breadcrumbs from 'components/layout/Breadcrumbs'
import LayoutWeb3 from 'components/layout/LayoutWeb3'
import InsuranceContractLoading from 'components/screens/InsuranceHistory/InsuranceContractLoading'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import dynamic from 'next/dynamic'
const CInsuranceHistory = dynamic(() => import('components/screens/InsuranceHistory/InsuranceHistory'), {
    ssr: false,
    loading: () => <InsuranceContractLoading />,
})

const InsuranceHistory = () => {
    const { t } = useTranslation()
    return (
        <LayoutWeb3 sponsor={false}>
            <Breadcrumbs>
                <div>{t('common:header:home')}</div>
                <div>{t('common:header:buy_covered')}</div>
                <div>{t('common:header:insurance_history')}</div>
            </Breadcrumbs>
            <CInsuranceHistory />
        </LayoutWeb3>
    )
}

export const getServerSideProps = async ({ locale }: any) => {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'home', 'insurance', 'insurance_history', 'errors'])),
        },
    }
}

export default InsuranceHistory
