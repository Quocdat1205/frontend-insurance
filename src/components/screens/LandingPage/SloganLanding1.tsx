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
            <div
                className="max-w-screen-insurance 4xl:max-w-screen-3xl m-auto slider-landing flex flex-col space-y-6 lg:space-y-0 lg:flex-row items-center md:justify-between
                h-full position-absolute justify-between"
            >
                <div className="flex flex-col space-y-6 lg:space-y-9 w-full max-w-[400px] lg:max-w-[526px] lg:h-auto max-h-[200px] ">
                    <div className="flex flex-col space-y-2 pt-[3.25rem] lg:pt-[4.25rem] lg:pt-0 text-center lg:text-left font-semibold">
                        <span className="text-[2rem] leading-[2.75rem] lg:text-[3.625rem] lg:leading-[5rem]">{t('common:slogan_first')}</span>
                        <span className="leading-[3.75rem] text-gradient text-[3rem] lg:text-[4.875rem] lg:leading-[6rem]">{t('common:slogan_second')}</span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start space-x-4 text-sm font-semibold">
                        <Button
                            onClick={handleClickBuyCover}
                            className=" w-max h-12 text-base lg:text-xl lg:h-full whitespace-nowrap !rounded-xl px-9 py-4 lg:px-[3rem] leading-6"
                        >
                            {t('home:landing:buy_covered')}
                        </Button>
                    </div>
                </div>
                {/* <div className="max-w-[848px] 3xl:max-w-[75rem] w-full flex justify-end"> */}
                <div className="position-relative pb-0 w-full flex justify-end ">
                    {/* max-w-[250px] max-h-[294px] md:max-h-[400px] sm:max-w-[400px] md:max-w-[450px] md:max-h-[350px] lg:max-w-[848px] lg:max-h-[643px]  3xl:max-w-[75rem] */}
                    <img
                        src={`/images/screens/landing-page/bg_home${isMobile ? '_mobile' : ''}.png`}
                        className="m-auto lg:mx-auto max-w-full lg:w-full max-h-[250px] sm:max-h-[294px] md:max-h-[400px] lg:max-h-[643px]"
                    />
                </div>
            </div>
        </Background>
    )
}

const Background = styled.section.attrs<any>({
    className: 'px-4 lg:px-20 h-full h-screen pb-[160px]',
    // className: 'px-4 pt-[4.25rem] pb-20',
})<any>`
    background-image: ${({ isMobile }) => `url(${`/images/screens/landing-page/background_nested.png`})`};
    background-position: bottom;
    background-repeat: no-repeat;
    background-size: cover;
    height: calc(100vh - 68px);

`

export default SloganLanding
