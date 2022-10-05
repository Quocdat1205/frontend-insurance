import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import React from 'react'
import styled from 'styled-components'
import { scrollToElement } from 'utils/utils';

interface Footer {
    sponsor: boolean
}

const WHITE_PAPER = 'whitepaper'
const FAQ = 'faq'
const TERM = 'term'

const Footer = ({ sponsor = true }) => {
    const {
        t,
        i18n: { language },
    } = useTranslation()

    const router = useRouter()

    const LINKS: any = {
        [WHITE_PAPER]: {
            vi: 'https://quocdat.gitbook.io/whitepaper-insurance/',
            en: 'https://quocdat.gitbook.io/whitepaper-insurance-en/',
        },
        [TERM]: {
            en: 'https://quocdat.gitbook.io/whitepaper-insurance-en/terms/terms-of-service/',
            vi: 'https://quocdat.gitbook.io/whitepaper-insurance/chinh-sach-dich-vu/dieu-khoan-su-dung',
        },
    }

    const handleClickItem = (type: string) => window.open(LINKS[type][language])
    const handleCLickFAQ = () =>{
        scrollToElement('faq-section')
    }
    const handleClickBuyCover = () => router.push('/buy-covered')

    return (
        // <footer className="footer pt-8 sm:pt-[4.125rem] mb-[4rem]">
        <footer className="footer pt-8 sm:pt-[4.125rem]">
            {sponsor && (
                <BgSponsor>
                    <div className="text-txtPrimary font-bold text-sm sm:text-xl">{t('home:landing:products_sponsored_by')}</div>
                    <div className="max-w-[230px]">
                        <img src="/images/screens/landing-page/ic_logo_nami_foundation_black.png" />
                    </div>
                </BgSponsor>
            )}
            <div className="bg-white-2 px-10 py-12 ">
                <div className="max-w-screen-layout 4xl:max-w-screen-4xl m-auto">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                        <div className="w-[121px]">
                            <img src="/images/ic_logo.png" />
                        </div>
                        <div className="flex flex-row space-x-8 mt-12 lg:mt-0 text-sm sm:text-base">
                            <div className="flex flex-col space-y-4 sm:space-y-2">
                                <div className="font-semibold">{t('home:landing:features')}</div>
                                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 text-txtSecondary">
                                    <div className={'cursor-pointer'} onClick={handleClickBuyCover}>{t('home:landing:buy_covered')}</div>
                                    {/* <div>{t('home:landing:buy_nain')}</div> */}
                                </div>
                            </div>
                            <div className="flex flex-col space-y-4 sm:space-y-2">
                                <div className="font-semibold">{t('home:landing:document')}</div>
                                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 text-txtSecondary">
                                    <div className={'cursor-pointer'} onClick={() => handleClickItem(WHITE_PAPER)}>
                                        {t('home:landing:white_paper')}
                                    </div>
                                    <div className={'cursor-pointer'} onClick={handleCLickFAQ}>
                                        {t('home:landing:faq')}
                                    </div>
                                    <div className={'cursor-pointer'} onClick={() => handleClickItem(TERM)}>
                                        {t('home:landing:terms_of_service')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="my-6 h-[1px] bg-divider " />
                    <div className="text-xs text-txtSecondary">Copyright © 2021 UI8 LLC. All rights reserved</div>
                </div>
            </div>
        </footer>
    )
}

const BgSponsor = styled.div.attrs({
    className: 'flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 space-x-8 justify-center bg-opacity-[0.4] sm:pb-16 pb-6',
})`
    //background-color: #ffe4e9;
    /* opacity: 0.4; */
    /* background: linear-gradient(
        88.49deg,
        rgba(254, 235, 238, 0.4) -1.12%,
        rgba(255, 121, 135, 0.4) 16.3%,
        rgba(255, 55, 68, 0.4) 50.07%,
        rgba(255, 121, 135, 0.4) 82.97%,
        rgba(254, 235, 238, 0.4) 101.26%
    ); */
`

export default Footer
