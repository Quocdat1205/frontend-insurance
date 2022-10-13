import AOS from 'aos'
import classnames from 'classnames'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import Button from 'components/common/Button/Button'
import { InfoCircle } from 'components/common/Svg/SvgIcon'
import Tooltip from 'components/common/Tooltip/Tooltip'
import useWindowSize from 'hooks/useWindowSize'
import { RootStore, useAppSelector } from 'redux/store'
import { API_GET_INFO_GENERAL } from 'services/apis'
import fetchApi from 'services/fetch-api'
import colors from 'styles/colors'
import { DURATION_AOS } from 'utils/constants'
import { formatCurrency, getUnit } from 'utils/utils'

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
                    'flex flex-col homeNav:relative min-h-[calc(100vh-68px-140px)] homeNav:min-h-[calc(100vh-68px-180px)] homeNav:h-[calc(100vh-68px)] mx-auto homeNav:flex-none max-w-screen-insurance 4xl:max-w-screen-3xl overflow-visible'
                }
            >
                <div
                    className={
                        'flex flex-col iPadPro:flex-col homeNav:mb-[180px] homeNav:flex-row lg:w-auto justify-between homeNav:justify-start grow w-full h-full min-h-[inherit]'
                    }
                >
                    <div
                        className={`flex flex-col lg:relative text-center  mobileMedium:pt-[50px] pt-[10px] sm:pt-[80px] 
                        homeNav:pt-[10%] homeNav:text-left  homeNav:gap-[3rem] gap-[0.5rem]`}
                    >
                        <div className="flex flex-col pt-0 font-semibold text-center homeNav:text-left">
                            <span
                                data-aos="fade-up"
                                data-aos-delay="400"
                                className={`text-[2rem] leading-[2.75rem] homeNav:text-[3.625rem] font-semibold homeNav:text-left text-center homeNav:leading-[5rem]`}
                            >
                                {t('common:slogan_first')}
                            </span>
                            <span
                                data-aos="zoom-in"
                                data-aos-easing="linear"
                                data-aos-delay="1000"
                                className={`${
                                    language === 'vi' ? 'text-[2.2rem] mobileLarge:text-[3rem]' : 'text-[3rem]'
                                } font-semibold leading-[3.625rem] text-red text-[3rem] homeNav:text-[4.875rem] homeNav:leading-[5rem]`}
                            >
                                {t('common:slogan_second')}
                            </span>
                        </div>

                        <div className="flex items-center justify-center space-x-4 text-sm font-semibold homeNav:justify-start">
                            <Button
                                onClick={handleClickBuyCover}
                                className=" w-max h-12 text-base homeNav:text-xl homeNav:h-full whitespace-nowrap !rounded-xl px-9 py-4 homeNav:px-[3rem] leading-6"
                            >
                                {t('home:landing:buy_covered')}
                            </Button>
                        </div>
                        {/* <div className="flex grow bg-red">
                            <img
                                alt={'slogan'}
                                srcSet={`/images/screens/landing-page/bg_home.png 2x`}
                                className={`flex lg:flex-none lg:absolute lg:bottom-0 lg:left-full   h-full max-h-[663px] w-full`}
                            />
                        </div> */}
                    </div>
                    <div className="flex items-end lg:relative grow">
                        <img
                            alt={'slogan'}
                            srcSet={`/images/screens/landing-page/bg_home.png 2x`}
                            className={`flex lg:flex-none lg:absolute lg:bottom-0 lg:left-auto  h-full max-h-[663px] w-full`}
                        />
                    </div>
                </div>
                <div className={'lg:mt-0 lg:absolute h-auto lg:h-[180px] w-auto bottom-0 lg:w-full'}>
                    <BannerLanding />
                </div>
            </div>
        </Background>
    )
}

const Background = styled.section.attrs<any>({
    className: 'mb:px-10 insurance:px-20 overflow-visible h-auto',
    // className: 'px-4 pt-[4.25rem] pb-20',
})<any>`
    background-image: ${({ isMobile }) => `url(${`/images/screens/landing-page/background_nested.png`})`};
    background-position: bottom;
    background-repeat: no-repeat;
    background-size: cover;
    /* min-height: calc(100vh - 68px); */
`

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
        <Background1 isMobile={isMobile}>
            <div className="flex flex-col w-full h-full mx-auto mb-0 homeNav:text-center max-w-screen-insurance rounded-2xl 4xl:max-w-screen-3xl h-100 ">
                <Grid>
                    <Tooltip className="max-w-[200px]" id={'p_claim'} placement="bottom" />
                    <Tooltip className="max-w-[200px]" id={'common:terminology:q_covered'} placement="bottom" />
                    <Tooltip className="max-w-[200px]" id={'common:terminology:margin'} placement="bottom" />
                    <Tooltip className="max-w-[200px]" id={'common:terminology:r_claim'} placement="bottom" />

                    <Item key={'index'} className="flex col-span-4 bg-white lg:col-span-1">
                        <div className="flex flex-col space-y-2 ">
                            <p className={classNameTitle} data-aos="fade-up" data-aos-delay={DURATION_AOS / 2}>
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
                            <p className={classNameTitle} data-aos="fade-up" data-aos-delay={DURATION_AOS * (index + 1)}>
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
        </Background1>
    )
}

const Item = styled.div.attrs<any>({
    className: classnames(
        'lg:pt-[2.875rem] lg:pb-[3.625rem] py-[2.25rem] last:pb-6 first:mt-0 w-full ',
        'text-center flex flex-col items-center space-y-[2px] sm:even:mb-0 last:m-0 h-140px lg:h-[180px] tiny:h-[140px]',
    ),
})`
    backdrop-filter: blur(5px);
    border-bottom: 0;
`
const Background1 = styled.section.attrs({
    className: 'h-auto lg:h-[180px]',
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

export default SloganLanding
