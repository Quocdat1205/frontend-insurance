import AOS from 'aos';
import classnames from 'classnames'
import useWindowSize from 'hooks/useWindowSize'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useMemo, useState } from 'react'
import fetchApi from 'services/fetch-api'
import styled from 'styled-components'
import { API_GET_INFO_GENERAL } from 'services/apis'
import { formatNumber } from 'utils/utils'
import "aos/dist/aos.css";
import {DURATION_AOS} from "utils/constants";

const BannerLanding = () => {
    const { t } = useTranslation()
    const { width } = useWindowSize()
    const isMobile = width && width < 640
    const [general, setGeneral] = useState<any>(null)

    useEffect(() => {
        getInfoGeneral()
    }, [])

    const getInfoGeneral = async () => {
        try {
            const { data } = await fetchApi({
                url: API_GET_INFO_GENERAL,
                options: { method: 'GET' },
            })
            if (data) setGeneral(data)
        } catch (e) {
            console.log(e)
        } finally {
        }
    }

    const list = useMemo(() => {
        return [
            { title: t('home:landing:total_q_covered'), value: general?.q_coverd ?? 0, decimal: 4 },
            { title: t('home:landing:total_margin'), value: general?.q_margin ?? 0, decimal: 4 },
            { title: t('home:landing:users'), value: general?.total_user ?? 0, decimal: 4 },
            { title: t('home:landing:avg_r_claim'), value: general?.r_claim ?? 0, suffix: '%', decimal: 2 },
        ]
    }, [general])

    useEffect(() => {
        AOS.init({
            once: true,
            offset: 10
        });
        AOS.refresh();
    }, []);

    return (
        <Background isMobile={isMobile}>
            <div className="max-w-screen-insurance m-auto text-center flex flex-col space-y-12 sm:space-y-6">
                <div className="flex flex-col space-y-2">
                    <div className="leading-5 sm:leading-6">{t('home:landing:total_q_claim')}</div>
                    <div className="text-red text-[2.5rem] leading-[3.5rem] sm:leading-10 font-bold sm:font-semibold" data-aos="fade-up" data-aos-delay={DURATION_AOS}>{formatNumber(general?.q_claim, 4)}</div>
                </div>
                <div className="grid grid-rows-4 sm:grid-rows-2 sm:grid-cols-2 lg:grid-rows-1 lg:grid-cols-4 grid-flow-col sm:gap-x-6 lg:gap-6">
                    {list.map((item: any, index: number) => (
                        <Item key={index} className="border-gradient-red">
                            <div className="text-txtSecondary text-sm sm:text-base">{item.title}</div>
                            <div className="font-semibold text-2xl" data-aos="fade-up" data-aos-delay={DURATION_AOS * index}>
                                {formatNumber(item.value, item.decimal)}
                                {item.suffix}
                            </div>
                        </Item>
                    ))}
                </div>
            </div>
        </Background>
    )
}

const Item = styled.div.attrs<any>({
    className: classnames(
        'shadow-banner pt-6 pb-9 last:pb-6 -mb-3 lg:m-0 first:mt-0 sm:!p-4 w-full ',
        'text-center flex flex-col lg:items-start items-center space-y-2 sm:even:mb-0 last:m-0',
    ),
})`
    backdrop-filter: blur(5px);
    border-radius: 12px 12px 0px 0px;
    border-bottom: 0;
`
const Background = styled.section.attrs({
    className: 'pt-12 banner-landing px-4 lg:px-20',
})<any>`
    background-image: ${({ isMobile }) => `url(${`/images/screens/landing-page/bg_banner${isMobile ? '_mobile' : ''}.png`})`};
    background-position: top;
    background-repeat: no-repeat;
    background-size: cover;
`

export default BannerLanding
