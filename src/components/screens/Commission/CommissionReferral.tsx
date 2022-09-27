import Button from 'components/common/Button/Button'
import { useTranslation } from 'next-i18next'
import React from 'react'

const CommissionReferral = () => {
    const { t } = useTranslation()
    return (
        <div className="flex flex-col mb:flex-row items-center justify-between relative">
            <div className="flex flex-col items-center text-center sm:text-left sm:items-start  max-w-[600px]">
                <div className="text-4xl mb:text-[3rem] mb:leading-[4rem] font-semibold">Giới thiệu bạn mới Thưởng lợi nhuận vô hạn</div>
                <div className="mt-4 text-sm sm:text-base">Thưởng đến 10% hoa hồng mỗi khi bạn bè của bạn ký quỹ hợp đồng bảo hiểm thành công</div>
                <Button className="px-6 py-3 w-full sm:w-max mt-8">{t('home:home:connect_wallet')}</Button>
            </div>
            <div className="w-full h-full max-w-[554px] lg:h-[492px] mt-12 mb:mt-0">
                <img src="/images/screens/commission/bg_commission.png" className="w-full h-full" />
            </div>
        </div>
    )
}

export default CommissionReferral
