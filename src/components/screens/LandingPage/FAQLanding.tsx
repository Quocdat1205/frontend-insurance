// @flow
import { Disclosure } from '@headlessui/react'
import { useTranslation } from 'next-i18next'
import * as React from 'react'
import styled from 'styled-components'
import { DownArrow } from 'components/common/Svg/SvgIcon'
import colors from 'styles/colors'

// type Props = {}

const ContentDisclosure = ({ content, link = '' }: { content: string; link?: string }) => (
    <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm lg:text-base text-left text-gray-500 font-normal">
        {content}{' '}
        {link && (
            <a href={link} target="_blank" className="text-red border-bottom-red">
                {link}
            </a>
        )}
    </Disclosure.Panel>
)

const FaqLanding = () => {
    const {
        t,
        i18n: { language },
    } = useTranslation()
    // const
    const faq_contents = [
        {
            question: t('home:landing:faq_type_asset_q'),
            ans: t('home:landing:faq_type_asset_a'),
            link: t('home:landing:faq_type_asset_link') || '',
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
        },
        {
            question: t('home:landing:faq_claim_how_q'),
            ans: t('home:landing:faq_claim_how_a'),
            link: t('home:landing:faq_claim_how_link') || '',
        },
    ]
    return (
        <section className={'pt-[7.5rem]'}>
            <Background>
                <div className=" whitespace-pre-line max-w-screen-insurance 4xl:max-w-screen-3xl m-auto text-center flex flex-col justify-center items-center">
                    {/* pt-20 sm:pt-[7.5rem]"> */}
                    <div className="text-2xl sm:text-5xl leading-8 font-semibold mb-5">{t('home:landing:faq_title')}</div>
                    {faq_contents.map(({ question, ans, link }, index) => (
                        <>
                            <div className="h-[1px] w-full bg-divider"/>
                            <div key={question} className="mx-auto min-w-[20rem] lg:min-w-[48rem] w-full max-w-md rounded-2xl p-[1.5rem] ">
                                <Disclosure>
                                    {({ open }) => (
                                        <>
                                            <Disclosure.Button className="text-left bg-opacity-0 flex w-full justify-between items-center rounded-lg bg-purple-100 px-4 text-left font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                                <span className={'font-semibold text-sm lg:text-base'}>{question}</span>
                                                <DownArrow
                                                    className={`${open ? 'rotate-180 transform' : ''}`}
                                                    color={colors.txtPrimary}
                                                    size={20}
                                                />
                                            </Disclosure.Button>
                                            <ContentDisclosure content={ans} link={link || ''} />
                                        </>
                                    )}
                                </Disclosure>
                            </div>
                        </>
                    ))}
                </div>
            </Background>
        </section>
    )
}

export default FaqLanding

const Background = styled.section.attrs({
    className: 'pt-12 banner-landing px-4 lg:px-20 min-h-[350px] flex flex-col justify-end',
})<any>`
    background-image: ${({ isMobile }) => `url(${`/images/screens/landing-page/bg_faq.png`})`};
    background-position: top;
    background-repeat: no-repeat;
    background-size: cover;
`
