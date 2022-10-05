import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import Button from 'components/common/Button/Button'
import useWindowSize from 'hooks/useWindowSize'

const SloganLanding = () => {
    const {
        t,
        i18n: { language },
    } = useTranslation()
    const router = useRouter()

    const { width, height } = useWindowSize()

    const handleClickBuyCover = () => router.push('/buy-covered')
    const isHD = useMemo(() => height && width && width >= 1024 && height <= 600, [width, height])

    return (
        <Background>
            <div
                className={
                    'flex flex-col insurance:flex-none max-w-screen-insurance 4xl:max-w-screen-3xl h-full justify-between mx-auto relative pb-[100px] tiny:pb-[140px] lg:pb-[180px] '
                }
            >
                {/*  */}
                <div
                    className={`flex homeNav:flex-none insurance:absolute flex-col w-full homeNav:justify-between homeNav:items-start
                items-center ${
                    isHD ? 'homeNav:pt-[10px]' : 'homeNav:pt-[80px]'
                }  pt-[20px] mobileMedium:pt-[50px] mobileMiddle:pt-[80px] sm:pt-[80px] laptopMedium:pt-[194px]  xl:max-w-[600px] max-h-[200px] tiny:gap-[2rem] homeNav:gap-[3rem] gap-[0.5rem] homeNav:h-full`}
                >
                    <div className="flex flex-col pt-0 font-semibold text-center homeNav:text-left">
                        <span
                            className={`text-[2rem] leading-[2.75rem] homeNav:text-[3.625rem] font-semibold homeNav:text-left text-center homeNav:leading-[5rem]`}
                        >
                            {t('common:slogan_first')}
                        </span>
                        <span
                            className={`${
                                language === 'vi' ? 'text-[2.2rem] mobileLarge:text-[3rem]' : 'text-[3rem]'
                            } font-semibold leading-[3.625rem] text-red text-[3rem] homeNav:text-[4.875rem] homeNav:leading-[5rem]`}
                        >
                            {t('common:slogan_second')}
                        </span>
                    </div>
                    <div className="flex items-center justify-center space-x-4 text-sm font-semibold insurance:justify-start">
                        <Button
                            onClick={handleClickBuyCover}
                            className=" w-max h-12 text-base insurance:text-xl insurance:h-full whitespace-nowrap !rounded-xl px-9 py-4 insurance:px-[3rem] leading-6"
                        >
                            {t('home:landing:buy_covered')}
                        </Button>
                    </div>
                </div>
                <img
                    alt={'slogan'}
                    srcSet={`/images/screens/landing-page/bg_home.png 2x`}
                    className={`
                     flex homeNav:flex-none
                     h-full
                     w-full homeNav:absolute w-auto bottom-0 mx-auto right-0 float-right homeNav:mb-[180px]
                     laptopMedium:pt-[190px]
                     4xl:max-h-[800px]
                     ${isHD ? `homeNav:max-h-[290px]` : 'homeNav:max-h-[450px]'}
                     laptopMedium:max-h-[663px]
                     mb:max-h-[400px]
                     tablet:max-h-[400px]
                     tiny:max-h-[240px]
                     mobileMiddle:max-h-[306px]
                     max-h-[180px]
                     mb-0
                    `}
                />
            </div>
        </Background>
    )
}

const Background = styled.section.attrs<any>({
    className: 'px-4 mb:px-10 insurance:px-20 h-auto insurance:overflow-hidden overflow-visible h-screen',
    // className: 'px-4 pt-[4.25rem] pb-20',
})<any>`
    background-image: ${({ isMobile }) => `url(${`/images/screens/landing-page/background_nested.png`})`};
    background-position: bottom;
    background-repeat: no-repeat;
    background-size: cover;
    height: calc(100vh - 68px);
`

export default SloganLanding
