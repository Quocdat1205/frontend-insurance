import Button from 'components/common/Button/Button'
import { useTranslation } from 'next-i18next'
import React from 'react'

const SloganLanding = () => {
    const { t } = useTranslation()
    return (
        <section className="px-4 lg:px-20">
            <div className="max-w-screen-insurance 4xl:max-w-screen-3xl m-auto slider-landing flex flex-col space-y-6 sm:space-y-0 sm:flex-row items-center justify-between mt-[4.25rem] sm:mt-9 h-[calc(100vh-300px)] sm:h-auto">
                <div className="flex flex-col space-y-6 sm:space-y-9 w-max">
                    <div className="flex flex-col text-[2rem] text-center sm:text-left lg:text-[3rem] font-bold sm:font-semibold whitespace-nowrap leading-[2.625rem] sm:leading-[3.875rem] 3xl:text-[3.375rem] 3xl:leading-[5rem]">
                        <span>Đây là slogan </span>
                        <span className="text-gradient">của Nami Insurance</span>
                    </div>
                    <div className="flex items-center justify-between sm:justify-start space-x-4 text-sm font-semibold">
                        <Button className="w-full sm:w-max h-12 sm:text-base sm:h-full whitespace-nowrap !rounded-xl px-6 py-4 leading-6">
                            {t('home:landing:buy_covered')}
                        </Button>
                        <Button
                            variants="outlined"
                            className="w-full sm:w-max h-12 sm:text-base sm:h-full px-6 py-[0.875rem] leading-6 whitespace-nowrap !rounded-xl"
                        >
                            {t('home:landing:buy_nain')}
                        </Button>
                    </div>
                </div>
                <div className="max-w-[848px] 3xl:max-w-[75rem] w-full flex justify-end">
                    <img src="/images/screens/landing-page/ic_slider.png" className="sm:h-[calc(100vh-450px)] -mr-[30px]" />
                </div>
            </div>
        </section>
    )
}

export default SloganLanding
