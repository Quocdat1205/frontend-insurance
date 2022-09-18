import dynamic from 'next/dynamic'
import LayoutInsurance from 'components/layout/layoutInsurance'
import useWeb3Wallet from 'hooks/useWeb3Wallet'
import Button from 'components/common/Button/Button'
import axios from 'axios'
import { Menu, Popover, Switch, Tab } from '@headlessui/react'
import { AcceptBuyInsurance } from '../components/screens/Insurance/AcceptBuyInsurance'
import { GetStaticProps } from 'next'
import { Input } from 'components/common/Input/input'
import { ICoin } from 'components/common/Input/input.interface'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { CheckCircle, LeftArrow, InfoCircle, XMark, ErrorTriggersIcon, BxDollarCircle, BxLineChartDown, BxCaledarCheck } from 'components/common/Svg/SvgIcon'
import { ChevronDown, Check, ChevronUp } from 'react-feather'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import useWindowSize from 'hooks/useWindowSize'
import { screens, stateInsurance } from 'utils/constants'
import { Suspense } from 'react'
import store, { RootStore, useAppSelector } from 'redux/store'
import Config from 'config/config'
import NotificationInsurance from 'components/layout/notifucationInsurance'
import Modal from 'components/common/Modal/Modal'
import Tooltip from 'components/common/Tooltip/Tooltip'
import colors from 'styles/colors'
import { formatNumber, getUnit } from 'utils/utils'
import useWeb3USDT from 'hooks/useWeb3USDT'
import styled from 'styled-components'
import classnames from 'classnames'

import { ethers } from 'ethers'
const Guide = dynamic(() => import('components/screens/Insurance/Guide'), {
    ssr: false,
})
//chart
const ChartComponent = dynamic(() => import('../components/common/Chart/chartComponent'), { ssr: false, suspense: true })

