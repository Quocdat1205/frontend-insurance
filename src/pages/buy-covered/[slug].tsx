import Breadcrumbs from 'components/layout/Breadcrumbs'
import LayoutWeb3 from 'components/layout/LayoutWeb3'
import { InsuranceFormLoading } from 'components/screens/Insurance/insuranceFormLoading'
import InsuranceContractLoading from 'components/screens/InsuranceHistory/InsuranceContractLoading'
import Config from 'config/config'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import dynamic from 'next/dynamic'
const InsuranceHistory = dynamic(() => import('components/screens/InsuranceHistory/InsuranceHistory'), {
    ssr: false,
    loading: () => <InsuranceContractLoading />,
})

const AcceptBuyInsurance = dynamic(() => import('components/screens/Insurance/AcceptBuyInsurance'), {
    ssr: false,
})
const Insurance = ({ slug }: any) => {
    const { t } = useTranslation()

    switch (slug) {
        case 'insurance-history':
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
        case 'info-covered':
            return (
                <LayoutWeb3 sponsor={false}>
                    <div className="w-full bg-[#E5E7E8] h-[0.25rem] sticky top-0 z-[50]">
                        <div className="bg-red h-[0.25rem] w-full"></div>
                    </div>
                    <AcceptBuyInsurance />
                </LayoutWeb3>
            )
    }
}
export const getServerSideProps = async ({ locale, query }: any) => {
    try {
        const isValid = Config.homeMenu.find((router: any) => router.menuId === query.slug)

        if (isValid) {
            return {
                props: {
                    slug: query.slug,
                    ...(await serverSideTranslations(locale, ['common', 'home', 'insurance', 'insurance_history', 'errors'])),
                },
            }
        }
        if (query.slug === 'info-covered') {
            return {
                props: {
                    slug: query.slug,
                    ...(await serverSideTranslations(locale, ['common', 'home', 'insurance', 'insurance_history', 'errors'])),
                },
            }
        }
        return {
            redirect: {
                permanent: false,
                destination: '/404',
            },
        }
    } catch (e) {
        return {
            redirect: {
                permanent: false,
                destination: '/404',
            },
        }
    }
}

export default Insurance
