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
                title: t('home:landing:total_margin'),
                // value: general?.q_margin,
                value: 79000,
                // value: 29,
                decimal: unitConfig?.assetDigit ?? 2,
                prefix: '$',
                suffix: '',
                tooltip: 'common:terminology:margin',
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

    return (
        <Background isMobile={isMobile}>
            <div className="flex flex-col w-full mx-auto mb-0 lg:text-center max-w-screen-insurance rounded-2xl 4xl:max-w-screen-3xl ">
                <Grid>
                    <Tooltip className="max-w-[200px]" id={'p_claim'} placement="bottom" />
                    <Tooltip className="max-w-[200px]" id={'common:terminology:q_covered'} placement="bottom" />
                    <Tooltip className="max-w-[200px]" id={'common:terminology:margin'} placement="bottom" />
                    <Tooltip className="max-w-[200px]" id={'common:terminology:r_claim'} placement="bottom" />

                    <Item key={'index'} className="flex bg-white col-span-4 lg:col-span-1">
                        <div className="flex flex-col space-y-2 ">
                            <div
                                className="text-red text-[2rem] lg:text-4xl leading-[3.25rem] font-medium lg:leading-10 lg:font-semibold"
                                data-aos="fade-up"
                                data-aos-delay={0}
                            >
                                {/* ${formatCurrency(general?.q_claim, unitConfig?.assetDigit ?? 2)} */}
                                $129,000
                            </div>

                            <div className={'flex flex-row justify-center items-center text-txtSecondary text-sm'}>
                                <span className={''}>P-Claim</span>
                                <div className={'ml-[0.375rem]'} data-tip={t('common:terminology:p_claim')} data-for={`p_claim`}>
                                    <InfoCircle size={14} color={colors.txtSecondary} />
                                    <Tooltip className="max-w-[200px]" id={'p_claim'} placement="bottom" />
                                </div>
                            </div>
                        </div>
                    </Item>
                    {list.map((item: any, index: number) => (
                        <Item key={index} className="bg-white">
                            <div className="font-medium lg:text-4xl text-red text-[2rem]" data-aos="fade-up" data-aos-delay={DURATION_AOS * index}>
                                {item?.prefix}
                                {formatCurrency(item.value, item.decimal)}
                                {item?.suffix}
                            </div>
                            <div className="text-sm text-txtSecondary lg:text-base flex items-center">
                                {item.title}
                                {item.tooltip && (
                                    <div className={'ml-[0.375rem] relative'} data-tip={t(item.tooltip)} data-for={item.tooltip}>
                                        <InfoCircle className={''} size={14} color={colors.txtSecondary} />
                                        <Tooltip className="!max-w-[200px] !absolute !right-0 !top-0" id={item.tooltip} placement="top" />
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
        'text-center flex flex-col items-center space-y-[2px] sm:even:mb-0 last:m-0 h-[140px] lg:h-full lg:h-[180px]',
    ),
})`
    backdrop-filter: blur(5px);
    border-bottom: 0;
`
const Background = styled.section.attrs({
    className: 'lg:px-6 h-auto lg:h-[180px] flex flex-col justify-end mt-0 -mt-[140px] lg:-mt-[180px]',
})<any>`
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
