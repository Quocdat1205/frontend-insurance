import AOS from 'aos'
import classnames from 'classnames'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { InfoCircle } from 'components/common/Svg/SvgIcon'
import Tooltip from 'components/common/Tooltip/Tooltip'
import useWindowSize from 'hooks/useWindowSize'
import { RootStore, useAppSelector } from 'redux/store'
import { API_GET_INFO_GENERAL } from 'services/apis'
import fetchApi from 'services/fetch-api'
import 'aos/dist/aos.css'
import colors from 'styles/colors'
import { DURATION_AOS } from 'utils/constants'
import { formatCurrency, getUnit } from 'utils/utils'

const BannerLanding = () => {
    const { t } = useTranslation()
    const { width } = useWindowSize()
    const isMobile = width && width < 640
    const [general, setGeneral] = useState<any>(null)
    const unitConfig = useAppSelector((state: RootStore) => getUnit(state, 'USDT'))

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
            {
                title: t('home:landing:total_q_covered'),
                // value: general?.q_coverd,
                value: 119059000,
                decimal: unitConfig?.assetDigit ?? 2,
                tooltip: 'common:terminology:q_covered',
                // prefix: '$',
            },
            {
                title: t('home:landing:total_margin'),
                // value: general?.q_margin,
                value: 79000,
                // value: 29,
                decimal: unitConfig?.assetDigit ?? 2,
                // prefix: '$',
                suffix: '',
                tooltip: 'common:terminology:margin',
            },
            {
                title: t('home:landing:users'),
                // value: general?.total_user ?? 0,
                value: 29,
                decimal: 0,
                prefix: '',
                suffix: '',
            },
            {
                title: t('home:landing:avg_r_claim'),
                // value: general?.r_claim ?? 0,
                value: 139,
                suffix: '%',
                decimal: 2,
                prefix: '',
                tooltip: 'common:terminology:r_claim',
            },
        ],
        [general, unitConfig],
    )

    useEffect(() => {
        AOS.init({
            once: true,
            offset: 10,
        })
        AOS.refresh()
    }, [])

    const QClaimValue: string | number = formatCurrency(general?.q_claim, 4)

    const classNameTitle = 'text-red text-[2rem] homeNav:text-[2.25rem] leading-[2.75rem] font-medium homeNav:font-semibold'
    return (
        <Background isMobile={isMobile}>
            <div className="flex flex-col w-full h-full mx-auto mb-0 homeNav:text-center max-w-screen-insurance rounded-2xl 4xl:max-w-screen-3xl h-100 ">
                <Grid>
                    <Tooltip className="max-w-[200px]" id={'p_claim'} placement="bottom" />
                    <Tooltip className="max-w-[200px]" id={'common:terminology:q_covered'} placement="bottom" />
                    <Tooltip className="max-w-[200px]" id={'common:terminology:margin'} placement="bottom" />
                    <Tooltip className="max-w-[200px]" id={'common:terminology:r_claim'} placement="bottom" />

                    <Item key={'index'} className="flex col-span-4 bg-white lg:col-span-1">
                        <div className="flex flex-col space-y-2 ">
                            <p className={classNameTitle} data-aos="fade-up" data-aos-delay={0}>
                                {/* ${formatCurrency(general?.q_claim, unitConfig?.assetDigit ?? 2)} */}
                                129,00M
                            </p>

                            <div className={'flex  flex-row justify-center items-center text-txtSecondary text-xs homeNav:text-base'}>
                                <span className={'homeNav:text-base text-xs font-normal'}>{t('home:landing:total_q_claim')}</span>
                                <div className={'ml-[0.375rem]'} data-tip={t('common:terminology:p_claim')} data-for={`p_claim`}>
                                    <InfoCircle size={14} color={colors.txtSecondary} />
                                    <Tooltip className="max-w-[200px]" id={'p_claim'} placement="bottom" />
                                </div>
                            </div>
                        </div>
                    </Item>
                    {list.map((item: any, index: number) => (
                        <Item key={index} className="space-y-2 bg-white">
                            <p className={classNameTitle} data-aos="fade-up" data-aos-delay={DURATION_AOS * index}>
                                {item?.prefix}
                                {formatCurrency(item.value, item.decimal)}
                                {item?.suffix}
                            </p>
                            <div className={'flex flex-row justify-center items-center text-txtSecondary text-xs homeNav:text-base'}>
                                <span className={'homeNav:text-base text-xs font-normal'}>{item.title}</span>
                                {item.tooltip && (
                                    <div className={'ml-[0.375rem] relative'} data-tip={t(item.tooltip)} data-for={item.tooltip}>
                                        <InfoCircle className={''} size={14} color={colors.txtSecondary} />
                                        {/* <Tooltip className="!max-w-[200px] !absolute !right-0 !top-0" id={item.tooltip} placement="top" /> */}
                                    </div>
                                )}
                            </div>
                        </Item>
                    ))}
                </Grid>
            </div>
        </Background>
    )
}

const Item = styled.div.attrs<any>({
    className: classnames(
        'lg:pt-[2.875rem] lg:pb-[3.625rem] py-[2.25rem] last:pb-6 first:mt-0 w-full ',
        'text-center flex flex-col items-center space-y-[2px] sm:even:mb-0 last:m-0 h-100px lg:h-[180px] tiny:h-[140px]',
    ),
})`
    backdrop-filter: blur(5px);
    border-bottom: 0;
`
const Background = styled.section.attrs({
    className: 'lg:px-6 h-auto lg:h-[180px] flex flex-col justify-end mt-0 -mt-[100px] tiny:-mt-[140px] homeNav:-mt-[180px]',
})<any>`
    border-bottom: 0;
`

const Grid = styled.div.attrs({
    className: 'grid bg-red grid-rows-3 lg:grid-rows-1 grid-cols-2 lg:grid-rows-1 lg:grid-cols-5 grid-flow-col homeNav:px-[48px] insurance:px-[68px] h-full',
})<any>`
    box-shadow: 0px -3px 5px rgba(235, 43, 62, 0.15);
    border-radius: 16px 16px 0px 0px;

    background: #ffffff;
    overflow: hidden;
`

export default BannerLanding
