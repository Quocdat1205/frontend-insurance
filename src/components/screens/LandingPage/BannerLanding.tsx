import AOS from 'aos'
import classnames from 'classnames'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import useWindowSize from 'hooks/useWindowSize'
import { API_GET_INFO_GENERAL } from 'services/apis'
import fetchApi from 'services/fetch-api'
import 'aos/dist/aos.css'
import { DURATION_AOS } from 'utils/constants'
import { formatCurrency, formatNumber } from 'utils/utils'

const BannerLanding = () => {
    const { t } = useTranslation()
    const { width } = useWindowSize()
    const isMobile = width && width < 640
    const [general, setGeneral] = useState<any>(null)

    useEffect(() => {
        getInfoGeneral().catch((r) => {
            console.log('error')
        })
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
        }
    }

    const list = useMemo(
        () => [
            // { title: t('home:landing:total_q_claim'), value: general?.q_claim ?? 0, decimal: 4 },
            { title: t('home:landing:total_q_covered'), value: formatCurrency(+formatNumber(general?.q_coverd ?? 0), 2), decimal: 2 },
            { title: t('home:landing:users'), value: general?.total_user ?? 0, decimal: 2, prefix: '', suffix: '' },
            { title: t('home:landing:total_margin'), value: formatCurrency(general?.q_margin || 0, 2), decimal: 2, prefix: '$', suffix: '' },
            { title: t('home:landing:avg_r_claim'), value: general?.r_claim ?? 0, suffix: '%', decimal: 2, prefix: '' },
        ],
        [general],
    )

    useEffect(() => {
        AOS.init({
            once: true,
            offset: 10,
        })
        AOS.refresh()
    }, [])

    const QClaimValue: string | number = formatCurrency(general?.q_claim, 4)

    return (
        <Background isMobile={isMobile}>
            <div className="max-w-screen-insurance rounded-2xl 4xl:max-w-screen-3xl mx-auto mb-0 w-full text-center flex flex-col">
                <Grid>
                    <Item key={'index'} className="bg-white col-span-4 lg:col-span-1">
                        <div className="flex flex-col space-y-2 ">
                            <div
                                className="text-red text-[2rem] lg:text-4xl leading-[3.25rem] font-medium lg:leading-10 lg:font-semibold"
                                data-aos="fade-up"
                                data-aos-delay={0}
                            >
                                ${formatNumber(+QClaimValue, 2)}
                            </div>
                            <div className="text-txtSecondary leading-5 text-sm lg:text-base lg:leading-6">{t('home:landing:total_q_claim')}</div>
                        </div>
                    </Item>
                    {list.map((item: any, index: number) => (
                        <Item key={index} className="bg-white">
                            <div className="font-semibold md:text-4xl text-red text-2xl" data-aos="fade-up" data-aos-delay={DURATION_AOS * index}>
                                {item?.prefix}
                                {formatNumber(item.value, item.decimal)}
                                {item?.suffix}
                            </div>
                            <div className="text-txtSecondary text-sm lg:text-base">{item.title}</div>
                        </Item>
                    ))}
                </Grid>
            </div>
        </Background>
    )
}

const Item = styled.div.attrs<any>({
    className: classnames(
        'pt-6 pb-9 last:pb-6 -mb-3 lg:m-0 first:mt-0 sm:!p-x4 sm:py-12 w-full ',
        'text-center flex flex-col items-center space-y-[2px] sm:even:mb-0 last:m-0',
    ),
})`
    backdrop-filter: blur(5px);
    border-bottom: 0;
`
const Background = styled.section.attrs({
    className: ' banner-landing lg:px-6 min-h-[180px] flex flex-col justify-end mt-0 -mt-[206px] lg:-mt-[180px]',
    // className: '-pt-12 banner-landing px-4 lg:px-20 min-h-[350px] flex flex-col justify-end',
})<any>`
        // background-image: ${({ isMobile }) => `url(${`/images/screens/landing-page/bg_banner${isMobile ? '_mobile' : ''}.png`})`};
    //background-position: top;
    //background-repeat: no-repeat;
    //background-size: cover;
    //box-shadow: 0px -3px 5px rgba(235, 43, 62, 0.15);
    //border-radius: 1rem;
    border-bottom: 0;
`

const Grid = styled.div.attrs({
    className: 'grid bg-red grid-rows-3 lg:grid-rows-1 grid-cols-2 lg:grid-rows-1 lg:grid-cols-5 grid-flow-col ',
})<any>`
    box-shadow: 0px -3px 5px rgba(235, 43, 62, 0.15);
    border-radius: 16px 16px 0px 0px;

    background: #ffffff;
    overflow: hidden;
`

export default BannerLanding
