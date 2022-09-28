import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import React from 'react'
import styled from 'styled-components'
import Button from 'components/common/Button/Button'
import useWindowSize from 'hooks/useWindowSize'
import { screens } from 'utils/constants'

const SloganLanding = () => {
    const { t } = useTranslation()
    const router = useRouter()

    const { width } = useWindowSize()
    const isMobile = width && width <= 820

    const handleClickBuyCover = () => router.push('/buy-covered')

    return (
        <Background>
            {/* <div className="max-w-screen-insurance 4xl:max-w-screen-3xl m-auto slider-landing flex flex-col space-y-6 sm:space-y-0 sm:flex-row items-center justify-between mt-[4.25rem] sm:mt-9 mt-[4.25rem] sm:mt-9 h-[calc(100vh-300px)] sm:h-auto"> */}
            {/* <div className="max-w-screen-insurance 4xl:max-w-screen-3xl m-auto slider-landing flex flex-col space-y-6 lg:space-y-0 lg:flex-row items-center justify-between max-h-[calc(100vh-68px)] lg:h-auto"> */}
            <div
                className="max-w-screen-insurance 4xl:max-w-screen-3xl m-auto slider-landing flex flex-col space-y-6 lg:space-y-0 lg:flex-row items-center md:justify-between
                h-full"
            >
                <div className="flex flex-col space-y-6 lg:space-y-9 w-full">
                    <div className="flex flex-col space-y-2 pt-[4.25rem] lg:pt-0 text-center lg:text-left font-semibold">
                        <span className="text-[2rem] leading-[2.75rem] lg:text-[3.625rem] lg:leading-[5rem]">{t('common:slogan_first')}</span>
                        <span className="leading-[3.75rem] text-gradient text-5xl lg:text-[4.875rem] lg:leading-[6rem]">{t('common:slogan_second')}</span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start space-x-4 text-sm font-semibold">
                        <Button
                            onClick={handleClickBuyCover}
                            className=" w-max h-12 text-base lg:text-xl lg:h-full whitespace-nowrap !rounded-xl px-9 py-4 lg:px-[3rem] leading-6"
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
                <div className="max-w-[848px] 3xl:max-w-[75rem] pb-0 w-full flex justify-end lg:h-full h-[calc(100vh-490px)]">
                    <img
                        src={`/images/screens/landing-page/bg_home${isMobile ? '_mobile' : ''}.png`}
                        className="m-auto lg:mx-auto lg:max-w-[380px] lg:max-h-[380px]  xl:max-w-[580px] xl:max-h-[480px] h-full max-w-[350px] max-h-[294px]  md:max-w-[400px] md:max-h-[384px] "
                    />
                </div>
            </div>
        </Background>
    )
}

const Background = styled.section.attrs<any>({
    className: 'px-4 lg:px-20 h-full h-screen pb-[206px] lg:-mt-[68px] mt-0 lg:pt-[68px]',
    // className: 'px-4 pt-[4.25rem] pb-20',
})<any>`
    background-image: ${({ isMobile }) => `url(${`/images/screens/landing-page/background_nested.png`})`};
    background-position: bottom;
    background-repeat: no-repeat;
    background-size: cover;
`

export default SloganLanding
