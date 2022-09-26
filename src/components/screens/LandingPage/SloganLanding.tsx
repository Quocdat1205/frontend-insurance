import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import React from 'react'
import styled from 'styled-components'
import Button from 'components/common/Button/Button'

const SloganLanding = () => {
    const { t } = useTranslation()
    const router = useRouter()

    const handleClickBuyCover = () => router.push('/buy-covered')

    return (
        <Background>
            {/* <div className="max-w-screen-insurance 4xl:max-w-screen-3xl m-auto slider-landing flex flex-col space-y-6 sm:space-y-0 sm:flex-row items-center justify-between mt-[4.25rem] sm:mt-9 mt-[4.25rem] sm:mt-9 h-[calc(100vh-300px)] sm:h-auto"> */}
            {/* <div className="max-w-screen-insurance 4xl:max-w-screen-3xl m-auto slider-landing flex flex-col space-y-6 lg:space-y-0 lg:flex-row items-center justify-between max-h-[calc(100vh-68px)] lg:h-auto"> */}
            <div
                className="max-w-screen-insurance 4xl:max-w-screen-3xl m-auto slider-landing flex flex-col space-y-6 lg:space-y-0 lg:flex-row items-center justify-between
                h-full"
            >
                <div className="flex flex-col space-y-6 lg:space-y-9 w-full">
                    <div className="flex flex-col space-y-2 pt-[4.25rem] lg:pt-0 text-center lg:text-left font-semibold">
                        <span className="text-[2rem] lg:text-[4.25rem] lg:leading-[5rem]">{t('common:slogan_first')}</span>
                        <span className="text-4xl text-gradient text-[2rem] lg:text-[4.25rem] lg:leading-[5rem]">{t('common:slogan_second')}</span>
                    </div>
                    <div className="flex items-center justify-between lg:justify-start space-x-4 text-sm font-semibold">
                        <Button
                            onClick={handleClickBuyCover}
                            className="w-full lg:w-max h-12 text-sm lg:text-xl lg:h-full whitespace-nowrap !rounded-xl px-6 py-4 leading-6"
                        >
                            {t('home:landing:buy_covered')}
                        </Button>
                        {/* <Button
                            variants="outlined"
                            className="w-full lg:w-max h-12 lg:text-base lg:h-full px-6 py-[0.875rem] leading-6 whitespace-nowrap !rounded-xl"
                        >
                            {t('home:landing:buy_nain')}
                        </Button> */}
                    </div>
                </div>
                {/* <div className="max-w-[848px] 3xl:max-w-[75rem] w-full flex justify-end"> */}
                <div className="max-w-[848px] 3xl:max-w-[75rem] pb-0 w-full flex justify-end lg:h-full h-[calc(100vh-468px)]">
                    <img src="/images/screens/landing-page/hero_section.gif" className="m-auto lg:mx-auto lg:max-w-[680px] lg:max-h-[580px] h-full " />
                </div>
            </div>
        </Background>
    )
}

const Background = styled.section.attrs<any>({
    className: 'px-4 lg:px-20 h-full h-screen pb-[180px] lg:-mt-[68px] mt-0 lg:pt-[68px]',
    // className: 'px-4 pt-[4.25rem] pb-20',
})<any>`
    background-image: ${({ isMobile }) => `url(${`/images/screens/landing-page/background_nested.png`})`};
    background-position: bottom;
    background-repeat: no-repeat;
    background-size: cover;
`

export default SloganLanding
