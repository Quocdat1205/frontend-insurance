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
import FuturesMarketWatch from 'models/FuturesMarketWatch'
import { roundTo } from 'round-to'
import dynamic from 'next/dynamic'
import { PairConfig } from 'types/types'
import Emitter from 'socket/emitter'
import { PublicSocketEvent } from 'socket/socketEvent'
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
    const publicSocket = useAppSelector((state: RootStore) => state.socket.publicSocket)
    const account = useAppSelector((state: RootStore) => state.setting.account)
    const { width } = useWindowSize()
    const isMobile = width && width < 640
    const router = useRouter()
    const [mount, setMount] = useState(false)
    const [marketWatch, setMarketWatch] = useState<any>({})

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
                type: item.symbol,
            }
            localStorage.setItem('buy_covered_state', JSON.stringify({ ...newSymbol }))
            router.push('/buy-covered')
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
    }, [])

    useEffect(() => {
        const arr = assetsToken.map((rs: any) => rs?.symbol + 'USDT')
        if (publicSocket && assetsToken && assetsToken.length > 0) publicSocket.emit('subscribe:futures:ticker', arr)
        arr.map((symbol: any) =>
            Emitter.on(PublicSocketEvent.FUTURES_TICKER_UPDATE + symbol, async (data) => {
                const pairPrice = FuturesMarketWatch.create(data)
                marketWatch[symbol] = pairPrice
                setMarketWatch({ ...marketWatch })
            }),
        )
        return () => {
            if (publicSocket) publicSocket?.emit('unsubscribe:futures:ticker', arr)
            Emitter.off(PublicSocketEvent.FUTURES_TICKER_UPDATE)
        }
    }, [assetsToken, publicSocket])

    const renderAssets = () => (
        <div className="d-flex">
            {assetsToken.map((asset: any, index: number) => {
                const pairPrice = marketWatch[asset.symbol + 'USDT']
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
                500: {
                    slidesPerView: 2.05,
                    spaceBetween: 16,
                },
                820: {
                    slidesPerView: 2.5,
                    spaceBetween: 16,
                },
                1080: {
                    slidesPerView: 3,
                    spaceBetween: 16,
                }
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
