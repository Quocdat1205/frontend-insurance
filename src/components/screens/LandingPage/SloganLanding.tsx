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
            <div className={' max-w-screen-insurance 4xl:max-w-screen-3xl mx-auto relative h-screen '}>
                {/*  */}
                <div className="relative flex flex-col space-y-6 lg:space-y-9 w-full xl:justify-between lg:items-start
                items-center pt-[48px] lg:pt-[68px] 2xl:pt-[200px] xl:max-w-[600px] max-h-[200px] lg:h-full ">
                    <div className="flex flex-col space-y-2 pt-0 lg:pt-[4.25rem] lg:pt-0  text-center lg:text-left font-semibold">
                        <span className="text-[2rem] leading-[2.75rem] lg:text-[3.625rem] lg:text-left text-center lg:leading-[5rem]">
                            {t('common:slogan_first')}
                        </span>
                        <span className="leading-[3.75rem] text-gradient text-[3rem] lg:text-[4.875rem] lg:leading-[6rem]">{t('common:slogan_second')}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-4 text-sm font-semibold lg:justify-start">
                        <Button
                            onClick={handleClickBuyCover}
                            className=" w-max h-12 text-base lg:text-xl lg:h-full whitespace-nowrap !rounded-xl px-9 py-4 lg:px-[3rem] leading-6"
                        >
                            {t('home:landing:buy_covered')}
                        </Button>
                    </div>
                </div>
                {/*  */}
                <img
                    srcSet={`/images/screens/landing-page/bg_home.png 2x`}
                    className="w-full sm:w-auto m-auto absolute h-full bottom-[196px] right-0 mx-auto  lg:left-auto  left-0 lg:bottom-[15.75rem]
                     max-h-[220px] tiny:max-h-[240px] lg:max-h-[406px] xl:max-h-[463px] 2xl:max-h-[563px] homeNav:max-h-[406px]"
                />
            </div>
        </Background>
    )
}

const Background = styled.section.attrs<any>({
    className: 'px-4 lg:px-20 h-auto lg:overflow-hidden overflow-visible h-screen',
    // className: 'px-4 pt-[4.25rem] pb-20',
})<any>`
    background-image: ${({ isMobile }) => `url(${`/images/screens/landing-page/background_nested.png`})`};
    background-position: bottom;
    background-repeat: no-repeat;
    background-size: cover;
    height: calc(100vh - 68px);
`

export default SloganLanding
