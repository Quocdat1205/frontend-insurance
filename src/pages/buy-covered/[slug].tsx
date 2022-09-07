import Config from 'config/config'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import dynamic from 'next/dynamic'
const InsuranceHistory = dynamic(() => import('components/screens/InsuranceHistory/InsuranceHistory'), {
    ssr: false,
})
const Insurance = ({ slug }: any) => {
    switch (slug) {
        case 'insurance-history':
            return <InsuranceHistory />
    }
}
export const getServerSideProps = async ({ locale, query }: any) => {
    try {
        const isValid = Config.homeMenu.find((router: any) => router.menuId === query.slug)
        if (isValid) {
            return {
                props: {
                    slug: query.slug,
                    ...(await serverSideTranslations(locale, ['common', 'home', 'insurance', 'insurance_history'])),
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
