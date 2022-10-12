import { useTranslation } from 'next-i18next'
import React from 'react'
import styled from 'styled-components'

interface CommissionPolicy {
    commissionConfig: any[]
}

const CommissionPolicy = ({ commissionConfig }: CommissionPolicy) => {
    const {
        t,
        i18n: { language },
    } = useTranslation()

    const bonusContent: any = {
        vi: {
            label: 'Mỗi $50,000 thêm',
            text: 'Tăng thêm 1% đến tối đa 10% (tương đương $400,000).',
        },
        en: {
            label: 'For each $50,000 additional',
            text: 'Increase by 1% up to a maximum of 10% (approximately to $400,000).',
        },
    }

    return (
        <Background className="">
            <div className="text-2xl sm:text-5xl font-semibold text-center">{t('commission:policy:title')}</div>
            <div className="text-sm sm:text-base max-w-[780px] text-center mt-4">{t('commission:policy:description')}</div>
            <div className="border border-red rounded-xl mt-10 sm:mt-12 w-full lg:w-max text-sm sm:text-base">
                <div className="bg-pink-2 text-red font-semibold flex items-center rounded-t-xl">
                    <div className="px-4 pt-6 pb-4 sm:pl-12 sm:pr-6 sm:py-6 w-1/2 sm:min-w-[237px] rounded-t-xl">{t('commission:policy:total_margin')}</div>
                    <div className="px-4 pt-6 pb-4 sm:pl-12 sm:pr-6 sm:py-6 w-1/2 sm:min-w-[359px] rounded-tr-xl">{t('commission:policy:reward_rate')}</div>
                </div>
                <div className="flex flex-col divide-y divide-divider border-t border-divider">
                    {commissionConfig.map((item: any, index: number) =>
                        index + 1 === commissionConfig.length ? (
                            <div key={index} className="flex items-center">
                                <div className="px-4 pt-6 pb-4 sm:pl-12 sm:pr-6 sm:py-6 w-1/2 sm:min-w-[237px]">{bonusContent[language]?.label}</div>
                                <div className="px-4 pt-6 pb-4 sm:pl-12 sm:pr-6 sm:py-6 w-1/2 sm:min-w-[359px]">{bonusContent[language]?.text}</div>
                            </div>
                        ) : (
                            <div key={index} className="flex items-center">
                                <div className="px-4 pt-6 pb-4 sm:pl-12 sm:pr-6 sm:py-6 w-1/2 sm:min-w-[237px]">{item?.label}</div>
                                <div className="px-4 pt-6 pb-4 sm:pl-12 sm:pr-6 sm:py-6 w-1/2 sm:min-w-[359px]">{item?.text}</div>
                            </div>
                        ),
                    )}
                </div>
            </div>
        </Background>
    )
}

const Background = styled.div.attrs<any>({
    className: 'mt-[4.375rem] py-10 sm:py-[4.375rem] flex flex-col items-center justify-center px-4 mb:px-10 lg:px-20',
})`
    background-image: ${() => `url(${`/images/screens/commission/bg_commission_policy.png`})`};
    background-position: top;
    background-repeat: no-repeat;
    background-size: cover;
`

export default CommissionPolicy
