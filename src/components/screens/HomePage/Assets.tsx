import { useTranslation } from 'next-i18next'
import React, { useMemo, useState, useEffect } from 'react'
import { Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import Button from 'components/common/Button/Button'
import CardShadow from 'components/common/Card/CardShadow'
import Config from 'config/config'
import useWindowSize from 'hooks/useWindowSize'
import 'swiper/css'
import 'swiper/css/pagination'
import { RootStore, useAppSelector } from 'redux/store'
import { createSelector } from 'reselect'
import { useRouter } from 'next/router'
import { TendencyIcon } from 'components/common/Svg/SvgIcon'
import colors from 'styles/colors'
import { formatNumber, getDecimalPrice } from 'utils/utils'
import fetchApi from 'services/fetch-api'
import { API_GET_FUTURES_MARKET_WATCH } from 'services/apis'
import FuturesMarketWatch from 'models/FuturesMarketWatch'
import { roundTo } from 'round-to'
import dynamic from 'next/dynamic'
import { PairConfig } from 'types/types'
const LineChart = dynamic(() => import('components/common/Chart/LineChart'), {
    ssr: false,
})

const getNewAssets = createSelector([(state: RootStore) => state.setting.assetsToken], (assetsToken) => {
    return assetsToken.filter((asset: any) => asset.isNewToken)
})

const Assets = () => {
    const { t } = useTranslation()
    const assetsToken = useAppSelector((state: RootStore) => getNewAssets(state))
    const allPairConfigs = useAppSelector((state: RootStore) => state.setting.pairConfigs)
    const account = useAppSelector((state: RootStore) => state.setting.account)
    const { width } = useWindowSize()
    const isMobile = width && width < 640
    const router = useRouter()
    const [mount, setMount] = useState(false)
    const [marketWatch, setMarketWatch] = useState<any[]>([])

    const onConnectWallet = () => {
        Config.connectWallet()
    }

    const onBuy = (item: any) => {
        if (!account.address) {
            Config.toast.show('error', t('common:please_connect_your_wallet'), {
                button: (
                    <button className="text-sm font-semibold underline" onClick={onConnectWallet}>
                        {t('common:connect_now')}
                    </button>
                ),
            })
        } else {
            const newSymbol = {
                timeframe: 'ALL',
                margin: 0,
                percent_margin: 0,
                symbol: {
                    id: item._id,
                    name: item.name,
                    icon: item.attachment,
                    symbol: `${item.symbol}USDT`,
                    type: item.symbol,
                    disable: !item.isActive,
                },
                period: 2,
                p_claim: 0,
                q_claim: 0,
                r_claim: 0,
                q_covered: 0,
                p_market: 0,
                t_market: 0,
                p_expired: 0,
                index: 1,
            }
            localStorage.setItem('buy_covered_state', JSON.stringify({ ...newSymbol }))
            setTimeout(() => {
                router.push('/buy-covered')
            }, 2000)
        }
    }

    const pagination = useMemo(
        () => ({
            clickable: true,
            bulletClass: 'swiper-pagination-bullet !bg-txtSecondary',
            bulletActiveClass: 'swiper-pagination-bullet-active !bg-red',
            horizontalClass: '!-bottom-[5px]',
            enabled: !isMobile,
            // renderBullet: (index: number, className: string) => {
            //     return `<span class="${className}"> ${index+1} </span>`
            // },
        }),
        [isMobile],
    )

    useEffect(() => {
        setMount(true)
        getMarketWatch()
    }, [])

    const getMarketWatch = async () => {
        try {
            const { data } = await fetchApi({
                url: API_GET_FUTURES_MARKET_WATCH,
                options: { method: 'GET' },
                baseURL: '',
            })
            if (data) setMarketWatch(data)
        } catch (e) {
            console.log(e)
        } finally {
        }
    }

    const renderAssets = () => (
        <div className="d-flex">
            {assetsToken.map((asset: any, index: number) => {
                const _marketWatch = marketWatch.find((m: any) => m.b === asset?.symbol && m.q === 'USDT')
                const pairPrice = FuturesMarketWatch.create(_marketWatch)
                const _24hChange = pairPrice?.priceChangePercent * 100 || 0
                const negative = _24hChange < 0
                const sparkLineColor = negative ? colors.red.red : colors.success
                const symbol = allPairConfigs.find((rs: PairConfig) => rs.baseAsset === asset?.symbol)
                const decimal = getDecimalPrice(symbol)
                // const sparkLine = sparkLineBuilder(asset?.symbol + 'USDT', sparkLineColor)

                return (
                    <SwiperSlide key={index}>
                        <CardShadow className="p-6 flex flex-col space-y-6 w-full">
                            <div className="flex flex-col space-y-2 sm:space-y-4">
                                <div className="flex items-center space-x-2">
                                    <div className="max-w-[2rem] max-h-[2rem]">
                                        <img width="32" height="32" src={asset?.attachment} className="rounded-full h-8 w-8 object-cover" />
                                    </div>
                                    <div className="font-semibold sm:font-medium sm:text-xl">
                                        <span>{asset?.symbol}</span>/<span className="text-txtSecondary">USDT</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className={`text-2xl sm:text-[1.875rem] sm:leading-[2.75rem] font-medium ${negative ? 'text-red' : 'text-success'}`}>
                                        ${formatNumber(pairPrice?.lastPrice, decimal)}
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <TendencyIcon down={negative} color={sparkLineColor} />
                                        <span className={`${negative ? 'text-red' : 'text-success'} font-medium sm:text-xl`}>
                                            {formatNumber(roundTo(_24hChange, 2), 2, 2, true)}%
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full max-h-[100px]">
                                    <LineChart symbol={asset?.symbol + 'USDT'} negative={negative} />
                                    {/* <img src={sparkLine} alt="Nami Exchange" className="w-full" /> */}
                                </div>
                            </div>
                            <Button onClick={() => onBuy(asset)} variants="outlined" className="py-3 font-medium text-sm sm:text-base">
                                {t('home:landing:buy_covered')}
                            </Button>
                        </CardShadow>
                    </SwiperSlide>
                )
            })}
        </div>
    )

    return (
        <Swiper
            pagination={pagination}
            modules={[Pagination]}
            className="mySwiper !px-4 !py-6 !-mx-4"
            slidesPerView={4}
            breakpoints={{
                300: {
                    slidesPerView: 1.05,
                    spaceBetween: 16,
                },
                820: {
                    slidesPerView: 2.5,
                    spaceBetween: 16,
                },
                1080: {
                    slidesPerView: 3,
                    spaceBetween: 16,
                },
            }}
            autoplay={{
                delay: 3000,
                disableOnInteraction: false,
            }}
        >
            {mount && renderAssets()}
        </Swiper>
    )
}

export default Assets
