// @flow
import { Disclosure, Transition } from '@headlessui/react'
import { useTranslation } from 'next-i18next'
import * as React from 'react'
import styled from 'styled-components'
import { DownArrow } from 'components/common/Svg/SvgIcon'
import colors from 'styles/colors'

// type Props = {}

const ContentDisclosure = ({ content, link = '', href = '' }: { content: string; link?: string; href?: string }) => (
    <Transition
        enter="transition duration-20 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
    >
        <Disclosure.Panel static className="leading-6 px-4 pt-4 pb-2 text-sm lg:text-base text-left text-gray-500 font-normal">
            {content}{' '}
            {link && (
                <a href={href} target="_blank" className="text-red underline border-bottom-red">
                    {link}
                </a>
            )}
        </Disclosure.Panel>
    </Transition>
)

const path: Partial<any> = {
    vi: {
        checkContract: 'bo-huong-dan/huong-dan-kiem-tra-thong-tin-hdbh',
        glossary: 'he-thong-thuat-ngu',
        sign: 'bo-huong-dan/huong-dan-ky-quy-hdbh',
    },
    en: {
        checkContract: 'tutorial/how-to-check-insurance-contract-information',
        glossary: 'glossary-system',
        sign: 'tutorial/how-to-margin-nami-insurance',
    },
}

const FaqLanding = () => {
    const {
        t,
        i18n: { language },
    } = useTranslation()

    const basePathLink = language === 'en' ? 'https://quocdat.gitbook.io/whitepaper-insurance-en/' : 'https://quocdat.gitbook.io/whitepaper-insurance/'

    const faq_contents = [
        {
            question: t('home:landing:faq_type_asset_q'),
            ans: t('home:landing:faq_type_asset_a'),
            link: t('home:landing:faq_type_asset_link') || '',
            href: `${basePathLink}${path?.[language].sign}`,
        },
        {
            question: t('home:landing:faq_claim_q'),
            ans: t('home:landing:faq_claim_a'),
            // link: t('home:landing:faq_type_asset_link') || '',
        },
        {
            question: t('home:landing:faq_period_q'),
            ans: t('home:landing:faq_period_a'),
        },
        {
            question: t('home:landing:faq_claim_when_q'),
            ans: t('home:landing:faq_claim_when_a'),
            link: t('home:landing:faq_claim_when_link') || '',
            href: `${basePathLink}${path[language].glossary}`,
        },
        {
            question: t('home:landing:faq_claim_how_q'),
            ans: t('home:landing:faq_claim_how_a'),
            link: t('home:landing:faq_claim_how_link') || '',
            href: `${basePathLink}${path[language].checkContract}`,
        },
    ]
    return (
        <Background id={'faq-section'}>
            <div className="whitespace-pre-line max-w-screen-insurance 4xl:max-w-screen-3xl m-auto text-center flex flex-col justify-center items-center">
                <div className="text-2xl sm:text-5xl leading-8 font-semibold mb-5">{t('home:landing:faq_title')}</div>
                {faq_contents.map(({ question, ans, link, href }, index) => (
                    <div key={question}>
                        <div className="h-[1px] w-full bg-divider" />
                        <div key={question} className="mx-auto min-w-[20rem] lg:min-w-[48rem] w-full max-w-md rounded-2xl px-6 py-4 lg:p-[1.5rem] ">
                            <Disclosure>
                                {({ open }) => (
                                    <>
                                        <Disclosure.Button as={"div"} className=" active:outline-transparent active:bg-transparent focus:bg-none touch-none active:outline-none text-left flex w-full justify-between items-center rounded-lg bg-purple-100 px-4 text-left font-medium text-purple-900 focus:outline-none">
                                            <span className={'font-semibold text-sm lg:text-base'}>{question}</span>
                                            <div>
                                                <DownArrow className={`${!open ? 'rotate-180 transform' : ''}`} color={colors.txtPrimary} size={20} />
                                            </div>
                                        </Disclosure.Button>
                                        <ContentDisclosure content={ans} link={link || ''} href={href} />
                                    </>
                                )}
                            </Disclosure>
                        </div>
                    </div>
                ))}
            </div>
        </Background>
    )
}

export default FaqLanding

const Background = styled.section.attrs({
    className: 'pt-12 banner-landing px-4 lg:px-20 min-h-[350px] flex flex-col justify-end mt-[7.5rem]',
})<any>`
    background-image: ${({ isMobile }) => `url(${`/images/screens/landing-page/bg_faq.png`})`};
    background-position: top;
    background-repeat: no-repeat;
    background-size: cover;
`
