import Breadcrumbs from 'components/layout/Breadcrumbs'
import LayoutWeb3 from 'components/layout/LayoutWeb3'
import { useTranslation } from 'next-i18next'

const InsuranceHistory = () => {
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
