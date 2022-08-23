import classnames from 'classnames'
import useWindowSize from 'hooks/useWindowSize'
import { useTranslation } from 'next-i18next'
import React from 'react'
import styled from 'styled-components'

const BannerLanding = () => {
    const { t } = useTranslation()
    const { width } = useWindowSize()
    const isMobile = width && width < 640
    const list = [
        { title: t('home:landing:total_q_claim'), value: '200,000,000' },
        { title: t('home:landing:total_margin'), value: '1,000,000,000' },
        { title: t('home:landing:users'), value: '1,000' },
        { title: t('home:landing:avg_r_claim'), value: '200.12%' },
    ]

    return (
        <Background isMobile={isMobile}>
            <div className="max-w-screen-insurance m-auto text-center flex flex-col space-y-12 sm:space-y-6">
                <div className="flex flex-col space-y-2">
                    <div className="leading-5 sm:leading-6">{t('home:landing:total_q_claim')}</div>
                    <div className="text-red text-[2.5rem] leading-[3.5rem] sm:leading-10 font-bold sm:font-semibold">10,000,000</div>
                </div>
                <div className="grid grid-rows-4 sm:grid-rows-2 sm:grid-cols-2 lg:grid-rows-1 lg:grid-cols-4 grid-flow-col sm:gap-x-6 lg:gap-6">
                    {list.map((item: any, index: number) => (
                        <Item key={index} className="bg-gradient-red ">
                            <div className="text-txtSecondary text-sm">{item.title}</div>
                            <div className="font-semibold text-2xl">{item.value}</div>
                        </Item>
                    ))}
                </div>
            </div>
        </Background>
    )
}

const Item = styled.div.attrs<any>({
    className: classnames(
        'shadow-banner pt-6 pb-9 last:pb-6 -mb-3 lg:m-0 first:mt-0 sm:!p-4 w-full ',
        'text-center flex flex-col lg:items-start items-center space-y-2 sm:even:mb-0 last:m-0',
    ),
})`
    backdrop-filter: blur(5px);
    border-radius: 12px 12px 0px 0px;
    border-bottom: 0;
`
const Background = styled.section.attrs({
    className: 'pt-12 banner-landing px-4 lg:px-20',
})<any>`
    background-image: ${({ isMobile }) => `url(${`/images/screens/landing-page/bg_banner${isMobile ? '_mobile' : ''}.png`})`};
    background-position: top;
    background-repeat: no-repeat;
    background-size: cover;
`

export default BannerLanding
