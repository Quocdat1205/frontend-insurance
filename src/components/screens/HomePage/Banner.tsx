import classnames from 'classnames'
import useWindowSize from 'hooks/useWindowSize'
import React from 'react'
import styled from 'styled-components'
import InlineSVG from 'react-inlinesvg'
import { useTranslation } from 'next-i18next'

const Banner = () => {
    const { width } = useWindowSize()
    const { t } = useTranslation()
    const isMobile = width && width < 640
    const list = [
        { title: t('home:landing:total_q_covered'), value: '200,000,000', icon: '/images/screens/home/ic_banner_1.svg' },
        { title: t('home:landing:total_margin'), value: '1,000,000,000', icon: '/images/screens/home/ic_banner_2.svg' },
        { title: t('home:landing:users'), value: '1,000', icon: '/images/screens/home/ic_banner_3.svg' },
        { title: t('home:landing:avg_r_claim'), value: '200.12%', icon: '/images/screens/home/ic_banner_4.svg' },
    ]
    return (
        <section className="pt-20 sm:pt-[7.5rem]">
            <div className="text-2xl font-semibold mb-6 px-4 max-w-screen-insurance m-auto">{t('home:home:statistics')}</div>

            <Background isMobile={isMobile}>
                <div className="max-w-screen-insurance m-auto text-center flex flex-col space-y-8 sm:space-y-6">
                    <div className="flex flex-col space-y-[2px]">
                        <div className="leading-5 sm:leading-6">{t('home:landing:total_q_claim')}</div>
                        <div className="text-red text-[2.5rem] leading-[3.5rem] sm:leading-10 font-bold sm:font-semibold">10,000,000</div>
                    </div>
                    <div className="grid grid-rows-4 sm:grid-rows-2 sm:grid-cols-2 lg:grid-rows-1 lg:grid-cols-4 grid-flow-col gap-x-6 lg:gap-6">
                        {list.map((item: any, index: number) => (
                            <Item key={index} className="border-gradient-red">
                                <div className="max-h-[54px]">
                                    <InlineSVG src={item.icon} />
                                </div>
                                <div className="flex flex-col space-y-[2px] sm:space-y-2">
                                    <div className="text-txtSecondary text-sm">{item.title}</div>
                                    <div className="font-semibold text-2xl">{item.value}</div>
                                </div>
                            </Item>
                        ))}
                    </div>
                </div>
            </Background>
        </section>
    )
}

const Item = styled.div.attrs<any>({
    className: classnames(
        'shadow-banner pt-6 pb-9 last:mb-0 lg:last:!-mb-3 last:pb-6 -mb-3 lg:last:m-0 first:mt-0 sm:mt-0 sm:!p-4 w-full ',
        'text-center flex flex-col items-center space-y-2 ',
    ),
})`
    backdrop-filter: blur(5px);
    border-radius: 12px 12px 0px 0px;
    border-bottom: 0;
`
const Background = styled.div.attrs({
    className: 'pt-8 px-4',
})<any>`
    background-image: ${({ isMobile }) => `url(${`/images/screens/home/bg_banner${isMobile ? '_mobile' : ''}.png`})`};
    background-position: top;
    background-repeat: no-repeat;
    background-size: cover;
`
export default Banner
