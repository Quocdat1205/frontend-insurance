import LayoutInsurance from 'components/layout/layoutInsurance'

import Config from 'config/config'
import useWindowSize from 'hooks/useWindowSize'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import dynamic from 'next/dynamic'
import { screens } from 'utils/constants'

const AcceptBuyInsurance = dynamic(() => import('components/screens/Insurance/AcceptBuyInsurance'), {
    ssr: false,
})
const Insurance = ({ slug }: any) => {
    const { t } = useTranslation()
    const { width, height } = useWindowSize()
    const isMobile = width && width <= screens.drawer

    switch (slug) {
        case 'info-covered':
            return !isMobile ? (
                <LayoutInsurance>
                    <AcceptBuyInsurance />
                </LayoutInsurance>
            ) : (
                <>
                    <AcceptBuyInsurance />
                </>
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