export const InsuranceFrom = () => {
    const {
        t,
        i18n: { language },
    } = useTranslation()
    const wallet = useWeb3Wallet()
    const USDTBalance = useWeb3USDT()
    const router = useRouter()
    const { width } = useWindowSize()
    const isMobile = width && width <= screens.drawer

    const unitConfig = useAppSelector((state: RootStore) => getUnit(state, 'USDT'))
    const [percentInsurance, setPercentInsurance] = useState<number>(0)
    const [selectTime, setSelectTime] = useState<string>('ALL')
    const [isDrop, setDrop] = useState(false)
    const [checkUpgrade, setCheckUpgrade] = useState(false)
    const [clear, setClear] = useState(false)
    const stone = store.getState()
    const [index, setIndex] = useState<1 | 2>(1)
    const [tab, setTab] = useState<number>(3)
    const [loadings, setLoadings] = useState(true)
    const [priceBNB, setPriceBNB] = useState(0)
    const [openChangeToken, setOpenChangeToken] = useState(false)
    const [active, setActive] = useState<boolean>(false)
    const [nameNoti, setNameNoti] = useState<'success' | 'expired' | 'expired1' | 'email' | 'loading'>('loading')
    const [res, setRes] = useState<any>()
    const [showDetails, setShowDetails] = useState(false)
    const [unitMoney, setUnitMoney] = useState('USDT')
    const [changeUnit, setChangeUnit] = useState<boolean>(false)
    const [changeUnit1, setChangeUnit1] = useState<boolean>(false)
    const [changeUnit2, setChangeUnit2] = useState<boolean>(false)
    const [showCroll, setShowCroll] = useState(false)
    const [errorPCalim, setErrorPCalim] = useState(false)
    const [showGuide, setShowGuide] = useState<boolean>(false)
    const [chosing, setChosing] = useState(false)
    const [showGuideModal, setShowGuideModal] = useState<boolean>(false)
    const [showChangeUnit, setShowChangeUnit] = useState({
        isShow: false,
        name: '',
    })
    const [userBalance, setUserBalance] = useState<number>(0)
    const [listCoin, setListCoin] = useState<ICoin[]>([])
    const [selectCoin, setSelectedCoin] = useState<ICoin>({
        icon: 'https://sgp1.digitaloceanspaces.com/nami-dev/52ee9631-90f3-42e6-a05f-22ea01066e56-bnb.jpeg',
        id: '63187ae8c2ad72eac4d0f363',
        name: 'Binance',
        symbol: 'BNBUSDT',
        type: 'BNB',
        disable: false,
    })
    const [state, setState] = useState({
        timeframe: 'ALL',
        margin: 0,
        percent_margin: 0,
        symbol: {
            icon: 'https://sgp1.digitaloceanspaces.com/nami-dev/52ee9631-90f3-42e6-a05f-22ea01066e56-bnb.jpeg',
            id: '63187ae8c2ad72eac4d0f363',
            name: 'Binance',
            symbol: 'BNBUSDT',
            type: 'BNB',
            disable: false,
        },
        period: 2,
        p_claim: 0,
        q_claim: 0,
        r_claim: 0,
        q_covered: 0,
        p_market: 0,
        t_market: new Date(),
        p_expired: 0,
    })
    const defaultToken = {
        icon: 'https://sgp1.digitaloceanspaces.com/nami-dev/52ee9631-90f3-42e6-a05f-22ea01066e56-bnb.jpeg',
        id: '63187ae8c2ad72eac4d0f363',
        name: 'Binance',
        symbol: 'BNBUSDT',
        type: 'BNB',
        disable: false,
    }
    const [dataChart, setDataChart] = useState()
    const listTime = ['1H', '1D', '1W', '1M', '3M', '1Y', 'ALL']
    const listTabPeriod: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    const menu = [
        { menuId: 'home', router: 'home', name: t('insurance:buy:home'), parentId: 0 },
        { menuId: 'buy_covered', router: 'insurance', name: t('insurance:buy:buy_covered'), parentId: 0 },
        { menuId: 'back_to_home', router: 'home', name: t('insurance:buy:back_to_home'), parentId: 0 },
        { menuId: 'default', name: t('insurance:buy:default'), parentId: 0 },
        { menuId: 'change_r_claim', name: t('insurance:buy:change_r_claim'), parentId: 0 },
        { menuId: 'change_q_claim', name: t('insurance:buy:change_q_claim'), parentId: 0 },
        { menuId: 'change_margin', name: t('insurance:buy:change_margin'), parentId: 0 },
        { menuId: 'quality_and_type', name: t('insurance:buy:quality_and_type') },
        { menuId: 'day', name: t('insurance:buy:day') },
        { menuId: 'example', name: t('insurance:buy:example') },
        { menuId: 'tooltip', name: t('insurance:buy:tooltip') },
        { menuId: 'continue', name: t('insurance:buy:continue') },
        { menuId: 'help', name: t('insurance:buy:help') },
    ]
    const tokenAddresses = [
        {
            address: '0x0897202ce1838d0712d357103aae83650a0d426d',
            token: 'USDT',
        },
        {
            address: '0x3d658390460295fb963f54dc0899cfb1c30776df',
            token: 'USDC',
        },
        {
            address: '0x6b175474e89094c44da98b954eedeac495271d0f',
            token: 'BUSD',
        },
    ]

    const Leverage = (p_market: number, p_stop: number) => {
        const leverage = Number(formatNumber(p_market / Math.abs(p_market - p_stop), 2))
        return leverage < 1 ? 1 : leverage
    }

    const P_stop = (p_market: number, p_claim: number, hedge: number) => {
        const diffStopfutures = 0 / 100
        const ratio_min_profit = Math.abs(p_claim - p_market) / p_market / 2
        if (p_claim > p_market) {
            const p_stop = Number(formatNumber((p_market - p_market * (hedge + ratio_min_profit - diffStopfutures)) * 100, 2))
            return Math.abs(p_stop) / 100
        } else {
            const p_stop = Number(formatNumber((p_market + p_market * (hedge + ratio_min_profit - diffStopfutures)) * 100, 2))
            return Math.abs(p_stop) / 100
        }
    }

    const validatePclaim = (value: number) => {
        if (wallet.account) {
            if (value > state.p_market + (2 * state.p_market) / 100 && value < state.p_market + (70 * state.p_market) / 100) {
                setErrorPCalim(true)
                return validateMargin(state.margin)
            } else if (value > state.p_market - (70 * state.p_market) / 100 && value < state.p_market - (2 * state.p_market) / 100) {
                setErrorPCalim(true)
                return validateMargin(state.margin)
            } else {
                setErrorPCalim(false)
                return setClear(false)
            }
        }
    }

    const validateMargin = (value: number) => {
        if (wallet.account) {
            if (value > 0) {
                return validateQCovered(state.q_covered)
            } else {
                return setClear(false)
            }
        }
    }

    useEffect(() => {
        if (loadings) {
            setTimeout(() => {
                // setShowGuide(true)
            }, 5000)
        }
    }, [loadings])

    const validateQCovered = (value: number) => {
        if (wallet.account) {
            if (value > 0) {
                return setClear(true)
            } else {
                return setClear(false)
            }
        }
    }

    useEffect(() => {
        setLoadings(true)
        if (stone.setting.assetsToken.length > 0) {
            let list: ICoin[] = []

            stone.setting.assetsToken.map(async (token: any) => {
                list.push({
                    id: token._id,
                    name: token.name,
                    icon: token.attachment,
                    symbol: `${token.symbol}USDT`,
                    type: token.symbol,
                    disable: !token.isActive,
                })
            })
            setListCoin(list)
            setLoadings(false)
        }
    }, [store])

    useEffect(() => {
        if (wallet.account) {
            getBalanceUsdt()
        }
    }, [wallet.account])

    const getBalanceUsdt = async () => {
        if (state.p_market > 0) {
            const balanceUsdt = wallet.account && (await wallet?.contractCaller.usdtContract.contract.balanceOf(wallet.account))
            setUserBalance(Number(formatNumber(Number(balanceUsdt && ethers.utils.formatEther(balanceUsdt)) / state.p_market, 4)))
        }
    }

    const setStorage = (value: any) => {
        localStorage.setItem('buy_covered_state', JSON.stringify(value))
    }

    useEffect(() => {
        try {
            setLoadings(true)
            if (typeof window.ethereum !== undefined) {
                console.log('MetaMask is installed!')
            }
            const data = localStorage.getItem('buy_covered_state')
            if (data) {
                const res = JSON.parse(data)
                setState({
                    ...state,
                    timeframe: res.timeframe,
                    margin: res.margin * 1.0,
                    percent_margin: res.percent_margin * 1.0,
                    symbol: {
                        icon: res.symbol.icon,
                        id: res.symbol.id,
                        name: res.symbol.name,
                        symbol: res.symbol.symbol,
                        type: res.symbol.type,
                        disable: res.symbol.disable,
                    },
                    period: res.period * 1.0,
                    p_claim: res.p_claim * 1.0,
                    q_claim: res.q_claim * 1.0,
                    r_claim: res.r_claim * 1.0,
                    q_covered: res.q_covered * 1.0,
                    p_market: res.p_market * 1.0,
                    t_market: res.t_market,
                    p_expired: res.p_expired * 1.0,
                })
                setTab(res.tab)
                setUnitMoney(res.unitMoney)
                setIndex(res.index)
                validatePclaim(res.p_claim)
            } else {
                setStorage(state)
            }
            setLoadings(false)
        } catch (error) {
            setLoadings(false)
            return console.log(error)
        }
    }, [])

    useEffect(() => {
        if (unitMoney) {
            const data = localStorage.getItem('buy_covered_state')
            if (data) {
                const res = JSON.parse(data)
                const newData = { ...res, unitMoney: unitMoney }
                localStorage.setItem('buy_covered_state', JSON.stringify(newData))
            }
        }
    }, [unitMoney])

    useEffect(() => {
        if (index) {
            const data = localStorage.getItem('buy_covered_state')
            if (data) {
                const res = JSON.parse(data)
                const newData = { ...res, index: index }
                localStorage.setItem('buy_covered_state', JSON.stringify(newData))
            }
        }
    }, [index])

    useEffect(() => {
        if (state.q_covered > 0) {
            setPercentInsurance((state.q_covered / userBalance) * 100)
        }
    }, [state.q_covered])

    useEffect(() => {
        if (state) {
            const data = localStorage.getItem('buy_covered_state')
            if (data) {
                const res = JSON.parse(data)
                const newData = {
                    ...res,
                    timeframe: state.timeframe,
                    margin: state.margin * 1.0,
                    percent_margin: state.percent_margin * 1.0,
                    symbol: {
                        icon: state.symbol.icon,
                        id: state.symbol.id,
                        name: state.symbol.name,
                        symbol: state.symbol.symbol,
                        type: state.symbol.type,
                        disable: state.symbol.disable,
                    },
                    period: state.period * 1.0,
                    p_claim: state.p_claim * 1.0,
                    q_claim: state.q_claim * 1.0,
                    r_claim: state.r_claim * 1.0,
                    q_covered: state.q_covered * 1.0,
                    p_market: state.p_market * 1.0,
                    t_market: state.t_market,
                    p_expired: state.p_expired * 1.0,
                }

                setStorage(newData)
            }
        }
    }, [state])

    useEffect(() => {
        const data = localStorage.getItem('buy_covered_state')
        if (data) {
            const res = JSON.parse(data)
            const newData = { ...res, tab: tab }
            return localStorage.setItem('buy_covered_state', JSON.stringify(newData))
        }
    }, [tab])

    useEffect(() => {
        if (listCoin.length > 0) {
            const timeEnd = new Date()
            const timeBegin = new Date()
            timeBegin.setDate(timeEnd.getDate() - 10)
            setState({ ...state, t_market: timeEnd })
            setLoadings(true)
            getPrice(listCoin[0].symbol, state, setState)
        }
    }, [listCoin])

    useEffect(() => {
        refreshApi(selectTime, selectCoin)
    }, [selectTime, selectCoin])

    useEffect(() => {
        if (selectCoin.symbol != '') {
            getPrice(selectCoin.symbol, state, setState)
            setState({ ...state, symbol: { ...selectCoin } })
        }
    }, [selectCoin])

    const refreshApi = (
        selectTime: string | undefined,
        selectCoin: { id?: string; name?: string; icon?: string; disable?: boolean | undefined; symbol?: string; type: any },
    ) => {
        const timeEnd = new Date()
        const timeBegin = new Date()
        setLoadings(true)
        if (selectCoin) {
            if (selectTime == '1H' || selectTime == '1D') {
                timeBegin.setDate(timeEnd.getDate() - 10)
                fetchApiNami(
                    `${selectCoin.type ? selectCoin.type : defaultToken.type}${unitMoney}`,
                    `${Math.floor(timeBegin.getTime() / 1000)}`,
                    `${Math.ceil(timeEnd.getTime() / 1000)}`,
                    '1m',
                    setDataChart,
                ).then(() => {
                    return setLoadings(false)
                })
            } else if (selectTime == '1W') {
                timeBegin.setDate(timeEnd.getDate() - 10)
                fetchApiNami(
                    `${selectCoin.type ? selectCoin.type : defaultToken.type}${unitMoney}`,
                    `${Math.floor(timeBegin.getTime() / 1000)}`,
                    `${Math.ceil(timeEnd.getTime() / 1000)}`,
                    '1h',
                    setDataChart,
                ).then(() => {
                    return setLoadings(false)
                })
            } else {
                timeBegin.setDate(timeEnd.getDate() - 10)
                fetchApiNami(
                    `${selectCoin.type ? selectCoin.type : defaultToken.type}${unitMoney}`,
                    `${Math.floor(timeBegin.getTime() / 1000)}`,
                    `${Math.ceil(timeEnd.getTime() / 1000)}`,
                    '1h',
                    setDataChart,
                ).then(() => {
                    return setLoadings(false)
                })
            }
        }
    }

    useEffect(() => {
        if (state.q_covered) {
            const percent: number = Math.floor((state.q_covered / userBalance) * 100)
            setPercentInsurance(percent)
        }
        if (selectCoin) {
            setState({ ...state, symbol: selectCoin })
        }

        if (tab == 3) {
            if (state.period || state.q_covered || state.p_claim) {
                const margin = Number((10 * state.q_covered * state.p_market) / 100)
                const userCapital = margin
                const systemCapital = userCapital
                const hedge_capital = userCapital + systemCapital
                const hedge = Number(margin / (state.q_covered * state.p_market))
                const p_stop = P_stop(state.p_market, state.p_claim, hedge)
                const laverage = Leverage(state.p_market, p_stop)
                const ratio_profit = Number(Math.abs(state.p_claim - state.p_market) / state.p_market)
                const q_claim = Number(ratio_profit * hedge_capital * laverage) * (1 - 0.05) + margin
                setState({ ...state, q_claim: q_claim, r_claim: Number(q_claim / margin) * 100, p_expired: Math.floor(p_stop), margin: margin })
            }
        }

        if (tab == 6) {
            if (state.period || state.q_covered || state.p_claim || state.margin) {
                const userCapital = state.margin
                const systemCapital = userCapital
                const hedge_capital = userCapital + systemCapital
                const hedge = Number(state.margin / (state.q_covered * state.p_market))
                const p_stop = P_stop(state.p_market, state.p_claim, hedge)
                const laverage = Leverage(state.p_market, p_stop)
                const ratio_profit = Number(Math.abs(state.p_claim - state.p_market) / state.p_market)
                const q_claim = Number(ratio_profit * hedge_capital * laverage) * (1 - 0.05) + state.margin
                setState({ ...state, q_claim: q_claim, r_claim: Number(q_claim / state.margin) * 100, p_expired: Math.floor(p_stop) })
            }
        }
        validatePclaim(state.p_claim)
    }, [state.q_covered, state.period, selectCoin, state.margin, state.p_claim, state.percent_margin])

    useEffect(() => {
        if (state.p_claim > 0) {
            validatePclaim(state.p_claim)
        }
    }, [state.p_claim])

    return !loadings ? (
        !isMobile ? (
            <>
                <LayoutInsurance
                    handleClick={() => {
                        setDrop(false)
                        setChosing(false)
                        setChangeUnit2(false)
                        setChangeUnit(false)
                        setChangeUnit1(false)
                    }}
                >
                    {index == 1 && <Guide start={showGuide} setStart={setShowGuide} />}

                    {showDetails && <TerminologyModal isMobile={isMobile} visible={showDetails} onClose={() => setShowDetails(false)} t={t} />}

                    {active && (
                        <Modal
                            portalId="modal"
                            isVisible={!isMobile}
                            onBackdropCb={() => {}}
                            className="rounded-xl p-6 bg-white max-w-[424px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        >
                            <NotificationInsurance
                                id={res ? res.data._id : ''}
                                name={`${nameNoti}`}
                                state={state}
                                active={active}
                                setActive={() => {
                                    setActive(false)
                                }}
                                isMobile={false}
                            />
                        </Modal>
                    )}

                    {
                        // head Insurance
                        <div
                            className="max-w-screen-layout 4xl:max-w-screen-3xl m-auto px-[80px] mt-[48px] mb-[20px] flex items-center justify-between"
                            onClick={() => {
                                setDrop(false)
                                setChosing(false)
                            }}
                        >
                            <div className="flex items-center font-semibold text-base">
                                <LeftArrow></LeftArrow>
                                <span
                                    className={' text-[#22313F] hover:cursor-pointer ml-[8px]'}
                                    onClick={() => {
                                        if (index == 1) {
                                            return router.push('/ ')
                                        }
                                        if (index == 2) {
                                            return setIndex(1)
                                        }
                                    }}
                                >
                                    {index == 1 ? menu[2].name : language == 'en' ? 'Back' : 'Quay về'}
                                </span>
                            </div>

                            <Popover className="relative">
                                <Popover.Button
                                    className={
                                        'border border-[0.5] text-base border-[#F7F8FA] rounded-[6px] h-[40px] w-auto py-[8px] px-[12px] flex flex-row bg-[#F7F8FA] shadow focus-visible:outline-none'
                                    }
                                    onClick={() => setDrop(!isDrop)}
                                >
                                    {menu[tab]?.name}
                                    {!isDrop ? <ChevronDown></ChevronDown> : <ChevronUp></ChevronUp>}
                                </Popover.Button>
                                <Popover.Panel className="absolute z-50 bg-white w-[260px] right-0 top-[48px] rounded shadow">
                                    {({ close }) => (
                                        <div className="flex flex-col justify-center h-full ">
                                            {menu.map((e, key) => {
                                                let Press = false
                                                return (
                                                    (key == 3 || key == 6) && (
                                                        <div
                                                            onClick={() => {
                                                                setTab(key)
                                                                setDrop(false)
                                                                close()
                                                            }}
                                                            key={key}
                                                            onMouseDown={() => (Press = true)}
                                                            onMouseUp={() => (Press = false)}
                                                            className={`${Press ? 'bg-[#F2F3F5]' : 'hover:bg-[#F7F8FA]'}
                                                        flex flex-row justify-start w-full items-center p-3 font-medium hover:cursor-pointer`}
                                                        >
                                                            <div className={`flex flex-row justify-between w-full px-[16px] py-[6px] `}>
                                                                <span> {e.name} </span>
                                                            </div>
                                                        </div>
                                                    )
                                                )
                                            })}
                                        </div>
                                    )}
                                </Popover.Panel>
                            </Popover>
                        </div>
                    }

                    {
                        //title

                        <div
                            className={'flex flex-col justify-center items-center mb-[32px] max-w-screen-layout 4xl:max-w-screen-3xl m-auto'}
                            onClick={() => {
                                setDrop(false)
                                setChosing(false)
                            }}
                        >
                            <div>{index}/2</div>
                            <div className={'font-semibold text-[32px] leading-[44px]'}>{index == 1 ? menu[1].name : t('insurance:buy:info_covered')}</div>
                            {!wallet.account && <div className={'mt-[12px]'}>{t('insurance:buy:connect_wallet_error')}</div>}
                        </div>
                    }

                    {
                        //checkAuth
                        !wallet.account
                            ? !isMobile && (
                                  <div
                                      className="w-full flex flex-col justify-center items-center max-w-screen-layout 4xl:max-w-screen-3xl m-auto"
                                      onClick={() => {
                                          setDrop(false)
                                          setChosing(false)
                                      }}
                                  >
                                      <Button
                                          variants={'primary'}
                                          className={`bg-[#EB2B3E] h-[48px] w-[374px] flex justify-center items-center text-white rounded-[8px] py-[12px]`}
                                          onClick={() => {
                                              Config.connectWallet()
                                          }}
                                      >
                                          {t('insurance:buy:connect_wallet')}
                                      </Button>
                                  </div>
                              )
                            : ''
                    }
                    {
                        //chart
                        index == 1 && (
                            <div
                                className={`${
                                    !isMobile
                                        ? 'shadow border border-1 border-[#E5E7E8] h-auto rounded-[12px] mt-[32px] max-w-screen-md lg:max-w-screen-md xl:max-w-screen-lg m-auto'
                                        : ''
                                }`}
                                onClick={() => {
                                    setDrop(false)
                                    setChosing(false)
                                }}
                            >
                                {/*head*/}
                                <div id="tour_statistics" data-tut="tour_statistics">
                                    <div
                                        className={
                                            ' pb-[8px] pl-[32px] pt-[32px] text-[14px] leading-5 text-[#808890] flex flex-row justify-start items-center'
                                        }
                                    >
                                        <div className={'w-1/2 flex flex-row items-center'}>
                                            <span className={'mr-[8px]'}>{menu[7].name}</span>
                                            <div data-tip={t('insurance:terminology:q_covered')} data-for={`q-covered`}>
                                                <InfoCircle size={14} color={colors.txtSecondary} />
                                                <Tooltip className="max-w-[200px]" id={'q-covered'} placement="right" />
                                            </div>
                                        </div>
                                        {tab == 6 && (
                                            <div className={'w-1/2 flex flex-row items-center'}>
                                                <span className={'mr-[8px]'}>Margin</span>
                                                <div data-tip={t('insurance:terminology:margin')} data-for={`margin`}>
                                                    <InfoCircle size={14} color={colors.txtSecondary} />
                                                    <Tooltip className="max-w-[200px]" id={'margin'} placement="right" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className={'pb-[8px] pl-[32px] pr-[32px] h-[70px] flex justify-between'}>
                                        <div
                                            className={`${tab > 3 ? 'w-[50%] mr-[12px]' : 'w-full'} ${
                                                state.q_covered > userBalance && 'border border-1 border-[#E5544B]'
                                            } flex justify-between border-collapse rounded-[3px] shadow-none`}
                                        >
                                            <Input
                                                className={
                                                    'w-[70%] font-semibold appearance-none bg-[#F7F8FA] outline-none focus:ring-0 rounded-none shadow-none'
                                                }
                                                type={'number'}
                                                inputName={'Loại tài sản và số lượng tài sản'}
                                                idInput={'iCoin'}
                                                value={state.q_covered || 0}
                                                onChange={(a: any) => {
                                                    if (Number(a.target.value) >= 1) {
                                                        setState({ ...state, q_covered: a.target.value.replace(/^0+/, '') })
                                                    } else {
                                                        setState({ ...state, q_covered: Number(a.target.value) })
                                                    }

                                                    setPercentInsurance(0)
                                                }}
                                                placeholder={'0'}
                                            ></Input>
                                            <Popover className="relative w-[40%] outline-none bg-[#F7F8FA] focus:ring-0 rounded-none shadow-none flex items-center justify-center pr-[21px]">
                                                {state.q_covered > userBalance && (
                                                    <div className="absolute right-0 top-[-50px] text-xs z-[100] w-max border border-1 border-[#EB2B3E] p-[8px] rounded-md tooltip">
                                                        <div className="flex flex-row items-center justify-center">
                                                            <div className="mr-[8px] items-center justify-center">
                                                                <ErrorTriggersIcon />
                                                            </div>
                                                            <div>{`Số dư khả dụng: ${userBalance}`}</div>
                                                        </div>
                                                    </div>
                                                )}
                                                <Popover.Button
                                                    id={'popoverInsurance'}
                                                    className={'flex flex-row justify-end w-full items-center focus:border-0 focus:ring-0 active:border-0'}
                                                    onClick={() => {
                                                        setChosing(!chosing)
                                                    }}
                                                >
                                                    <img
                                                        alt={''}
                                                        src={`${selectCoin ? selectCoin.icon : defaultToken.icon}`}
                                                        width="20"
                                                        height="20"
                                                        className={'mr-[4px] rounded-[50%]'}
                                                    ></img>
                                                    <span className={'w-max flex flex-start font-semibold text-[#EB2B3E] text-base'}>
                                                        {selectCoin ? selectCoin.name : defaultToken.name}
                                                    </span>
                                                    {!chosing ? (
                                                        <ChevronDown size={18} className={'mt-1 text-[#22313F]'}></ChevronDown>
                                                    ) : (
                                                        <ChevronUp size={18} className={'mt-1 text-[#22313F]'}></ChevronUp>
                                                    )}
                                                </Popover.Button>
                                                <Popover.Panel className="absolute z-50 bg-white top-[88px] right-0  w-[360px] rounded shadow">
                                                    {({ close }) => (
                                                        <div className="flex flex-col focus:border-0 focus:ring-0 active:border-0">
                                                            {listCoin &&
                                                                listCoin.map((coin, key) => {
                                                                    let isPress = false
                                                                    // @ts-ignore
                                                                    return !coin.disable ? (
                                                                        <div
                                                                            id={`${coin.id}`}
                                                                            key={key}
                                                                            onMouseDown={() => (isPress = true)}
                                                                            onMouseUp={() => {
                                                                                isPress = false
                                                                                setSelectedCoin(coin)
                                                                                setState({ ...state, symbol: { ...coin } })
                                                                                setChosing(false)
                                                                            }}
                                                                            onClick={() => close()}
                                                                            className={`${
                                                                                isPress ? 'bg-[#F2F3F5]' : 'hover:bg-[#F7F8FA]'
                                                                            } flex flex-row justify-start w-full items-center p-3 font-medium`}
                                                                        >
                                                                            <div className="max-w-[20px] mr-[8px] max-h-[20px] ">
                                                                                <img
                                                                                    alt={''}
                                                                                    src={`${coin.icon}`}
                                                                                    width="20"
                                                                                    height="20"
                                                                                    className={'mr-[5px] rounded-[50%]'}
                                                                                ></img>
                                                                            </div>
                                                                            <div className={'flex flex-row justify-between w-full text-sm'}>
                                                                                <span className={'hover:cursor-default'}>{coin.name}</span>
                                                                                {coin.id === selectCoin.id ? (
                                                                                    <Check size={18} className={'text-[#EB2B3E]'}></Check>
                                                                                ) : (
                                                                                    ''
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <a
                                                                            id={`${coin.id}`}
                                                                            key={key}
                                                                            className={`hover:bg-[#F7F8FA] flex flex-row justify-start w-full items-center p-3 text-[#E5E7E8] font-medium`}
                                                                        >
                                                                            <img
                                                                                alt={''}
                                                                                src={`${coin.icon}`}
                                                                                width="36"
                                                                                height="36"
                                                                                className={'mr-[5px] grayscale hover:cursor-default'}
                                                                            ></img>
                                                                            <div className={'flex flex-row justify-between w-full'}>
                                                                                <span>{coin.name}</span>
                                                                                {coin.id === selectCoin.id ? (
                                                                                    <Check size={18} className={'text-[#EB2B3E]'}></Check>
                                                                                ) : (
                                                                                    ''
                                                                                )}
                                                                            </div>
                                                                        </a>
                                                                    )
                                                                })}
                                                        </div>
                                                    )}
                                                </Popover.Panel>
                                            </Popover>
                                        </div>

                                        {tab > 3 && (
                                            <div
                                                className={`${
                                                    tab > 3 ? 'w-[50%]' : 'hidden'
                                                } ml-[12px] flex justify-between border-collapse rounded-[3px] shadow-none`}
                                            >
                                                <Input
                                                    className={
                                                        'w-[90%] font-semibold appearance-none bg-[#F7F8FA] outline-none focus:ring-0 rounded-none shadow-none'
                                                    }
                                                    type={'number'}
                                                    inputName={'P-Claim'}
                                                    idInput={''}
                                                    value={state.margin > 0 ? state?.margin : 0}
                                                    onChange={(a: any) => {
                                                        if (Number(a.target.value) >= 1) {
                                                            setState({ ...state, margin: a.target.value.replace(/^0+/, ''), percent_margin: 0 })
                                                        } else {
                                                            setState({ ...state, margin: Number(a.target.value), percent_margin: 0 })
                                                        }
                                                    }}
                                                    placeholder={''}
                                                ></Input>
                                                <div
                                                    className={
                                                        'bg-[#F7F8FA] w-[10%] shadow-none flex flex-row items-center justify-end px-[16px] select-none hover:cursor-pointer text-red'
                                                    }
                                                >
                                                    <span>{unitMoney}</span>
                                                    <Popover className="relative">
                                                        <Popover.Button
                                                            className={'my-[16px] text-[#22313F] underline hover:cursor-pointer '}
                                                            onClick={() => setChangeUnit2(!changeUnit2)}
                                                        >
                                                            {!changeUnit2 ? <ChevronDown></ChevronDown> : <ChevronUp></ChevronUp>}
                                                        </Popover.Button>
                                                        <Popover.Panel
                                                            className="flex flex-col text-[#22313F] absolute  top-[63px] right-[-15px] bg-white z-[100] rounded"
                                                            style={{ boxShadow: '0px 3px 5px rgba(9, 30, 66, 0.2), 0px 0px 1px rgba(9, 30, 66, 0.31)' }}
                                                        >
                                                            {({ close }) => (
                                                                <div className="flex flex-col justify-center h-full ">
                                                                    {['USDT', 'BUSD', 'USDC'].map((e, key) => {
                                                                        return (
                                                                            <div
                                                                                key={key}
                                                                                className={` py-[8px] px-[16px] hover:bg-[#F7F8FA]`}
                                                                                onClick={() => {
                                                                                    setUnitMoney(e)
                                                                                    setChangeUnit2(false)
                                                                                    close()
                                                                                }}
                                                                            >
                                                                                <span>{e}</span>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            )}
                                                        </Popover.Panel>
                                                    </Popover>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-row w-full px-[0px]">
                                    <div className={`flex flex-row justify-between mt-[8px] text-[12px] md:text-[14px] ${tab == 6 ? 'w-1/2' : 'w-full'}`}>
                                        <div
                                            className={`flex flex-col justify-center w-[25%] items-center hover:cursor-pointer`}
                                            onClick={() => setState({ ...state, q_covered: (25 / 100) * userBalance })}
                                        >
                                            <div className={`${percentInsurance >= 25 ? 'bg-[#EB2B3E]' : 'bg-[#F2F3F5]'} h-[5px] w-[80%] rounded-sm`}></div>
                                            <span>25%</span>
                                        </div>
                                        <div
                                            className={'flex flex-col justify-center w-[25%] items-center hover:cursor-pointer'}
                                            onClick={() => setState({ ...state, q_covered: (50 / 100) * userBalance })}
                                        >
                                            <div className={`${percentInsurance >= 50 ? 'bg-[#EB2B3E]' : 'bg-[#F2F3F5]'} h-[5px] w-[80%] rounded-sm`}></div>
                                            <span className={''}>50%</span>
                                        </div>
                                        <div
                                            className={'flex flex-col justify-center w-[25%] items-center hover:cursor-pointer'}
                                            onClick={() => setState({ ...state, q_covered: (75 / 100) * userBalance })}
                                        >
                                            <div className={`${percentInsurance >= 75 ? 'bg-[#EB2B3E]' : 'bg-[#F2F3F5]'} h-[5px] w-[80%] rounded-sm`}></div>
                                            <span className={''}>75%</span>
                                        </div>
                                        <div
                                            className={'flex flex-col justify-center w-[25%] items-center hover:cursor-pointer'}
                                            onClick={() => setState({ ...state, q_covered: userBalance })}
                                        >
                                            <div className={`${percentInsurance >= 100 ? 'bg-[#EB2B3E]' : 'bg-[#F2F3F5]'} h-[5px] w-[80%] rounded-sm`}></div>
                                            <span>100%</span>
                                        </div>
                                    </div>

                                    <div className={`flex flex-row justify-between mt-[8px] ${tab == 6 ? 'w-1/2' : 'hidden'}`}>
                                        <div
                                            className={'flex flex-col justify-center w-[25%] items-center hover:cursor-pointer'}
                                            onClick={() => {
                                                setState({
                                                    ...state,
                                                    percent_margin: 2,
                                                    margin: Number((state.percent_margin * state.q_covered * state.p_market) / 100),
                                                })
                                            }}
                                        >
                                            <div className={`${state.percent_margin == 2 ? 'bg-[#EB2B3E]' : 'bg-[#F2F3F5]'} h-[5px] w-[80%] rounded-sm`}></div>
                                            <span>2%</span>
                                        </div>
                                        <div
                                            className={'flex flex-col justify-center w-[25%] items-center hover:cursor-pointer'}
                                            onClick={() => {
                                                setState({
                                                    ...state,
                                                    percent_margin: 5,
                                                    margin: Number((state.percent_margin * state.q_covered * state.p_market) / 100),
                                                })
                                            }}
                                        >
                                            <div className={`${5 == state.percent_margin ? 'bg-[#EB2B3E]' : 'bg-[#F2F3F5]'} h-[5px] w-[80%] rounded-sm`}></div>
                                            <span className={''}>5%</span>
                                        </div>
                                        <div
                                            className={'flex flex-col justify-center w-[25%] items-center hover:cursor-pointer'}
                                            onClick={() => {
                                                setState({
                                                    ...state,
                                                    percent_margin: 7,
                                                    margin: Number((state.percent_margin * state.q_covered * state.p_market) / 100),
                                                })
                                            }}
                                        >
                                            <div className={`${7 == state.percent_margin ? 'bg-[#EB2B3E]' : 'bg-[#F2F3F5]'} h-[5px] w-[80%] rounded-sm`}></div>
                                            <span className={''}>7%</span>
                                        </div>
                                        <div
                                            className={'flex flex-col justify-center w-[25%] items-center hover:cursor-pointer'}
                                            onClick={() => {
                                                setState({
                                                    ...state,
                                                    percent_margin: 10,
                                                    margin: Number((state.percent_margin * state.q_covered * state.p_market) / 100),
                                                })
                                            }}
                                        >
                                            <div className={`${state.percent_margin == 10 ? 'bg-[#EB2B3E]' : 'bg-[#F2F3F5]'} h-[5px] w-[80%] rounded-sm`}></div>
                                            <span>10%</span>
                                        </div>
                                    </div>
                                </div>

                                {/*end head*/}
                                <div data-tut="tour_chart" id="tour_chart">
                                    {/*body*/}
                                    <div className={'px-[32px] flex flex-row relative'}>
                                        <Suspense fallback={`Loading...`}>
                                            <ChartComponent
                                                data={dataChart}
                                                state={state ? state : null}
                                                p_claim={Number(state && state.p_claim)}
                                                p_expired={state.p_expired > 0 ? state.p_expired : undefined}
                                                setP_Claim={(data: number) => setState({ ...state, p_claim: data })}
                                                setP_Market={(data: number) => setState({ ...state, p_market: data })}
                                            ></ChartComponent>
                                            <svg
                                                className={`absolute lg:right-[34px] right-[32px] z-10`}
                                                width="10"
                                                height={500}
                                                viewBox="0 0 2 240"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <line
                                                    x1="1"
                                                    y1="3.5011e-08"
                                                    x2="0.999987"
                                                    y2="240"
                                                    stroke="#B2B7BC"
                                                    strokeWidth="150"
                                                    strokeDasharray="0.74 3.72"
                                                ></line>
                                            </svg>
                                        </Suspense>
                                    </div>
                                    {/*end body*/}

                                    {/*footer*/}
                                    {/* fill of time */}
                                    <div className={'flex flex-row justify-between items-center w-full mt-5 pl-[32px] pr-[32px]'}>
                                        {listTime.map((time, key) => {
                                            return (
                                                <div
                                                    key={key}
                                                    className={`${
                                                        selectTime == time ? 'text-[#EB2B3E]' : 'text-[#808890]'
                                                    } hover:cursor-pointer font-medium  text-base`}
                                                    onClick={() => {
                                                        setSelectTime(time)
                                                    }}
                                                >
                                                    {time}
                                                </div>
                                            )
                                        })}
                                    </div>
                                    {/*P-Claim*/}
                                    {
                                        <div className={'my-[24px] px-[32px] text-sm text-[#808890]'}>
                                            <span className={'flex flex-row items-center mr-[4px]'}>
                                                <span className={'mr-[8px]'}>P-Claim</span>
                                                <div data-tip={t('insurance:terminology:p_claim')} data-for={`p_claim`}>
                                                    <InfoCircle size={14} color={colors.txtSecondary} />
                                                    <Tooltip className="max-w-[200px]" id={'p_claim'} placement="right" />
                                                </div>
                                            </span>
                                            <div
                                                className={`mt-[8px] flex justify-between border-collapse rounded-[3px] shadow-none text-base ${
                                                    !errorPCalim && state.p_claim != 0 && 'border border-1 border-red'
                                                }`}
                                            >
                                                <Input
                                                    className={
                                                        'w-[90%] font-semibold appearance-none bg-[#F7F8FA] outline-none focus:ring-0 rounded-none shadow-none '
                                                    }
                                                    type={'number'}
                                                    inputName={'P-Claim'}
                                                    idInput={'iPClaim'}
                                                    value={state.p_claim}
                                                    onChange={(a: any) => {
                                                        if (Number(a.target.value) >= 1) {
                                                            setState({ ...state, p_claim: a.target.value.replace(/^0+/, '') })
                                                        } else {
                                                            setState({ ...state, p_claim: Number(a.target.value) })
                                                        }
                                                    }}
                                                    placeholder={`${menu[9].name}`}
                                                ></Input>
                                                <div className={'bg-[#F7F8FA] w-[10%] shadow-none flex items-center justify-end px-[16px]'}>{unitMoney}</div>
                                            </div>
                                            {!errorPCalim && state.p_claim != 0 && (
                                                <span className="flex flex-row text-[#E5544B] mt-[8px]">
                                                    <ErrorTriggersIcon /> <span className="pl-[6px]">{t('insurance:error:p_claim')}</span>
                                                </span>
                                            )}
                                        </div>
                                    }
                                </div>

                                {/* Period */}
                                <div className={'mt-5 pl-[32px] pr-[32px] pb-[32px] text-sm text-[#808890]'} data-tut="tour_period" id="tour_period">
                                    <span className="flex flex-row items-center">
                                        <span className={'mr-[8px]'}>Period ({menu[8].name})</span>
                                        <div data-tip={t('insurance:terminology:period')} data-for={`period`}>
                                            <InfoCircle size={14} color={colors.txtSecondary} />
                                            <Tooltip className="max-w-[200px]" id={'period'} placement="right" />
                                        </div>
                                    </span>
                                    <Tab.Group>
                                        <Tab.List
                                            className={`flex flex-row justify-between mt-[20px]  ${isMobile ? 'w-full' : 'w-[85%]'} ${
                                                isMobile && showCroll ? 'overflow-scroll' : ' overflow-hidden'
                                            }`}
                                            onTouchStart={() => {
                                                setShowCroll(true)
                                            }}
                                            onTouchEnd={() => {
                                                setShowCroll(false)
                                            }}
                                        >
                                            {listTabPeriod.map((item, key) => {
                                                return (
                                                    <div
                                                        key={key}
                                                        className={`${
                                                            state.period == item && 'bg-[#FFF1F2] text-[#EB2B3E]'
                                                        } bg-[#F7F8FA] rounded-[300px] p-3 h-[32px] w-[49px] flex justify-center items-center hover:cursor-pointer ${
                                                            isMobile && !(item == 15) && 'mr-[12px]'
                                                        }`}
                                                        onClick={() => setState({ ...state, period: item })}
                                                    >
                                                        {item}
                                                    </div>
                                                )
                                            })}
                                        </Tab.List>
                                    </Tab.Group>
                                </div>
                            </div>
                        )
                    }

                    {/*Only Show Claim And Margin*/}
                    {index == 1 && (
                        <div
                            className={
                                'max-w-screen-md lg:max-w-screen-md xl:max-w-screen-lg m-auto flex flex-row justify-center items-center mt-[24px] hover:cursor-default z-50'
                            }
                            onClick={() => {
                                setDrop(false)
                                setChosing(false)
                            }}
                        >
                            <div
                                className={`${
                                    tab == 4 ? 'hidden' : ''
                                } flex flex-row justify-between items-center w-[33%] rounded-[12px] border border-[#E5E7E8] border-0.5 px-[24px] py-[16px]`}
                            >
                                <div className={'text-[#808890] flex flex-row items-center'}>
                                    <span className={'mr-[8px]'}>R-Claim</span>
                                    <div data-tip={t('insurance:terminology:r_claim')} data-for={`r_claim`}>
                                        <InfoCircle size={14} color={colors.txtSecondary} />
                                        <Tooltip className="max-w-[200px]" id={'r_claim'} placement="right" />
                                    </div>
                                </div>
                                <div className={'font-semibold'}>
                                    <span>{state?.r_claim > 0 ? Number(formatNumber(state?.r_claim, 2)) : 0}%</span>
                                </div>
                            </div>
                            <div
                                className={`${
                                    tab == 5 ? 'hidden' : ''
                                } flex flex-row justify-between items-center w-[33%] rounded-[12px] border border-[#E5E7E8] border-0.5 px-[24px] py-[16px] mx-[8px] xl:mx-[12px]`}
                            >
                                <div className={'text-[#808890] flex flex-row items-center'}>
                                    <span className={'mr-[8px]'}>Q-Claim</span>
                                    <div data-tip={t('insurance:terminology:q_claim')} data-for={`q_claim`}>
                                        <InfoCircle size={14} color={colors.txtSecondary} />
                                        <Tooltip className="max-w-[200px]" id={'q_claim'} placement="right" />
                                    </div>
                                </div>
                                <div className={'font-semibold flex flex-row justify-center items-center hover:cursor-pointer relative max-h-[24px]'}>
                                    {state.q_claim > 0 ? Number(formatNumber(state?.q_claim, 2)) : 0}
                                    <span className={'text-[#EB2B3E] pl-[8px]'}>{unitMoney}</span>
                                    <div className="relative">
                                        <Popover className="relative">
                                            <Popover.Button
                                                className={'my-[16px] text-[#22313F] underline hover:cursor-pointer '}
                                                onClick={() => setChangeUnit(!changeUnit)}
                                            >
                                                {!changeUnit ? <ChevronDown></ChevronDown> : <ChevronUp></ChevronUp>}
                                            </Popover.Button>
                                            <Popover.Panel
                                                className="flex flex-col text-[#22313F] absolute  top-[63px] right-[-15px] bg-white z-[100] rounded"
                                                style={{ boxShadow: '0px 3px 5px rgba(9, 30, 66, 0.2), 0px 0px 1px rgba(9, 30, 66, 0.31)' }}
                                            >
                                                {({ close }) => (
                                                    <div className="flex flex-col justify-center h-full ">
                                                        {['USDT', 'BUSD', 'USDC'].map((e, key) => {
                                                            return (
                                                                <div
                                                                    key={key}
                                                                    className={` py-[8px] px-[16px] hover:bg-[#F7F8FA]`}
                                                                    onClick={() => {
                                                                        setUnitMoney(e)
                                                                        setChangeUnit(false)
                                                                        close()
                                                                    }}
                                                                >
                                                                    <span>{e}</span>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                            </Popover.Panel>
                                        </Popover>
                                    </div>
                                </div>
                            </div>
                            <div
                                className={`${
                                    tab == 6 ? 'hidden' : ''
                                } flex flex-row justify-between items-center w-[33%] rounded-[12px] border border-[#E5E7E8] border-0.5 px-[24px] py-[16px] `}
                            >
                                <div className={'text-[#808890] flex flex-row items-center'}>
                                    <span className={'mr-[8px]'}>Margin</span>
                                    <div data-tip={t('insurance:terminology:margin')} data-for={`margin`}>
                                        <InfoCircle size={14} color={colors.txtSecondary} />
                                        <Tooltip className="max-w-[200px]" id={'margin'} placement="right" />
                                    </div>
                                </div>
                                <div className={'font-semibold flex flex-row items-center justify-center hover:cursor-pointer relative max-h-[24px]'}>
                                    {state.margin > 0 ? Number(formatNumber(state?.margin, 2)) : 0}
                                    <span className={'text-[#EB2B3E] pl-[8px]'}>{unitMoney}</span>
                                    <div className="relative">
                                        <Popover className="relative">
                                            <Popover.Button
                                                className={'my-[16px] text-[#22313F] underline hover:cursor-pointer '}
                                                onClick={() => setChangeUnit1(!changeUnit1)}
                                            >
                                                {!changeUnit1 ? <ChevronDown></ChevronDown> : <ChevronUp></ChevronUp>}
                                            </Popover.Button>
                                            <Popover.Panel
                                                className="flex flex-col text-[#22313F] absolute  top-[63px] right-[-15px] bg-white z-[100] rounded"
                                                style={{ boxShadow: '0px 3px 5px rgba(9, 30, 66, 0.2), 0px 0px 1px rgba(9, 30, 66, 0.31)' }}
                                            >
                                                {({ close }) => (
                                                    <div className="flex flex-col justify-center h-full ">
                                                        {['USDT', 'BUSD', 'USDC'].map((e, key) => {
                                                            return (
                                                                <div
                                                                    key={key}
                                                                    className={` py-[8px] px-[16px] hover:bg-[#F7F8FA]`}
                                                                    onClick={() => {
                                                                        setUnitMoney(e)
                                                                        setChangeUnit1(false)
                                                                        close()
                                                                    }}
                                                                >
                                                                    <span>{e}</span>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                            </Popover.Panel>
                                        </Popover>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {
                        //description
                        index == 1 && (
                            <div
                                className={'flex justify-center items-center mt-[24px] max-w-screen-layout 4xl:max-w-screen-3xl m-auto'}
                                onClick={() => {
                                    setDrop(false)
                                    setChosing(false)
                                }}
                            >
                                <CheckCircle></CheckCircle>
                                <span className={'font-semibold text-[#22313F] px-[4px]'}>
                                    {`${t('insurance:buy:saved')} `}
                                    <span className={'text-[#EB2B3E]'}>1,000 {unitMoney}</span> {t('insurance:buy:sub_saved')}
                                </span>
                            </div>
                        )
                    }

                    {/* the next level*/}
                    {index == 1 && (
                        <div
                            className={`flex flex-col justify-center items-center my-[48px] max-w-screen-layout 4xl:max-w-screen-3xl m-auto`}
                            onClick={() => {
                                setDrop(false)
                                setChosing(false)
                            }}
                        >
                            <button
                                className={`${
                                    clear ? 'bg-red text-white border border-red' : 'text-white bg-[#E5E7E8] border border-[#E5E7E8]'
                                }flex items-center justify-center rounded-lg px-auto py-auto font-semibold py-[12px] px-[148px]`}
                                onClick={() => {
                                    if (clear) {
                                        setIndex(2)
                                    }
                                }}
                                disabled={!clear}
                            >
                                {menu[11].name}
                            </button>
                            <Menu>
                                <Menu.Button data-tut="tour_custom" id="tour_custom" className={'my-[16px] text-[#00ABF9] underline hover:cursor-pointer'}>
                                    {menu[12].name}
                                </Menu.Button>
                                <Menu.Items
                                    className={'flex flex-col text-[#22313F]'}
                                    style={{ boxShadow: '0px 3px 5px rgba(9, 30, 66, 0.2), 0px 0px 1px rgba(9, 30, 66, 0.31)' }}
                                >
                                    <Menu.Item>
                                        {({ active }) => (
                                            <a
                                                className={`${active && 'bg-blue-500'}  py-[8px] pl-[16px] w-[300px] hover:bg-[#F7F8FA]`}
                                                onClick={() => {
                                                    setShowGuide(true)
                                                }}
                                            >
                                                <span>{t('insurance:buy:help1')}</span>
                                            </a>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <a
                                                className={`${active && 'bg-blue-500'}  py-[8px] pl-[16px] w-[300px] hover:bg-[#F7F8FA] hover:cursor-pointer`}
                                                onClick={() => {
                                                    setShowDetails(true)
                                                }}
                                            >
                                                <span>{t('insurance:buy:detailed_terminology')}</span>
                                            </a>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                            </Menu>
                        </div>
                    )}
                    {index == 2 && (
                        <AcceptBuyInsurance
                            state={state}
                            setState={setState}
                            menu={menu}
                            checkUpgrade={checkUpgrade}
                            setCheckUpgrade={setCheckUpgrade}
                            getPrice={getPrice}
                            handelSetActive={setActive}
                            setNoti={setNameNoti}
                            setRes={setRes}
                            setIndex={setIndex}
                            unit={unitMoney}
                        ></AcceptBuyInsurance>
                    )}
                </LayoutInsurance>
            </>
        ) : (
            <>
                {!wallet.account ? (
                    <>
                        {showDetails && <TerminologyModal isMobile={isMobile} visible={showDetails} onClose={() => setShowDetails(false)} t={t} />}
                        <div style={{ background: 'linear-gradient(180deg, rgba(244, 63, 94, 0.15) 0%, rgba(254, 205, 211, 0) 100%)' }}>
                            <div className="px-[16px] pt-[8px]" onClick={() => router.push('/home')}>
                                <XMark />
                            </div>
                            <div className="flex flex-col items-center px-[60px] pt-[8px]">
                                <img src={'/images/buyInsurance.png'} width="269" height="212" className="w-[269px] h-auto" />
                            </div>
                        </div>
                        <div className="flex flex-col items-center pt-[16px] text-[#22313F]">
                            <span className="text-xl font-semibold ">Nami Insurance</span>
                            <span className="text-center">
                                {t('insurance:mobile_login:sub_title1')} - {t('insurance:mobile_login:sub_title2')}
                            </span>
                        </div>
                        <div className="px-[24px] flex flex-col justify-center mt-[32px] mb-[49px]">
                            <div className="flex flex-row">
                                <div className="pr-[16px]">
                                    <BxDollarCircle />
                                </div>
                                <div className="flex flex-col pr-[7px]">
                                    <span className="text-[#22313F] text-sm font-semibold">{t('insurance:mobile_login:token')}</span>
                                    <span className="text-sm text-[#808890]">{t('insurance:mobile_login:token_detail')}</span>
                                </div>
                            </div>
                            <div className="flex flex-row my-[24px]">
                                <div className="pr-[16px]">
                                    <BxLineChartDown />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[#22313F] text-sm font-semibold">{t('insurance:mobile_login:p_claim')}</span>
                                    <span className="text-sm text-[#808890]">{t('insurance:mobile_login:p_claim_detail')}</span>
                                </div>
                            </div>
                            <div className="flex flex-row">
                                <div className="pr-[16px]">
                                    <BxCaledarCheck />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[#22313F] text-sm font-semibold">{t('insurance:mobile_login:period')}</span>
                                    <span className="text-sm text-[#808890]">{t('insurance:mobile_login:period_detial')}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center mb-[16px]">
                            <Button
                                variants={'primary'}
                                className={`bg-[#EB2B3E] text-sm font-semibold h-[48px] w-[95%] tiny:w-[374px] flex justify-center items-center text-white rounded-[8px] py-[12px]`}
                                onClick={() => {
                                    Config.connectWallet()
                                }}
                            >
                                {t('insurance:mobile_login:connect_wallet')}
                            </Button>
                        </div>
                        <div
                            className={` hover:cursor-pointer flex justify-center text-[#EB2B3E] text-[14px] line-height-[19px] underline`}
                            onClick={() => {
                                setShowDetails(true)
                            }}
                        >
                            <span>{t('insurance:buy:detailed_terminology')}</span>
                        </div>
                    </>
                ) : (
                    <>
                        {showDetails && <TerminologyModal isMobile={isMobile} visible={showDetails} onClose={() => setShowDetails(false)} t={t} />}
                        {index == 1 && <Guide start={showGuide} setStart={setShowGuide} />}

                        {showChangeUnit.isShow && (
                            <Modal
                                portalId="modal"
                                isVisible={true}
                                className=" bg-white absolute bottom-0 rounded-none translate-y-0 h-max"
                                onBackdropCb={() => setShowChangeUnit({ ...showChangeUnit, isShow: false, name: '' })}
                            >
                                <div className={` bg-white text-sm  mx-auto `}>
                                    <div className="flex flex-col justify-center my-[24px]">
                                        <div className="font-medium text-xl">{showChangeUnit.name}</div>
                                        <div className="mt-[32px] divide-y divide-[#E5E7E8] text-[#22313F] w-full">
                                            {['USDT', 'USDC', 'BUSD'].map((item, key) => {
                                                return (
                                                    <div
                                                        key={key}
                                                        className="w-full flex flex-row justify-between items-center hover:bg-[#F2F3F5] hover:pl-[8px]"
                                                        onClick={() => {
                                                            setUnitMoney(item)
                                                            setShowChangeUnit({ ...showChangeUnit, isShow: false, name: '' })
                                                        }}
                                                    >
                                                        <span className="py-[24px]">{item}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </Modal>
                        )}
                        {openChangeToken && (
                            <Modal
                                portalId="modal"
                                isVisible={true}
                                className=" bg-white absolute bottom-0 rounded-none translate-y-0"
                                onBackdropCb={() => setOpenChangeToken(false)}
                            >
                                <div className="bg-white h-[50%] w-full flex flex-col z-50 text-sm">
                                    <div className="font-semibold text-xl my-[24px]">{t('insurance:buy:asset')}</div>
                                    <div>
                                        {listCoin &&
                                            listCoin.map((coin, key) => {
                                                let isPress = false

                                                // @ts-ignore
                                                return !coin.disable ? (
                                                    <div
                                                        id={`${coin.id}`}
                                                        key={key}
                                                        onMouseDown={() => (isPress = true)}
                                                        onMouseUp={() => {
                                                            isPress = false
                                                            setSelectedCoin(coin)
                                                            setState({ ...state, symbol: { ...coin } })
                                                            setOpenChangeToken(false)
                                                        }}
                                                        className={`${
                                                            isPress ? 'bg-[#F2F3F5]' : 'hover:bg-[#F7F8FA]'
                                                        } flex flex-row justify-start w-full items-center p-3 font-medium`}
                                                    >
                                                        <img alt={''} src={`${coin.icon}`} width="24" height="24" className={'mr-[12px] rounded-[50%]'}></img>
                                                        <div className={'flex flex-row justify-between w-full'}>
                                                            <span className={'hover:cursor-default'}>{coin.name}</span>
                                                            {coin.id === selectCoin.id ? <Check size={18} className={'text-[#EB2B3E]'}></Check> : ''}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <a
                                                        id={`${coin.id}`}
                                                        key={key}
                                                        className={`hover:bg-[#F7F8FA] flex flex-row justify-start w-full items-center p-3 text-[#E5E7E8] font-medium`}
                                                    >
                                                        <img
                                                            alt={''}
                                                            src={`${coin.icon}`}
                                                            width="24"
                                                            height="24"
                                                            className={'mr-[12px] rounded-[50%] grayscale hover:cursor-default'}
                                                        ></img>
                                                        <div className={'flex flex-row justify-between w-full'}>
                                                            <span>{coin.name}</span>
                                                            {coin.id === selectCoin.id ? <Check size={18} className={'text-[#EB2B3E]'}></Check> : ''}
                                                        </div>
                                                    </a>
                                                )
                                            })}
                                    </div>
                                </div>
                            </Modal>
                        )}
                        {active && (
                            <Modal
                                portalId="modal"
                                isVisible={true}
                                onBackdropCb={() => {}}
                                className="!rounded-[0px] bg-white w-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-0"
                            >
                                <NotificationInsurance
                                    id={res ? res.data._id : ''}
                                    name={`${nameNoti}`}
                                    state={state}
                                    active={active}
                                    setActive={() => {
                                        setActive(false)
                                    }}
                                    isMobile={false}
                                />
                            </Modal>
                        )}
                        {index == 1 && (
                            //sticky
                            <div className={`h-[32px] flex flex-row justify-between items-center mx-[16px] mt-[24px] mb-[16px]  top-0 bg-white z-50`}>
                                <div
                                    onClick={() => {
                                        router.push('/home')
                                    }}
                                >
                                    <XMark></XMark>
                                </div>
                                <div data-tut="tour_custom" id="tour_custom" className={`h-[32px] flex flex-row mx-[16px]`}>
                                    <span
                                        className={'text-[#00ABF9] underline hover:cursor-pointer pr-[16px] flex items-center'}
                                        onClick={() => {
                                            setShowGuideModal(true)
                                        }}
                                    >
                                        {t('insurance:buy:help_short')}
                                    </span>

                                    <GuidelineModal
                                        visible={showGuideModal}
                                        onClose={() => setShowGuideModal(false)}
                                        t={t}
                                        onShowTerminologyModal={() => setShowDetails(true)}
                                        onShowGuildline={() => setShowGuide(true)}
                                    />
                                    <div className="flex items-center">
                                        <Switch
                                            checked={tab == 6 ? true : false}
                                            onChange={() => {
                                                tab == 6 ? setTab(3) : setTab(6)
                                            }}
                                            className={`${
                                                tab == 6 ? 'bg-[#EB2B3E]' : 'bg-[#F2F3F4]'
                                            } relative inline-flex items-center h-[16px] rounded-full w-[32px] transition-colors shadow-sm`}
                                        >
                                            <span
                                                className={`${
                                                    tab == 6 ? 'translate-x-[1.25rem] bg-[white]' : 'translate-x-1 bg-[#B2B7BC]'
                                                } inline-block w-[6px] h-[6px] transform bg-white rounded-full transition-transform text-white/[0]`}
                                            >
                                                {tab == 6 ? 'Enable' : 'Disable'}
                                            </span>
                                        </Switch>
                                        <span className="pl-[8px]">{t('insurance:buy:change')}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {index == 1 && (
                            <div
                                data-tut="tour_statistics"
                                id="tour_statistics"
                                className=" my-[24px] w-full mx-auto flex flex-wrap flex-col justify-center content-center font-bold text-2xl relative "
                            >
                                <div>
                                    <span>{t('insurance:buy:buy_covered')} </span>{' '}
                                    <span
                                        className="text-[#EB2B3E]"
                                        onClick={() => {
                                            setOpenChangeToken(true)
                                        }}
                                    >
                                        {selectCoin.name}
                                    </span>
                                </div>
                                <div className="flex flex-row overflow-clip">
                                    <span className="pr-[4px]">{t('insurance:buy:quality')} </span>{' '}
                                    <label
                                        className={`${
                                            state.q_covered && state.q_covered > 0 ? 'text-[#EB2B3E]' : 'text-[#B2B7BC]'
                                        } max-w-[245] relative ml-[6xp] `}
                                    >
                                        {state.q_covered > 0 ? Number(state.q_covered) : 'Số tiền?'}
                                        <input
                                            type="number"
                                            className={` text-white pl-[4px] focus-visible:outline-none w-0 border border-1 border-black ${
                                                openChangeToken && 'opacity-0'
                                            } `}
                                            placeholder="Số tiền?"
                                            value={state.q_covered != undefined ? Number(state.q_covered) : 'Số tiền?'}
                                            name="name"
                                            id="name"
                                            onChange={(a: any) => {
                                                if (Number(a.target.value) >= 1) {
                                                    setState({ ...state, p_claim: a.target.value.replace(/^0+/, '') })
                                                } else {
                                                    setState({ ...state, p_claim: Number(a.target.value) })
                                                }
                                                setPercentInsurance(0)
                                            }}
                                        ></input>
                                    </label>{' '}
                                    <span className="text-[#EB2B3E]">{selectCoin.type}</span>
                                </div>
                                {tab == 6 && (
                                    <div>
                                        <span>{t('insurance:buy:title_change_margin')}</span>{' '}
                                        <label className={`${state.margin == 0 ? 'text-[#B2B7BC]' : 'text-[#EB2B3E]'} max-w-[245] relative ml-[6xp]`}>
                                            {state.margin > 0 ? Number(state.margin) : 'Số tiền?'}
                                            <input
                                                type="number"
                                                className={` text-white pl-[4px] focus-visible:outline-none w-0 border border-1 border-black`}
                                                placeholder="Số tiền?"
                                                value={state.margin > 0 ? Number(state.margin) : 'Số tiền?'}
                                                name="name"
                                                id="name"
                                                onChange={(a: any) => {
                                                    if (Number(a.target.value) >= 1) {
                                                        setState({
                                                            ...state,
                                                            margin: a.target.value.replace(/^0+/, ''),
                                                            percent_margin: Number(a.target.value / (state.q_covered * state.p_market)),
                                                        })
                                                    } else {
                                                        setState({
                                                            ...state,
                                                            margin: Number(a.target.value),
                                                            percent_margin: Number(a.target.value / (state.q_covered * state.p_market)),
                                                        })
                                                    }
                                                }}
                                            ></input>
                                        </label>{' '}
                                        <span
                                            className="text-[#EB2B3E]"
                                            onClick={() => setShowChangeUnit({ ...showChangeUnit, isShow: true, name: `${t('insurance:unit:margin')}` })}
                                        >
                                            {unitMoney}
                                        </span>
                                    </div>
                                )}
                                {state.q_covered > userBalance && (
                                    <div className="text-[#E5544B] text-xs flex items-center">
                                        <div className="mr-[8px]">
                                            <ErrorTriggersIcon />
                                        </div>
                                        <div>Số dư không đủ</div>
                                    </div>
                                )}
                            </div>
                        )}
                        {index == 1 && (
                            <div data-tut="tour_chart" id="tour_chart" className="">
                                <div className={'px-[32px] flex flex-row relative'}>
                                    <Suspense fallback={`Loading...`}>
                                        <ChartComponent
                                            data={dataChart}
                                            state={state ? state : null}
                                            p_claim={Number(state && state.p_claim)}
                                            p_expired={state.p_expired > 0 ? state.p_expired : undefined}
                                            setP_Claim={(data: number) => setState({ ...state, p_claim: data })}
                                            setP_Market={(data: number) => setState({ ...state, p_market: data })}
                                            isMobile={isMobile}
                                        ></ChartComponent>
                                    </Suspense>
                                    <svg
                                        className={`absolute lg:right-[34px] right-[32px] z-10`}
                                        width="10"
                                        height={500}
                                        viewBox="0 0 2 240"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <line
                                            x1="1"
                                            y1="3.5011e-08"
                                            x2="0.999987"
                                            y2="240"
                                            stroke="#B2B7BC"
                                            strokeWidth="150"
                                            strokeDasharray="0.74 3.72"
                                        ></line>
                                    </svg>
                                </div>
                                <div className={'flex flex-row justify-between items-center w-full mt-5 pl-[32px] pr-[32px]'}>
                                    {listTime.map((time, key) => {
                                        return (
                                            <div
                                                key={key}
                                                className={`${
                                                    selectTime == time ? 'text-[#EB2B3E]' : 'text-[#808890]'
                                                } hover:cursor-pointer font-medium  text-base`}
                                                onClick={() => {
                                                    setSelectTime(time)
                                                }}
                                            >
                                                {time}
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className={'my-[24px] px-[32px]'}>
                                    <span className={'flex flex-row items-center '}>
                                        <span className={'mr-[6px] text-[#808890] text-sm'}>P-Claim</span>
                                        <div data-tip={t('insurance:terminology:p_claim')} data-for={`p_claim`}>
                                            <InfoCircle size={14} color={colors.txtSecondary} />
                                            <Tooltip className="max-w-[200px]" id={'p_claim'} placement="right" />
                                        </div>
                                    </span>
                                    <div
                                        className={`mt-[8px] flex justify-between border-collapse rounded-[3px] shadow-none ${
                                            !clear && 'border border-1 border-red'
                                        }`}
                                    >
                                        <Input
                                            className={'w-[90%] font-semibold appearance-none bg-[#F7F8FA] outline-none focus:ring-0 rounded-none shadow-none '}
                                            type={'number'}
                                            inputName={'P-Claim'}
                                            idInput={'iPClaim'}
                                            value={state.p_claim}
                                            onChange={(a: any) => {
                                                if (Number(a.target.value) >= 1) {
                                                    setState({
                                                        ...state,
                                                        p_claim: a.target.value.replace(/^0+/, ''),
                                                    })
                                                } else {
                                                    setState({
                                                        ...state,
                                                        p_claim: Number(a.target.value),
                                                    })
                                                }
                                            }}
                                            placeholder={`${menu[9].name}`}
                                        ></Input>
                                        <div className={'bg-[#F7F8FA] text-[#B2B7BC] w-[10%] shadow-none flex items-center justify-end px-[16px]'}>
                                            {unitMoney}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Period */}
                        {index == 1 && (
                            <div data-tut="tour_period" id="tour_period" className={'mt-5 pl-[32px] pr-[32px] pb-[32px] text-sm text-[#808890]'}>
                                <span className="flex flex-row items-center">
                                    <span className={'mr-[8px]'}>Period ({menu[8].name})</span>
                                    <div data-tip={t('insurance:terminology:period')} data-for={`period`}>
                                        <InfoCircle size={14} color={colors.txtSecondary} />
                                        <Tooltip className="max-w-[200px]" id={'period'} placement="right" />
                                    </div>
                                </span>
                                <Tab.Group>
                                    <Tab.List
                                        className={`flex flex-row justify-between mt-[20px]  ${isMobile ? 'w-full' : 'w-[85%]'} ${
                                            isMobile && showCroll ? 'overflow-scroll' : ' overflow-hidden'
                                        }`}
                                        onTouchStart={() => {
                                            setShowCroll(true)
                                        }}
                                        onTouchEnd={() => {
                                            setShowCroll(false)
                                        }}
                                    >
                                        {listTabPeriod.map((item, key) => {
                                            return (
                                                <div
                                                    key={key}
                                                    className={`${
                                                        state.period == item && 'bg-[#FFF1F2] text-[#EB2B3E]'
                                                    } bg-[#F7F8FA] rounded-[300px] p-3 h-[32px] w-[49px] flex justify-center items-center hover:cursor-pointer ${
                                                        isMobile && !(item == 15) && 'mr-[12px]'
                                                    }`}
                                                    onClick={() => setState({ ...state, period: item })}
                                                >
                                                    {item}
                                                </div>
                                            )
                                        })}
                                    </Tab.List>
                                </Tab.Group>
                            </div>
                        )}
                        {tab == 6 && index == 1 && (
                            <div className={'mt-5 pl-[32px] pr-[32px] pb-[32px]'}>
                                <span className={'flex flex-row items-center'}>
                                    <span className={'mr-[6px] text-[#808890] text-sm'}>Margin</span>
                                    <div data-tip={t('insurance:terminology:margin')} data-for={`margin`}>
                                        <InfoCircle size={14} color={colors.txtSecondary} />
                                        <Tooltip className="max-w-[200px]" id={'margin'} placement="right" />
                                    </div>
                                </span>
                                <Tab.Group>
                                    <Tab.List className={`flex flex-row justify-between mt-[20px]  ${isMobile ? 'overflow-scroll w-full' : 'w-[85%]'}`}>
                                        {[2, 5, 7, 10].map((item, key) => {
                                            return (
                                                <div
                                                    key={key}
                                                    className={`${
                                                        state.percent_margin == item && 'bg-[#FFF1F2] text-[#EB2B3E]'
                                                    } bg-[#F7F8FA] rounded-[300px] p-3 h-[32px] w-[49px] flex justify-center items-center hover:cursor-pointer ${
                                                        isMobile && !(item == 15) && 'mr-[24px]'
                                                    }`}
                                                    onClick={() =>
                                                        setState({
                                                            ...state,
                                                            percent_margin: item,
                                                            margin: Number((item * state.q_covered * state.p_market) / 100),
                                                        })
                                                    }
                                                >
                                                    {item}%
                                                </div>
                                            )
                                        })}
                                    </Tab.List>
                                </Tab.Group>
                            </div>
                        )}
                        {index == 1 && (
                            <div
                                onClick={() => {
                                    setDrop(false)
                                    setChosing(false)
                                }}
                                className={`${clear ? 'visible' : 'invisible'}`}
                            >
                                <div className={'flex justify-center items-center mt-[24px]'}>
                                    <CheckCircle></CheckCircle>
                                    <span className={'text-sm text-[#22313F] px-[4px] font-semibold'}>
                                        {t('insurance:buy:saved')}
                                        <span className={'text-[#EB2B3E]'}> 1,000 {unitMoney}</span> {t('insurance:buy:sub_saved')}
                                    </span>
                                </div>
                                <div className={'flex flex-col mt-[24px] hover:cursor-default'}>
                                    <div
                                        className={`${
                                            tab == 4 ? 'hidden' : ''
                                        } flex flex-row justify-between items-center rounded-[12px] px-[24px] py-[16px] mx-[12px]`}
                                    >
                                        <div className={'text-[#808890] flex flex-row items-center'}>
                                            <span className={'mr-[8px]'}>R-Claim</span>
                                            <div data-tip={t('insurance:terminology:r_claim')} data-for={`r_claim`}>
                                                <InfoCircle size={14} color={colors.txtSecondary} />
                                                <Tooltip className="max-w-[200px]" id={'r_claim'} placement="right" />
                                            </div>
                                        </div>
                                        <div className={'font-semibold'}>
                                            <span>{state?.r_claim > 0 ? Number(formatNumber(state?.r_claim, 2)) : 0}%</span>
                                        </div>
                                    </div>
                                    <div
                                        className={`${
                                            tab == 5 ? 'hidden' : ''
                                        } flex flex-row justify-between items-center rounded-[12px] px-[24px] py-[16px] mx-[12px]`}
                                    >
                                        <div className={'text-[#808890] flex flex-row items-center'}>
                                            <span className={'mr-[8px]'}>Q-Claim</span>
                                            <div data-tip={t('insurance:terminology:q_claim')} data-for={`q_claim`}>
                                                <InfoCircle size={14} color={colors.txtSecondary} />
                                                <Tooltip className="max-w-[200px]" id={'q_claim'} placement="right" />
                                            </div>
                                        </div>
                                        <div className={'font-semibold flex flex-row hover:cursor-pointer relative'}>
                                            {state.q_claim > 0 ? Number(formatNumber(state.q_claim, 2)) : 0}
                                            <span
                                                className={'text-[#EB2B3E] pl-[8px]'}
                                                onClick={() => setShowChangeUnit({ ...showChangeUnit, isShow: true, name: `${t('insurance:unit:q_claim')}` })}
                                            >
                                                {unitMoney}
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                        className={`${
                                            tab == 6 ? 'hidden' : ''
                                        } flex flex-row justify-between items-center rounded-[12px] px-[24px] py-[16px] mx-[12px]`}
                                    >
                                        <div className={'text-[#808890] flex flex-row items-center'}>
                                            <span className={'mr-[8px]'}>Margin</span>
                                            <div data-tip={t('insurance:terminology:margin')} data-for={`margin`}>
                                                <InfoCircle size={14} color={colors.txtSecondary} />
                                                <Tooltip className="max-w-[200px]" id={'margin'} placement="right" />
                                            </div>
                                        </div>
                                        <div className={'font-semibold flex flex-row hover:cursor-pointer'}>
                                            {state.margin > 0 ? Number(formatNumber(state.margin, 2)) : 0}

                                            <span
                                                className={'text-[#EB2B3E] pl-[8px]'}
                                                onClick={() => setShowChangeUnit({ ...showChangeUnit, isShow: true, name: `${t('insurance:unit:margin')}` })}
                                            >
                                                {unitMoney}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`flex flex-col justify-center items-center mb-[32px]`}>
                                    <button
                                        className={`${
                                            clear ? 'bg-red text-white border border-red' : 'text-white bg-[#E5E7E8] border border-[#E5E7E8]'
                                        }flex items-center justify-center rounded-lg px-auto py-auto font-semibold py-[12px] px-[148px]`}
                                        onClick={() => {
                                            if (clear) {
                                                setIndex(2)
                                            }
                                        }}
                                        disabled={!clear}
                                    >
                                        {menu[11].name}
                                    </button>
                                </div>
                            </div>
                        )}
                        {index == 2 && (
                            <AcceptBuyInsurance
                                state={state}
                                setState={setState}
                                menu={menu}
                                checkUpgrade={checkUpgrade}
                                setCheckUpgrade={setCheckUpgrade}
                                getPrice={getPrice}
                                handelSetActive={setActive}
                                setNoti={setNameNoti}
                                setRes={setRes}
                                setIndex={setIndex}
                                unit={unitMoney}
                            ></AcceptBuyInsurance>
                        )}
                    </>
                )}
            </>
        )
    ) : (
        <></>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'insurance', 'home'])),
    },
})

export const fetchApiNami = async (symbol: string, from: string, to: string, resolution: string, setDataChart: any) => {
    try {
        const response = await fetch(
            'https://datav2.nami.exchange/api/v1/chart/history?' +
                'broker=NAMI_SPOT' +
                '&symbol=' +
                symbol +
                '&from=' +
                from +
                '&to=' +
                to +
                '&resolution=' +
                resolution,
        )
        let list = await response.json()
        let data: { date: number; value: any }[] = []
        list.map((item: any) => {
            data.push({
                date: item[0] * 1000,
                value: item[1],
            })
        })
        data.length > 0 && setDataChart(data)
    } catch (err) {
        console.log('fecth current price error')
    }
}

export const getPrice = async (symbol: string, state: any, setState: any) => {
    try {
        const { data } = await axios.get(`https://test.nami.exchange/api/v3/spot/market_watch?symbol=${symbol}`)

        if (data) {
            if (data.data[0]) {
                return setState({ ...state, p_market: data.data[0]?.p })
            }
        }
    } catch (err) {
        console.log('fecth current price error')
    }
}

export const getPriceOnly = async (symbol: string) => {
    try {
        const { data } = await axios.get(`https://test.nami.exchange/api/v3/spot/market_watch?symbol=${symbol}`)
        if (data) {
            if (data.data[0]) {
                return data.data[0]?.p
            }
        }
    } catch (err) {
        console.log('fecth current price error')
    }
}

export const getPriceBNBUSDT = async (setPriceBNB: any) => {
    try {
        const { data } = await axios.get(`https://test.nami.exchange/api/v3/spot/market_watch?symbol=BNBUSDT`)

        if (data) {
            if (data.data[0]) {
                return setPriceBNB(data.data[0].p)
            }
        }
    } catch (err) {
        console.log('fecth current price error')
    }
}

const GuidelineModal = ({ visible, onClose, t, onShowTerminologyModal, onShowGuildline }: any) => {
    return (
        <Modal isMobile containerClassName="flex-col justify-end" isVisible={visible} onBackdropCb={onClose}>
            <div className="text-xl leading-8 font-semibold mb-6">{t('insurance:guild:title')}</div>
            <div className="flex flex-col text-sm divide-solid divide-y divide-divider">
                <div
                    onClick={() => {
                        onShowGuildline()
                        onClose()
                    }}
                    className="py-4"
                >
                    {t('insurance:buy:help1')}
                </div>
                <div
                    onClick={() => {
                        onShowTerminologyModal()
                        onClose()
                    }}
                    className="py-4"
                >
                    {t('insurance:buy:detailed_terminology')}
                </div>
            </div>
        </Modal>
    )
}

const TerminologyModal = ({ visible, onClose, t, isMobile }: any) => {
    const [tab, setTab] = useState<number>(0)
    const terms = [
        {
            title: 'Q-Covered',
            description: t('insurance:terminology:q_covered'),
        },
        {
            title: 'P-Market',
            description: t('insurance:terminology:p_market'),
        },
        {
            title: 'P-Claim',
            description: t('insurance:terminology:p_claim'),
        },
        {
            title: 'P-Expired',
            description: t('insurance:terminology:p_expired'),
        },
        {
            title: 'P-Refund',
            description: t('insurance:terminology:p_refund'),
        },
        {
            title: 'Period',
            description: t('insurance:terminology:period'),
        },
        {
            title: 'R-Claim',
            description: t('insurance:terminology:r_claim'),
        },
        {
            title: 'Q-Claim',
            description: t('insurance:terminology:q_claim'),
        },
        {
            title: 'Margin',
            description: t('insurance:terminology:margin'),
        },
        {
            title: 'T-Start',
            description: t('insurance:terminology:t_start'),
        },
        {
            title: 'T-Expired',
            description: t('insurance:terminology:t_expired'),
        },
    ]
    const terms1 = [
        {
            title: t('common:status:available'),
            description: t('common:status:explain:available'),
            class: 'py-[6px] px-[12px] rounded-[600px] mr-[24px] text-center bg-[#00A5FF]/[0.1] text-[#3960E5]',
        },
        {
            title: t('common:status:claim_waiting'),
            description: t('common:status:explain:claim_waiting'),
            class: 'py-[6px] px-[12px] rounded-[600px] mr-[24px] text-center bg-[#FBCD2D]/[0.1] text-[#FBCD2D]',
        },
        {
            title: t('common:status:expired'),
            description: t('common:status:explain:expired'),
            class: 'py-[6px] px-[12px] rounded-[600px] mr-[24px] text-center bg-[#20C9AC]/[0.1] text-[#52CC74]',
        },
        {
            title: t('common:status:claimed'),
            description: t('common:status:explain:claimed'),
            class: 'py-[6px] px-[12px] rounded-[600px] mr-[24px] text-center bg-[#20C9AC]/[0.1] text-[#52CC74]',
        },
        {
            title: t('common:status:refunded'),
            description: t('common:status:explain:refunded'),
            class: 'py-[6px] px-[12px] rounded-[600px] mr-[24px] text-center bg-[#B6B4BA]/[0.1] text-[#B2B7BC]',
        },
        {
            title: t('common:status:liquidated'),
            description: t('common:status:explain:liquidated'),
            class: 'py-[6px] px-[12px] rounded-[600px] mr-[24px] text-center bg-[#B6B4BA]/[0.1] text-[#B2B7BC]',
        },
    ]

    // const optionsState = useMemo(() => {
    //     return Object.keys(stateInsurance).reduce((acc: any[], key: string) => {
    //         const _key = String(key).toLowerCase()
    //         acc.push({ title: t(`common:status:${_key}`), description: t(`common:status:explain:${_key}`) })
    //         return acc
    //     }, [])
    // }, [])

    return (
        <Modal isMobile={isMobile} isVisible={visible} onBackdropCb={onClose} wrapClassName="!p-6" className={'max-w-[424px]'} containerClassName="z-[100]">
            <div className="text-xl font-medium mb-6 text-center">{t('insurance_history:detailed_terminology')}</div>

            <Tabs tab={tab} className="mb-6 text-sm">
                <TabItem active={tab === 0} onClick={() => setTab(0)}>
                    Thuật ngữ bảo hiểm
                </TabItem>
                <TabItem active={tab === 1} onClick={() => setTab(1)}>
                    Trạng thái hợp đồng
                </TabItem>
            </Tabs>
            <div className="flex flex-col text-sm divide-solid divide-y divide-divider max-h-[70vh] overflow-auto -mx-6 px-6">
                {[...(tab === 0 ? terms : terms1)].map((item: any, index: number) => (
                    <div key={index} className="py-3 flex items-center">
                        <div className={`whitespace-nowrap min-w-[30%] ${item?.class}`}>{item.title}</div>
                        <div>{item.description}</div>
                    </div>
                ))}
            </div>
        </Modal>
    )
}

const Tabs = styled.div.attrs({
    className: 'mt-6 text-sm flex items-center justify-between h-11 relative',
})<any>`
    &:after {
        content: '';
        position: absolute;
        height: 2px;
        background-color: ${() => colors.red.red};
        transform: ${({ tab }) => `translate(${tab * 100}%,0)`};
        width: calc(100% / 2);
        transition: all 0.2s;
        bottom: -1px;
    }
`

const TabItem = styled.div.attrs<any>(({ active }) => ({
    className: classnames('px-4 py-3 font-medium whitespace-nowrap border-b-[2px] border-divider', { 'text-red': active }),
}))<any>``

export default InsuranceFrom
