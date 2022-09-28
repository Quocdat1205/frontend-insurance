import dynamic from 'next/dynamic'
import LayoutInsurance from 'components/layout/layoutInsurance'
import useWeb3Wallet from 'hooks/useWeb3Wallet'
import Button from 'components/common/Button/Button'
import axios from 'axios'
import { Menu, Popover, Switch, Tab } from '@headlessui/react'
import { ICoin } from 'components/common/Input/input.interface'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircle, InfoCircle, XMark, BxDollarCircle, BxLineChartDown, BxCaledarCheck } from 'components/common/Svg/SvgIcon'
import { ChevronDown, Check, ChevronUp, ArrowLeft } from 'react-feather'
import { useTranslation } from 'next-i18next'
import useWindowSize from 'hooks/useWindowSize'
import { screens } from 'utils/constants'
import { Suspense } from 'react'
import { RootStore, useAppSelector } from 'redux/store'
import Config from 'config/config'
import Modal from 'components/common/Modal/Modal'
import Tooltip from 'components/common/Tooltip/Tooltip'
import { ethers } from 'ethers'
import colors from 'styles/colors'
import GlossaryModal from 'components/screens/Glossary/GlossaryModal'
import InputNumber from 'components/common/Input/InputNumber'
import HeaderContent from './HeaderContent'
import fetchApi from 'services/fetch-api'
import { API_GET_PRICE_CHART } from 'services/apis'
import { countDecimals } from 'utils/utils'

const Guide = dynamic(() => import('components/screens/Insurance/Guide'), {
    ssr: false,
})
//chart
const ChartComponent = dynamic(() => import('components/screens/Insurance/chartComponent'), { ssr: false, suspense: true })

const InsuranceFrom = () => {
    const {
        t,
        i18n: { language },
    } = useTranslation()
    const wallet = useWeb3Wallet()
    const router = useRouter()
    const { width, height } = useWindowSize()
    const isMobile = width && width <= screens.drawer
    const assetsToken = useAppSelector((state: RootStore) => state.setting.assetsToken)
    const pairConfigs = useAppSelector((state: RootStore) => state.setting.pairConfigs)
    const account = useAppSelector((state: RootStore) => state.setting.account)

    const [selectTime, setSelectTime] = useState<string>('ALL')
    const clear = useRef<boolean>(false)
    const percentInsurance = useRef<number>(0)
    const percentMargin = useRef<number>(8)

    const [index, setIndex] = useState<1 | 2>(1)
    const [tab, setTab] = useState<number>(0)
    const [loadings, setLoadings] = useState(true)
    const [openChangeToken, setOpenChangeToken] = useState(false)
    const [showDetails, setShowDetails] = useState(false)
    const [unitMoney, setUnitMoney] = useState('USDT')
    const [changeUnit2, setChangeUnit2] = useState<boolean>(false)
    const [showCroll, setShowCroll] = useState(false)
    const [showGuide, setShowGuide] = useState<boolean>(false)
    const [chosing, setChosing] = useState(false)
    const [showGuideModal, setShowGuideModal] = useState<boolean>(false)
    const [thisFisrt, setThisFisrt] = useState(true)
    const [saved, setSaved] = useState<number>(0)
    const [rangeQ_covered, setRangeQ_covered] = useState({
        min: 0,
        max: 100,
    })
    const [showInput, setShowInput] = useState<{ isShow: boolean; name: string }>({ isShow: false, name: '' })

    const [showChangeUnit, setShowChangeUnit] = useState({
        isShow: false,
        name: '',
    })
    const [userBalance, setUserBalance] = useState<number>(0)
    const [listCoin, setListCoin] = useState<ICoin[]>([])
    const [pair_configs, setPairConfigs] = useState<any>({})
    const [decimalList, setDecimalList] = useState({
        decimal_q_covered: 2,
        decimal_margin: 0,
        decimal_p_claim: 0,
    })
    const [selectCoin, setSelectedCoin] = useState<ICoin>({
        icon: '',
        id: '',
        name: '',
        symbol: '',
        type: '',
        disable: false,
    })
    const [state, setState] = useState({
        timeframe: 'ALL',
        margin: 0,
        percent_margin: 8,
        symbol: {
            icon: '',
            id: '',
            name: '',
            symbol: '',
            type: '',
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

    const [dataChart, setDataChart] = useState()
    const listTime = ['1H', '1D', '1W', '1M', '3M', '1Y', `${language === 'vi' ? 'Tất cả' : 'All'}`]
    const listTabPeriod: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    const menu = [
        { menuId: 'home', router: 'home', name: t('insurance:buy:home'), parentId: 0 },
        { menuId: 'buy_covered', router: 'insurance', name: t('insurance:buy:buy_covered'), parentId: 0 },
        { menuId: 'back_to_home', router: 'home', name: t('insurance:buy:back_to_home'), parentId: 0 },
        { menuId: 'default', name: t('insurance:buy:default'), parentId: 0 },
        { menuId: 'change_r_claim', name: t('insurance:buy:change_r_claim'), parentId: 0 },
        { menuId: 'change_q_claim', name: t('insurance:buy:change_q_claim'), parentId: 0 },
        { menuId: 'change_margin', name: t('insurance:buy:change_margin'), parentId: 0 },
        { menuId: 'q_covered', name: t('insurance:buy:q_covered') },
        { menuId: 'day', name: t('insurance:buy:day') },
        { menuId: 'example', name: t('insurance:buy:example') },
        { menuId: 'tooltip', name: t('insurance:buy:tooltip') },
        { menuId: 'continue', name: t('insurance:buy:continue') },
        { menuId: 'help', name: t('insurance:buy:help') },
    ]

    const Leverage = (p_market: number, p_stop: number) => {
        const leverage = Number(p_market / Math.abs(p_market - p_stop))
        return leverage < 1 ? 1 : leverage
    }

    const P_stop = (p_market: number, p_claim: number, hedge: number) => {
        const diffStopfutures = 0 / 100
        const ratio_min_profit = Math.abs(p_claim - p_market) / p_market / 2

        if (p_claim > p_market) {
            const p_stop = ((p_market - p_market * (hedge + ratio_min_profit - diffStopfutures)) * 100).toFixed(2)

            return Math.abs(Number(p_stop)) / 100
        } else {
            const p_stop = ((p_market + p_market * (hedge + ratio_min_profit - diffStopfutures)) * 100).toFixed(2)
            return Math.abs(Number(p_stop)) / 100
        }
    }

    const componentsInputMobile = () => {
        return (
            <div className="mx-[1rem] relative">
                <div>
                    {t('insurance:buy_mobile:q_covered')}
                    <label>
                        <span
                            id="label_q_coverd"
                            className="z-1 !w-max text-redPrimary"
                            onClick={() => {
                                setOpenChangeToken(true)
                            }}
                        >
                            {' '}
                            {width && width > 358 && <br />}
                            {state.q_covered}{' '}
                        </span>
                    </label>
                    <span
                        className="text-redPrimary z-1"
                        onClick={() => {
                            setOpenChangeToken(true)
                        }}
                    >
                        {selectCoin.type}{' '}
                    </span>
                    {state.p_claim > 0 && (
                        <>
                            {t('insurance:buy_mobile:at')} <span className="text-redPrimary">${state.p_claim} </span>
                            {tab != 6 && '?'}
                        </>
                    )}
                    {tab == 6 && (
                        <>
                            {t('insurance:buy_mobile:and')} {t('insurance:buy_mobile:margin')}{' '}
                            <label>
                                <span className="text-redPrimary">
                                    <span
                                        onClick={() => {
                                            setShowInput({ isShow: true, name: 'margin' })
                                        }}
                                    >
                                        {state.margin && state.margin}{' '}
                                    </span>
                                    <span
                                        onClick={() => {
                                            setShowInput({ isShow: true, name: 'margin' })
                                            // setShowChangeUnit({ ...showChangeUnit, isShow: true, name: `${t('insurance:unit:margin')}` })
                                        }}
                                    >
                                        {unitMoney}
                                    </span>
                                </span>
                            </label>
                            ?
                        </>
                    )}
                </div>
            </div>
        )
    }

    // useEffect(() => {
    //     if (loadings) {
    //         setTimeout(() => {
    //             setShowGuide(true)
    //         }, 1500)
    //     }
    // }, [loadings])

    const handleNext = () => {
        const query = {
            r_claim: Number(state.r_claim),
            q_claim: Number(state.q_claim),
            margin: Number(state.margin),
            period: Number(state.period),
            symbol: selectCoin?.type,
            unit: unitMoney,
            p_claim: Number(state.p_claim),
            tab: tab,
            q_covered: Number(state.q_covered),
            p_market: Number(state.p_market),
            decimalList: { ...decimalList },
        }
        localStorage.setItem('info_covered_state', JSON.stringify(query))
        return router.push('/buy-covered/info-covered')
    }

    const getBalaneToken = async (symbol: string) => {
        if (symbol === 'BNB') {
            const result = wallet.getBalance()
            return result.then((balance: number) => {
                setUserBalance(balance)
                return balance
            })
        }

        if (symbol === 'USDT') {
            const balanceUsdt = await wallet.contractCaller?.usdtContract.contract.balanceOf(account.address)

            if (balanceUsdt) {
                if (Number(ethers.utils.formatEther(balanceUsdt)) > 0) {
                    setUserBalance(Number((Number(ethers.utils.formatEther(balanceUsdt)) / Number(state.p_market)).toFixed(decimalList.decimal_q_covered)))
                    return Number(ethers.utils.formatEther(balanceUsdt))
                } else {
                    setUserBalance(0)
                    return 0
                }
            } else {
                return false
            }
        }

        if (symbol === 'ETH') {
            const balanceETH = await wallet.contractCaller?.ethContract.contract.balanceOf(account.address)
            if (balanceETH) {
                if (Number(ethers.utils.formatEther(balanceETH)) > 0) {
                    setUserBalance(Number((Number(ethers.utils.formatEther(balanceETH)) / Number(state.p_market)).toFixed(decimalList.decimal_q_covered)))
                    return Number(ethers.utils.formatEther(balanceETH))
                } else {
                    setUserBalance(0)
                    return 0
                }
            } else {
                return false
            }
        }
    }
    const setStorage = (value: any) => {
        localStorage.setItem('buy_covered_state', JSON.stringify(value))
        setThisFisrt(false)
    }

    const updateFormPercentMargin = (value: number) => {
        if (state.q_covered > 0) {
            percentMargin.current = value
            setState({
                ...state,
                percent_margin: value,
                margin: Number(((value / 100) * state.q_covered * state.p_market).toFixed(decimalList.decimal_margin)),
            })
        }
    }

    const getConfig = (symbol: string) => {
        if (pairConfigs) {
            const item = pairConfigs.find((i: any) => {
                return i.baseAsset === symbol
            })

            return setPairConfigs({ ...item })
        }
    }

    const getStorage = async () => {
        const data = await localStorage.getItem('buy_covered_state')
        if (data) {
            const res = JSON.parse(data)
            if (res) {
                return res
            } else {
                return false
            }
        }
        return false
    }

    const refreshApi = (
        selectTime: string | undefined,
        selectCoin: { id?: string; name?: string; icon?: string; disable?: boolean | undefined; symbol?: string; type: any },
    ) => {
        const timeEnd = new Date()
        const timeBegin = new Date()
        setLoadings(true)
        try {
            if (selectCoin.symbol !== '') {
                if (selectTime == '1H') {
                    timeBegin.setDate(timeEnd.getDate() - 10)
                    fetchApiNami(
                        `${selectCoin.type && selectCoin.type}${unitMoney}`,
                        `${Math.floor(timeBegin.getTime() / 1000)}`,
                        `${Math.ceil(timeEnd.getTime() / 1000)}`,
                        '1h',
                        setDataChart,
                        120,
                    )
                } else if (selectTime == '1W' || selectTime == '1D') {
                    timeBegin.setDate(timeEnd.getDate() - 10)
                    fetchApiNami(
                        `${selectCoin.type && selectCoin.type}${unitMoney}`,
                        `${Math.floor(timeBegin.getTime() / 1000)}`,
                        `${Math.ceil(timeEnd.getTime() / 1000)}`,
                        '1d',
                        setDataChart,
                        500,
                    )
                } else {
                    timeBegin.setDate(timeEnd.getDate() - 10)
                    fetchApiNami(
                        `${selectCoin.type && selectCoin.type}${unitMoney}`,
                        `${Math.floor(timeBegin.getTime() / 1000)}`,
                        `${Math.ceil(timeEnd.getTime() / 1000)}`,
                        '1d',
                        setDataChart,
                        1095,
                    )
                }
            }
        } catch (err) {
            console.log(err)
        } finally {
            setLoadings(false)
        }
    }

    useEffect(() => {
        let list = listCoin
        assetsToken?.map(async (token: any) => {
            const tmp = {
                id: token._id,
                name: token.name,
                icon: token.attachment,
                symbol: `${token.symbol}USDT`,
                type: token.symbol,
                disable: token.disable,
            }
            console.log(tmp.type)

            const res = await getStorage()
            if (res?.symbol?.type) {
                if (tmp.type == res?.symbol?.type) {
                    setSelectedCoin({
                        icon: res?.symbol?.icon,
                        id: res?.symbol?.id,
                        name: res?.symbol?.name,
                        symbol: res?.symbol?.symbol,
                        type: res?.symbol?.type,
                        disable: res?.symbol?.disable,
                    })
                    setState({
                        ...state,
                        symbol: {
                            icon: res?.symbol?.icon,
                            id: res?.symbol?.id,
                            name: res?.symbol?.name,
                            symbol: res?.symbol?.symbol,
                            type: res?.symbol?.type,
                            disable: res?.symbol?.disable,
                        },
                    })
                }
            } else if (tmp.type == 'BNB') {
                setSelectedCoin({
                    id: token._id,
                    name: token.name,
                    icon: token.attachment,
                    symbol: `${token.symbol}USDT`,
                    type: token.symbol,
                    disable: token.disable,
                })
                setState({
                    ...state,
                    symbol: {
                        id: token._id,
                        name: token.name,
                        icon: token.attachment,
                        symbol: `${token.symbol}USDT`,
                        type: token.symbol,
                        disable: token.disable,
                    },
                })
            }

            list.push(tmp)
        })

        if (list.length > 0) {
            list.sort((a: any, b: any) => {
                return b.name - a.name
            })
            setListCoin(list)
        }
    }, [assetsToken])

    useEffect(() => {
        if (userBalance > 0) {
            return
        }
    }, [userBalance])

    // useEffect(() => {
    //     try {
    //     } catch (error) {
    //         setLoadings(false)
    //         return console.log(error)
    //     }
    // }, [account])

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
        if (state) {
            setTimeout(() => {
                const data = localStorage.getItem('buy_covered_state')
                if (data) {
                    const res = JSON.parse(data)
                    const newData = {
                        ...res,
                        disable: state.symbol.disable,
                        icon: state.symbol.icon,
                        id: state.symbol.id,
                        name: state.symbol.name,
                        symbol: state.symbol.symbol,
                        type: state.symbol.type,
                    }
                    setStorage(newData)
                }
            }, 5000)
        }
        if (thisFisrt) {
            return setThisFisrt(false)
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
        }
    }, [listCoin])

    useEffect(() => {
        refreshApi(selectTime, selectCoin)

        const data = localStorage.getItem('buy_covered_state')
        if (data) {
            let res = JSON.parse(data)
            res.icon = selectCoin.icon
            res.id = selectCoin.id
            res.name = selectCoin.name
            res.symbol = selectCoin.symbol
            res.type = selectCoin.type
            res.disable = selectCoin.disable
            localStorage.setItem('buy_covered_state', JSON.stringify(res))
        }
    }, [selectTime, selectCoin])

    useEffect(() => {
        if (selectCoin.symbol != '') {
            getPrice(selectCoin.symbol, state, setState)
            setState({ ...state, symbol: { ...selectCoin } })
            getConfig(selectCoin.type)
            getBalaneToken(selectCoin.type)
        }
    }, [selectCoin])

    const createSaved = async () => {
        const x = state.q_claim + state.q_covered * (state.p_claim - state.p_market)

        if (state.p_claim < state.p_market) {
            setSaved(x - state.margin + state.q_covered * Math.abs(state.p_claim - state.p_market))
        }

        if (state.p_claim > state.p_market) {
            setSaved(x - state.margin)
        }
    }

    useEffect(() => {
        const res_q_covered = validator('p_claim')
        validator('q_covered')
        validator('margin')

        if (state.q_covered > 0) {
            if (userBalance > 0) {
                const a = Math.ceil((state.q_covered / userBalance) * 100)
                percentInsurance.current = a >= 100 ? 100 : a
            }
        }

        if (state.margin > 0) {
            if (userBalance > 0) {
                const b = Math.ceil((state.margin / (state.q_covered * state.p_market)) * 100)
                if (b >= 10 || state.margin == rangeMargin.max) {
                    percentMargin.current = 10
                } else if (b >= 7) {
                    percentMargin.current = 7
                } else if (b >= 5) {
                    percentMargin.current = 5
                } else if (b >= 2) {
                    percentMargin.current = 2
                } else {
                    percentMargin.current = b
                }
            }
        }

        if (res_q_covered.isValid) {
            if (state.q_covered && state.p_claim) {
                const margin = Number((8 * state.q_covered * state.p_market) / 100)
                const userCapital = margin
                const systemCapital = userCapital
                const hedge_capital = userCapital + systemCapital
                const hedge = Number(margin / (state.q_covered * state.p_market))
                const p_stop = P_stop(Number(state.p_market), Number(state.p_claim), Number(hedge))
                const laverage = Leverage(state.p_market, p_stop)
                const ratio_profit = Number(Math.abs(state.p_claim - state.p_market) / state.p_market)
                const q_claim = Number(ratio_profit * hedge_capital * laverage) * (1 - 0.05) + margin
                setState({
                    ...state,
                    q_claim: Number(q_claim.toFixed(2)),
                    r_claim: Number((Number(q_claim / margin) * 100).toFixed(decimalList.decimal_q_covered)),
                    p_expired: Number(p_stop.toFixed(decimalList.decimal_q_covered)),
                    margin: Number(margin.toFixed(decimalList.decimal_margin)),
                })
            }

            if (state.q_covered && state.p_claim && state.margin) {
                const userCapital = state.margin
                const systemCapital = userCapital
                const hedge_capital = userCapital + systemCapital
                const hedge = Number(state.margin / (state.q_covered * state.p_market))
                const p_stop = P_stop(Number(state.p_market), Number(state.p_claim), Number(hedge))
                const laverage = Leverage(state.p_market, p_stop)
                const ratio_profit = Number(Math.abs(state.p_claim - state.p_market) / state.p_market)
                const q_claim = Number(ratio_profit * hedge_capital * laverage) * (1 - 0.05) + state.margin
                setState({
                    ...state,
                    q_claim: Number(q_claim.toFixed(2)),
                    r_claim: Number((Number(q_claim / state.margin) * 100).toFixed(decimalList.decimal_q_covered)),
                    p_expired: Number(p_stop.toFixed(decimalList.decimal_q_covered)),
                })
            }
            createSaved()
        } else {
            setSaved(0)
        }
    }, [state.q_covered, state.margin, state.p_claim])

    useEffect(() => {
        if (tab === 0 || tab === 3) {
            if (state.q_covered && state.p_claim) {
                const margin = Number((8 * state.q_covered * state.p_market) / 100)
                const userCapital = margin
                const systemCapital = userCapital
                const hedge_capital = userCapital + systemCapital
                const hedge = Number(margin / (state.q_covered * state.p_market))
                const p_stop = P_stop(Number(state.p_market), Number(state.p_claim), Number(hedge))
                const laverage = Leverage(state.p_market, p_stop)
                const ratio_profit = Number(Math.abs(state.p_claim - state.p_market) / state.p_market)
                const q_claim = Number(ratio_profit * hedge_capital * laverage) * (1 - 0.05) + margin
                setState({
                    ...state,
                    q_claim: Number(q_claim.toFixed(2)),
                    r_claim: Number((Number(q_claim / margin) * 100).toFixed(decimalList.decimal_q_covered)),
                    p_expired: Number(p_stop.toFixed(decimalList.decimal_q_covered)),
                    margin: Number(margin.toFixed(decimalList.decimal_margin)),
                })
            }
        }
    }, [tab])

    useEffect(() => {
        const defaultQ_covered = pair_configs?.filters?.find((e: any) => {
            return e.filterType === 'LOT_SIZE'
        })
    }, [percentInsurance, state.margin, state.q_covered])

    useEffect(() => {
        validator('p_claim')
    }, [state.p_claim])

    useEffect(() => {
        if (showGuide) {
            return setTab(3)
        } else {
            return
        }
    }, [showGuide])

    const [rangeP_claim, setRangeP_claim] = useState({
        min: 0,
        max: 100,
    })
    const [rangeMargin, setRangeMargin] = useState({
        min: 0,
        max: 100,
    })

    const [percentPrice, setPercentPrice] = useState<any>()
    const [priceFilter, setPriceFilter] = useState<any>()

    useEffect(() => {
        const _decimalList = { ...decimalList }
        let _percentPrice: any
        pair_configs?.filters?.map(async (item: any) => {
            if (item?.filterType === 'LOT_SIZE') {
                const tmp = await getBalaneToken(selectCoin.type)
                const decimal = countDecimals(item.stepSize)
                _decimalList.decimal_q_covered = +decimal
                const min_Market = +(10 / state.p_market).toFixed(+decimal)
                const min = Number(item?.minQty) > min_Market ? Number(item?.minQty) : min_Market
                const max = Number(item?.maxQty) < tmp ? Number(item?.maxQty) : tmp
                setRangeQ_covered({ ...rangeQ_covered, min: min, max: max })
            }
            if (item?.filterType === 'PERCENT_PRICE') {
                _percentPrice = item
            }
            if (item?.filterType === 'PRICE_FILTER') {
                setPriceFilter({ ...item })
                const decimal_p_claim = countDecimals(Number(item.tickSize))
                _decimalList.decimal_p_claim = +decimal_p_claim

                const min1 = state.p_market + (2 / 100) * state.p_market
                const max1 = state.p_market + (70 / 100) * state.p_market

                const min2 = state.p_market - (70 / 100) * state.p_market
                const max2 = state.p_market - (2 / 100) * state.p_market

                if (state.p_claim > state.p_market) {
                    setRangeP_claim({
                        ...rangeP_claim,
                        min: Number(min1),
                        max: Number(max1),
                    })
                } else {
                    setRangeP_claim({
                        ...rangeP_claim,
                        min: Number(min2),
                        max: Number(max2),
                    })
                }
            }
            if (item?.filterType === 'MARGIN') {
                const decimalMargin = countDecimals(item.stepSize)
                _decimalList.decimal_margin = +decimalMargin

                const MIN = Number((state.q_covered * state.p_market * item.minQtyRatio).toFixed(Number(decimalMargin)))
                const MAX = Number((state.q_covered * state.p_market * item.maxQtyRatio).toFixed(Number(decimalMargin)))
                setRangeMargin({ ...rangeP_claim, min: MIN, max: MAX })
            }
            setDecimalList({ ..._decimalList })
            setPercentPrice({ ..._percentPrice })
            validateP_Claim(state.p_claim)
        })
    }, [pair_configs, state.q_covered, selectCoin, state.p_claim])

    const validateP_Claim = (value: number) => {
        const _rangeP_claim = rangeP_claim

        let _check = true
        //Pm*multiplierDown/Up
        const PmDown = state.p_market * percentPrice?.multiplierDown
        const PmUp = state.p_market * percentPrice?.multiplierUp
        //+-2 -> +-70
        const min1 = state.p_market + (2 / 100) * state.p_market
        const max1 = state.p_market + (70 / 100) * state.p_market

        const min2 = state.p_market - (70 / 100) * state.p_market
        const max2 = state.p_market - (2 / 100) * state.p_market

        if (state.p_claim < state.p_market) {
            const min = min2 > PmDown ? PmDown : min2
            const max = max2 > PmUp ? PmUp : max2
            _rangeP_claim.min = +min.toFixed(decimalList.decimal_p_claim)
            _rangeP_claim.max = +max.toFixed(decimalList.decimal_p_claim)
            return setRangeP_claim({ ..._rangeP_claim })
        }
        if (state.p_claim > state.p_market) {
            const min = min1 > PmDown ? min1 : PmDown
            const max = max1 > PmUp ? max1 : PmUp
            _rangeP_claim.min = +min.toFixed(decimalList.decimal_p_claim)
            _rangeP_claim.max = +max.toFixed(decimalList.decimal_p_claim)
            return setRangeP_claim({ ..._rangeP_claim })
        }
    }

    const validator = (key: string) => {
        let rs = { isValid: true, message: '' }

        switch (key) {
            case 'q_covered':
                rs.isValid = !(
                    state.q_covered > Number(rangeQ_covered?.max?.toFixed(decimalList.decimal_q_covered)) ||
                    state.q_covered < rangeQ_covered.min ||
                    state.q_covered <= 0
                )
                rs.message = `<div class="flex items-center ">
                    ${
                        state.q_covered > Number(rangeQ_covered?.max?.toFixed(decimalList.decimal_q_covered))
                            ? t('common:available', {
                                  value: `${Number(rangeQ_covered?.max?.toFixed(decimalList.decimal_q_covered))}`,
                              })
                            : t('common:min', { value: rangeQ_covered.min })
                    }
                </div>`
                break
            case 'p_claim':
                rs.isValid = !(state.p_claim < rangeP_claim.min || state.p_claim > rangeP_claim.max)
                rs.message = `<div class="flex items-center">
                  ${
                      state.p_claim > Number(rangeP_claim.max)
                          ? t('common:max', { value: `${Number(rangeP_claim.max)}` })
                          : t('common:min', { value: `${Number(rangeP_claim.min)}` })
                  }
                  </div>`
                break
            case 'margin':
                rs.isValid = !(state.margin < Number(rangeMargin.min) || state.margin > Number(rangeMargin.max) || state.margin <= 0)
                rs.message = `<div class="flex items-center">
                ${
                    state.margin > Number(rangeMargin.max)
                        ? t('common:max', { value: `${Number(rangeMargin.max)}` })
                        : t('common:min', { value: `${Number(rangeMargin.min)}` })
                }
                </div>`
                break
            default:
                break
        }

        if (!rs.isValid) {
            clear.current = false
        }

        return rs
    }

    const renderPopoverQCover = () => (
        <Popover className="relative outline-none bg-hover focus:ring-0 flex items-center justify-center">
            <Popover.Button
                id={'popoverInsurance'}
                className={'flex flex-row justify-end w-full items-center focus:border-0 focus:ring-0 active:border-0'}
                onClick={() => {
                    setChosing(!chosing)
                }}
            >
                <img alt={''} src={`${selectCoin && selectCoin.icon}`} width="20" height="20" className={'mr-1 rounded-[50%]'}></img>
                <span className={'whitespace-nowrap text-red mr-2'}>{selectCoin && selectCoin.name}</span>
                <div className="min-w-[1rem]">{!chosing ? <ChevronDown size={16} /> : <ChevronUp size={16} />}</div>
            </Popover.Button>
            <Popover.Panel className="absolute z-50 bg-white top-12 -right-3 w-[360px] rounded-[3px] shadow-dropdown">
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
                                            setState({ ...state, symbol: { ...coin }, q_covered: 0, p_claim: 0, q_claim: 0, margin: 0, r_claim: 0 })
                                            setChosing(false)
                                        }}
                                        onClick={() => close()}
                                        className={`${
                                            isPress ? 'bg-gray-1' : 'hover:bg-hover'
                                        } flex flex-row justify-start w-full items-center p-3 font-medium`}
                                    >
                                        <div className="max-w-[20px] mr-[8px] max-h-[20px] ">
                                            <img alt={''} src={`${coin.icon}`} width="20" height="20" className={'mr-[5px] rounded-[50%]'}></img>
                                        </div>
                                        <div className={'flex flex-row justify-between w-full text-sm'}>
                                            <span className={'hover:cursor-default'}>{coin.name}</span>
                                            {coin.id === selectCoin.id ? <Check size={16} className={'text-red'}></Check> : ''}
                                        </div>
                                    </div>
                                ) : (
                                    <a
                                        id={`${coin.id}`}
                                        key={key}
                                        className={`hover:bg-hover flex flex-row justify-start w-full items-center p-3 text-divider font-medium`}
                                    >
                                        <div className="max-w-[20px] mr-[8px] max-h-[20px] ">
                                            <img alt={''} src={`${coin.icon}`} width="20" height="20" className={'mr-[5px] rounded-[50%]'}></img>
                                        </div>
                                        <div className={'flex flex-row justify-between w-full text-sm'}>
                                            <span>{coin.name}</span>
                                        </div>
                                    </a>
                                )
                            })}
                    </div>
                )}
            </Popover.Panel>
        </Popover>
    )

    const renderPopoverMargin = () => (
        <Popover className="relative">
            <Popover.Button disabled={true} className={'flex items-center space-x-2 hover:cursor-pointer'} onClick={() => setChangeUnit2(!changeUnit2)}>
                <span className="text-gray">{unitMoney}</span> {/*!changeUnit2 ? <ChevronDown size={16} /> : <ChevronUp size={16} />*/}
            </Popover.Button>
            <Popover.Panel
                className="flex flex-col min-w-[18rem] absolute top-12 -right-3 bg-white z-[100] rounded-[3px] shadow-dropdown"
                style={{
                    boxShadow: '0px 3px 5px rgba(9, 30, 66, 0.2), 0px 0px 1px rgba(9, 30, 66, 0.31)',
                }}
            >
                {({ close }) => (
                    <div className="flex flex-col justify-center h-full ">
                        {['USDT', 'BUSD', 'USDC'].map((e, key) => {
                            return (
                                <div
                                    key={key}
                                    className={`py-2 text-sm px-4 cursor-pointer hover:bg-hover font-normal`}
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
    )

    const [isCanSave, setIsCanSave] = useState<boolean>(false)
    const onHandleChange = (key: string, e: any) => {
        const value = +e.value

        if (value == 0) {
            setIsCanSave(false)
        } else {
            setIsCanSave(true)
        }

        switch (key) {
            case 'q_covered':
                setState({ ...state, [key]: value })
                percentInsurance.current = 0
                break
            case 'p_claim':
                setState({ ...state, [key]: value })
                break
            case 'margin':
                percentMargin.current = 0
                setState({ ...state, margin: value, percent_margin: 0 })
                break
            default:
                break
        }
    }

    const handleCheckFinal = () => {
        if (account.address == null) {
            return false
        } else if (state.q_covered <= 0 || state.margin <= 0 || state.p_claim <= 0) {
            return false
        } else if (userBalance == null || userBalance == 0) {
            return false
        } else {
            return true
        }
    }

    useEffect(() => {
        clear.current = handleCheckFinal()
    }, [state])

    return (
        <>
            {<GlossaryModal visible={showDetails} onClose={() => setShowDetails(false)} />}
            {index == 1 && <Guide start={showGuide} setStart={setShowGuide} />}
            {!loadings ? (
                !isMobile ? (
                    <>
                        <LayoutInsurance
                            hiddenHeader={showGuide}
                            handleClick={() => {
                                setChosing(false)
                                setChangeUnit2(false)
                            }}
                        >
                            <div className="w-full bg-[#E5E7E8]  h-[0.25rem] sticky top-[4.1875rem] z-[50]">
                                <div className="bg-red h-[0.25rem] w-1/2"></div>
                            </div>
                            <div className="px-4 mb:px-10 lg:px-20">
                                <div className="max-w-/screen-layout 4xl:max-w-screen-3xl m-auto">
                                    {
                                        // head Insurance
                                        <HeaderContent state={tab} setState={setTab} props={state} setProps={setState} wallet={wallet} auth={account.address} />
                                    }

                                    {
                                        //checkAuth
                                        account.address == null
                                            ? !isMobile && (
                                                  <div
                                                      className="w-full flex flex-col justify-center items-center max-w-screen-layout 4xl:max-w-screen-3xl m-auto mb-[1rem]"
                                                      onClick={() => {
                                                          setChosing(false)
                                                      }}
                                                  >
                                                      <Button
                                                          variants={'primary'}
                                                          className={`bg-red h-[48px] w-[374px] flex justify-center items-center text-white rounded-[8px] py-[12px]`}
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
                                    <div className="  flex flex-row mb-[8rem] overflow-hidden">
                                        <div className="w-8/12">
                                            {
                                                //chart
                                                index == 1 && (
                                                    <div
                                                        className={`shadow border border-1 border-divider h-auto rounded-xl  p-8`}
                                                        onClick={() => {
                                                            setChosing(false)
                                                        }}
                                                    >
                                                        {/*head*/}
                                                        <div id="tour_statistics" data-tut="tour_statistics">
                                                            <div className={'pb-2 text-sm leading-5 text-txtSecondary flex items-center space-x-6'}>
                                                                <div className={'w-full flex flex-row items-center'}>
                                                                    <span className="mr-2">{menu[7].name}</span>
                                                                    <div data-tip={t('insurance:terminology:q_covered')} data-for={`q_covered`}>
                                                                        <InfoCircle size={14} color={colors.txtSecondary} />
                                                                        <Tooltip className="max-w-[200px]" id={'q_covered'} placement="right" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className={'pb-2 space-x-6 flex justify-between'}>
                                                                <div className={`flex justify-between border-collapse rounded-[3px] shadow-none w-full`}>
                                                                    <InputNumber
                                                                        validator={validator('q_covered')}
                                                                        value={state.q_covered}
                                                                        onChange={(e: any) => onHandleChange('q_covered', e)}
                                                                        customSuffix={renderPopoverQCover}
                                                                        decimal={decimalList.decimal_q_covered}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-row w-full space-x-6 text-xs font-semibold">
                                                            <div className={`flex flex-row justify-between space-x-4 w-full `}>
                                                                {[25, 50, 75, 100].map((data) => {
                                                                    return (
                                                                        <div
                                                                            key={data}
                                                                            className={`flex flex-col space-y-3 justify-center w-1/4 items-center hover:cursor-pointer`}
                                                                            onClick={() => {
                                                                                if (userBalance) {
                                                                                    setState({
                                                                                        ...state,
                                                                                        q_covered: Number(
                                                                                            ((data / 100) * rangeQ_covered.max).toFixed(
                                                                                                decimalList.decimal_q_covered,
                                                                                            ),
                                                                                        ),
                                                                                    })
                                                                                    percentInsurance.current = data
                                                                                }
                                                                            }}
                                                                        >
                                                                            <div
                                                                                className={`${
                                                                                    percentInsurance.current == data ? 'bg-red' : 'bg-gray-1'
                                                                                } h-1 w-full rounded-sm`}
                                                                            ></div>
                                                                            <div className={percentInsurance.current === data ? 'text-red' : 'text-gray'}>
                                                                                {data}%
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>

                                                        {/*end head*/}
                                                        <div data-tut="tour_chart" id="tour_chart" className="mt-6 mb-4">
                                                            {/*body*/}
                                                            <div className={'flex flex-row relative'}>
                                                                <Suspense fallback={`Loading...`}>
                                                                    <ChartComponent
                                                                        width={795}
                                                                        height={280}
                                                                        data={dataChart}
                                                                        state={state ? state : null}
                                                                        p_claim={Number(state && state.p_claim)}
                                                                        p_expired={Number(state.p_expired)}
                                                                        setP_Claim={(data: number) => setState({ ...state, p_claim: data })}
                                                                        setP_Market={(data: number) => setState({ ...state, p_market: data })}
                                                                    />
                                                                    <svg
                                                                        className={`absolute right-0 z-10`}
                                                                        width="3"
                                                                        height={280}
                                                                        viewBox="0 0 2 500"
                                                                        fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <line
                                                                            x1="1"
                                                                            y1="3.5011e-08"
                                                                            x2="0.999987"
                                                                            y2="500"
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
                                                            <div className={'flex flex-row justify-between items-center w-full mt-5'}>
                                                                {listTime.map((time, key) => {
                                                                    return (
                                                                        <div
                                                                            key={key}
                                                                            className={`${
                                                                                selectTime == time ? 'text-red' : 'text-txtSecondary'
                                                                            } hover:cursor-pointer font-medium  text-sm`}
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
                                                            <div className={'my-6'}>
                                                                <span className={'flex flex-row items-center text-txtSecondary text-sm'}>
                                                                    <span className={'mr-2'}>P-Claim</span>
                                                                    <div data-tip={t('insurance:terminology:p_claim')} data-for={`p_claim`}>
                                                                        <InfoCircle size={14} color={colors.txtSecondary} />
                                                                        <Tooltip className="max-w-[200px]" id={'p_claim'} placement="right" />
                                                                    </div>
                                                                </span>

                                                                <InputNumber
                                                                    className="mt-2"
                                                                    validator={validator('p_claim')}
                                                                    value={state.p_claim}
                                                                    onChange={(e: any) => onHandleChange('p_claim', e)}
                                                                    customSuffix={() => unitMoney}
                                                                    suffixClassName="text-txtSecondary"
                                                                    placeholder={`${menu[9].name}`}
                                                                    decimal={decimalList.decimal_p_claim}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Period */}
                                                        <div className={'mt-5 text-sm '} data-tut="tour_period" id="tour_period">
                                                            <span className="flex flex-row items-center text-txtSecondary">
                                                                <span className={'mr-[8px]'}>Period ({menu[8].name})</span>
                                                                <div data-tip={t('insurance:terminology:period')} data-for={`period`}>
                                                                    <InfoCircle size={14} color={colors.txtSecondary} />
                                                                    <Tooltip className="max-w-[200px]" id={'period'} placement="right" />
                                                                </div>
                                                            </span>
                                                            <Tab.Group>
                                                                <Tab.List
                                                                    className={`flex flex-row mt-4 justify-between`}
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
                                                                                    state.period == item && 'bg-pink text-red font-semibold'
                                                                                } bg-hover rounded-[300px] px-4 py-1 flex justify-center items-center hover:cursor-pointer ${
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
                                        </div>

                                        <div className="w-4/12 flex flex-col justify-between shadow border border-1 border-divider rounded-xl p-8 ml-[1.5rem]">
                                            <div>
                                                {
                                                    //description
                                                    index == 1 && saved > 0 && (
                                                        <div
                                                            className={
                                                                'flex flex-col justify-center items-center mb-[2.5rem] max-w-screen-layout 4xl:max-w-screen-3xl m-auto'
                                                            }
                                                            onClick={() => {
                                                                setChosing(false)
                                                            }}
                                                        >
                                                            <CheckCircle size={68}></CheckCircle>
                                                            <span className={'font-medium text-base text-txtPrimary mt-[1rem]'}>
                                                                {`${t('insurance:buy:saved')} `}
                                                                <span className={'text-red'}>
                                                                    ${saved.toFixed(4)} {unitMoney}
                                                                </span>{' '}
                                                                {t('insurance:buy:sub_saved')}
                                                            </span>
                                                        </div>
                                                    )
                                                }
                                                {/*Only Show Claim And Margin*/}
                                                {index == 1 && (
                                                    <div
                                                        className={'flex flex-col w-full justify-center items-center hover:cursor-default z-50'}
                                                        onClick={() => {
                                                            setChosing(false)
                                                        }}
                                                    >
                                                        <div
                                                            className={`${
                                                                tab == 4 ? 'hidden' : ''
                                                            } flex flex-row justify-between items-center w-full rounded-[12px] border border-divider border-0.5 px-5 py-4`}
                                                        >
                                                            <div className={'text-txtSecondary flex flex-row items-center'}>
                                                                <span className={'mr-[8px]'}>R-Claim</span>
                                                                <div data-tip={t('insurance:terminology:r_claim')} data-for={`r_claim`}>
                                                                    <InfoCircle size={14} color={colors.txtSecondary} />
                                                                    <Tooltip className="max-w-[200px]" id={'r_claim'} placement="right" />
                                                                </div>
                                                            </div>
                                                            <div className={''}>
                                                                <span>
                                                                    {state?.r_claim > 0 ? Number(state?.r_claim.toFixed(decimalList.decimal_q_covered)) : 0}%
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className={`${
                                                                tab == 5 ? 'hidden' : ''
                                                            } flex flex-row justify-between items-center w-full rounded-[12px] border border-divider border-0.5 px-5 py-4 my-[1rem]`}
                                                        >
                                                            <div className={'text-txtSecondary flex flex-row items-center'}>
                                                                <span className={'mr-[8px]'}>Q-Claim</span>
                                                                <div data-tip={t('insurance:terminology:q_claim')} data-for={`q_claim`}>
                                                                    <InfoCircle size={14} color={colors.txtSecondary} />
                                                                    <Tooltip className="max-w-[200px]" id={'q_claim'} placement="right" />
                                                                </div>
                                                            </div>
                                                            <div
                                                                className={
                                                                    'flex flex-row justify-center items-center hover:cursor-pointer relative max-h-[24px]'
                                                                }
                                                            >
                                                                {state.q_claim > 0 ? Number(state?.q_claim.toFixed(decimalList.decimal_q_covered)) : 0}
                                                                <span className={'pl-2 mr-1'}>{unitMoney}</span>
                                                                <div className="relative"></div>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className={`${
                                                                tab == 1 ? 'hidden' : ''
                                                            } flex flex-row justify-between items-center w-full rounded-[12px] border border-divider border-0.5 px-5 py-4`}
                                                        >
                                                            <div className={'text-txtSecondary flex flex-row items-center'}>
                                                                <span className={'mr-[8px]'}>Margin</span>
                                                                <div data-tip={t('insurance:terminology:margin')} data-for={`margin`}>
                                                                    <InfoCircle size={14} color={colors.txtSecondary} />
                                                                    <Tooltip className="max-w-[200px]" id={'margin'} placement="right" />
                                                                </div>
                                                            </div>
                                                            <div
                                                                className={
                                                                    'flex flex-row items-center justify-center hover:cursor-pointer relative max-h-[24px]'
                                                                }
                                                            >
                                                                {state.margin > 0 ? Number(state?.margin.toFixed(decimalList.decimal_margin)) : 0}
                                                                <span className={'pl-2 mr-1'}>{unitMoney}</span>
                                                                <div className="relative"></div>
                                                            </div>
                                                        </div>

                                                        {tab === 1 && (
                                                            <>
                                                                {' '}
                                                                <div className={`w-full flex flex-row items-center text-sm text-txtSecondary mb-[0.5rem]`}>
                                                                    <span className={'mr-2'}>Margin</span>
                                                                    <div data-tip={t('insurance:terminology:margin')} data-for={`margin`}>
                                                                        <InfoCircle size={14} color={colors.txtSecondary} />
                                                                        <Tooltip className="max-w-[200px]" id={'margin'} placement="right" />
                                                                    </div>
                                                                </div>
                                                                <div className={`flex justify-between border-collapse rounded-[3px] shadow-none w-full`}>
                                                                    <InputNumber
                                                                        validator={validator('margin')}
                                                                        value={state.q_covered > 0 ? state.margin : 0}
                                                                        onChange={(e: any) => onHandleChange('margin', e)}
                                                                        customSuffix={renderPopoverMargin}
                                                                        decimal={decimalList.decimal_margin}
                                                                    />
                                                                </div>
                                                                <div className={`flex flex-row justify-between space-x-4 !w-full mt-[0.5rem]`}>
                                                                    {[2, 5, 7, 10].map((item, key) => {
                                                                        return (
                                                                            <div
                                                                                key={key}
                                                                                className={
                                                                                    'flex flex-col space-y-3 justify-center w-1/4 items-center hover:cursor-pointer'
                                                                                }
                                                                                onClick={() => {
                                                                                    updateFormPercentMargin(item)
                                                                                }}
                                                                            >
                                                                                <div
                                                                                    className={`${
                                                                                        percentMargin.current == item ? 'bg-red' : 'bg-gray-1'
                                                                                    } h-1 w-full rounded-sm`}
                                                                                ></div>
                                                                                <span className={percentMargin.current == item ? 'text-red' : 'text-gray'}>
                                                                                    {item}%
                                                                                </span>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* the next level*/}
                                            {index == 1 && (
                                                <div
                                                    className={`flex flex-col justify-center items-center mb-[2rem] `}
                                                    onClick={() => {
                                                        setChosing(false)
                                                    }}
                                                >
                                                    <button
                                                        className={`${
                                                            clear.current == true
                                                                ? 'bg-red text-white border border-red'
                                                                : 'text-white bg-divider border border-divider'
                                                        }flex items-center justify-center rounded-lg px-auto py-auto font-semibold py-[12px] w-full`}
                                                        onClick={() => {
                                                            handleNext()
                                                        }}
                                                        disabled={!clear.current}
                                                    >
                                                        {menu[11].name}
                                                    </button>
                                                    <Menu>
                                                        <Menu.Button className={'my-[16px] text-blue underline hover:cursor-pointer'}>
                                                            {menu[12].name}
                                                        </Menu.Button>
                                                        <Menu.Items
                                                            className={'flex flex-col text-txtPrimary text-sm'}
                                                            style={{ boxShadow: '0px 3px 5px rgba(9, 30, 66, 0.2), 0px 0px 1px rgba(9, 30, 66, 0.31)' }}
                                                        >
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <a
                                                                        className={`${active && 'bg-blue-500'}  py-[8px] pl-[16px] w-[300px] hover:bg-hover`}
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
                                                                        className={`${
                                                                            active && 'bg-blue-500'
                                                                        }  py-[8px] pl-[16px] w-[300px] hover:bg-hover hover:cursor-pointer`}
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
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </LayoutInsurance>
                    </>
                ) : (
                    <>
                        {account.address == null ? (
                            <>
                                <div style={{ background: 'linear-gradient(180deg, rgba(244, 63, 94, 0.15) 0%, rgba(254, 205, 211, 0) 100%)' }}>
                                    <div className="px-[16px] pt-[8px]" onClick={() => router.push('/home')}>
                                        <XMark />
                                    </div>
                                    <div className="flex flex-col items-center px-[60px] pt-[8px]">
                                        <img src={'/images/icons/ic_pig.png'} width="269" height="212" className="w-[269px] h-auto" />
                                    </div>
                                </div>
                                <div className="flex flex-col items-center pt-[16px] text-txtPrimary">
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
                                            <span className="text-txtPrimary text-sm font-semibold">{t('insurance:mobile_login:token')}</span>
                                            <span className="text-sm text-txtSecondary">{t('insurance:mobile_login:token_detail')}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-row my-[24px]">
                                        <div className="pr-[16px]">
                                            <BxLineChartDown />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-txtPrimary text-sm font-semibold">{t('insurance:mobile_login:p_claim')}</span>
                                            <span className="text-sm text-txtSecondary">{t('insurance:mobile_login:p_claim_detail')}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-row">
                                        <div className="pr-[16px]">
                                            <BxCaledarCheck />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-txtPrimary text-sm font-semibold">{t('insurance:mobile_login:period')}</span>
                                            <span className="text-sm text-txtSecondary">{t('insurance:mobile_login:period_detial')}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-center mb-[16px]">
                                    <Button
                                        variants={'primary'}
                                        className={`bg-red text-sm font-semibold h-[48px] w-[95%] tiny:w-[374px] flex justify-center items-center text-white rounded-[8px] py-[12px]`}
                                        onClick={() => {
                                            Config.connectWallet()
                                        }}
                                    >
                                        {t('insurance:mobile_login:connect_wallet')}
                                    </Button>
                                </div>
                                <div
                                    className={` hover:cursor-pointer flex justify-center text-red text-sm line-height-[19px] underline`}
                                    onClick={() => {
                                        setShowDetails(true)
                                    }}
                                >
                                    <span>{t('insurance:buy:detailed_terminology')}</span>
                                </div>
                            </>
                        ) : (
                            <>
                                {showChangeUnit.isShow && (
                                    <Modal
                                        portalId="modal"
                                        isVisible={true}
                                        className={`!sticky !bottom-0 !left-0 !rounded-none !h-[${height && height}px]`}
                                        onBackdropCb={() => setShowChangeUnit({ ...showChangeUnit, isShow: false, name: '' })}
                                    >
                                        <div className={`h-max bg-white text-sm  mx-auto `}>
                                            <div className="flex flex-col justify-center my-[24px]">
                                                <div className="font-medium text-xl">{showChangeUnit.name}</div>
                                                <div className="mt-[32px] divide-y divide-divider text-txtPrimary w-full">
                                                    {['USDT', 'USDC', 'BUSD'].map((item, key) => {
                                                        return (
                                                            <div
                                                                key={key}
                                                                className="w-full flex flex-row justify-between items-center hover:bg-gray-1 hover:pl-[8px] font-normal"
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
                                {showInput.isShow && (
                                    <Modal
                                        portalId="modal"
                                        isVisible={true}
                                        className={`!sticky !bottom-0 !left-0 !rounded-none !translate-x-0 !translate-y-0 h-1/2 `}
                                        onBackdropCb={() => setShowInput({ ...showInput, isShow: false, name: '' })}
                                    >
                                        <div className="bg-white  !sticky !bottom-0 !left-0">
                                            <div className="text-txtPrimary text-xl font-semibold mb-[1.5rem]">{t(`insurance:buy:${showInput.name}`)}</div>
                                            <div className={'text-txtSecondary text-base mb-[0.5rem] flex flex-row items-center'}>
                                                <span className={'mr-2'}>{t(`insurance:buy:${showInput.name}`)}</span>
                                                <div data-tip={t(`insurance:terminology:${showInput.name}`)} data-for={`${showInput.name}`}>
                                                    <InfoCircle size={14} color={colors.txtSecondary} />
                                                    <Tooltip className="max-w-[200px]" id={`${showInput.name}`} placement="right" />
                                                </div>
                                            </div>

                                            {showInput.name === 'q_covered' ? (
                                                <>
                                                    <div className={`flex justify-between border-collapse rounded-[3px] shadow-none w-full mb-[0.5rem]`}>
                                                        <InputNumber
                                                            validator={validator(`q_covered`)}
                                                            value={state.q_covered}
                                                            onChange={(e: any) => onHandleChange('q_covered', e)}
                                                            decimal={decimalList.decimal_q_covered}
                                                        />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className={`flex justify-between border-collapse rounded-[3px] shadow-none w-full mb-[0.5rem]`}>
                                                        <InputNumber
                                                            validator={validator(`margin`)}
                                                            value={state.margin}
                                                            onChange={(e: any) => onHandleChange('margin', e)}
                                                            decimal={decimalList.decimal_margin}
                                                        />
                                                    </div>
                                                </>
                                            )}

                                            <div className={`flex flex-row justify-between space-x-4 w-full text-xs mb-[1.5rem]`}>
                                                {showInput.name === 'q_covered' &&
                                                    [25, 50, 75, 100].map((data) => {
                                                        return (
                                                            <div
                                                                key={data}
                                                                className={`flex flex-col space-y-3 justify-center w-1/4 items-center hover:cursor-pointer`}
                                                                onClick={() => {
                                                                    if (userBalance > 0) {
                                                                        setState({
                                                                            ...state,
                                                                            q_covered: Number(
                                                                                ((data / 100) * rangeQ_covered.max).toFixed(decimalList.decimal_q_covered),
                                                                            ),
                                                                        })
                                                                        percentInsurance.current = data
                                                                    }
                                                                }}
                                                            >
                                                                <div
                                                                    className={`${
                                                                        percentInsurance.current == data ? 'bg-red' : 'bg-gray-1'
                                                                    } h-1 w-full rounded-sm`}
                                                                ></div>
                                                                <div className={percentInsurance.current == data ? 'text-red' : 'text-gray'}>{data}%</div>
                                                            </div>
                                                        )
                                                    })}
                                                {showInput.name === 'margin' &&
                                                    [2, 5, 7, 10].map((data) => {
                                                        return (
                                                            <div
                                                                key={data}
                                                                className={`flex flex-col space-y-3 justify-center w-1/4 items-center hover:cursor-pointer`}
                                                                onClick={() => {
                                                                    updateFormPercentMargin(data)
                                                                }}
                                                            >
                                                                <div
                                                                    className={`${
                                                                        percentMargin.current == data ? 'bg-red' : 'bg-gray-1'
                                                                    } h-1 w-full rounded-sm`}
                                                                ></div>
                                                                <div className={percentMargin.current === data ? 'text-red' : 'text-gray'}>{data}%</div>
                                                            </div>
                                                        )
                                                    })}
                                            </div>
                                            <Button
                                                disabled={!isCanSave}
                                                variants={'primary'}
                                                className={`${
                                                    !isCanSave ? 'bg-hover' : 'bg-red'
                                                } h-[48px] w-full flex justify-center items-center text-white rounded-[8px] py-[12px]`}
                                                onClick={() => setShowInput({ ...showInput, isShow: false, name: '' })}
                                            >
                                                {t('insurance:buy:save')}
                                            </Button>
                                        </div>
                                    </Modal>
                                )}
                                {openChangeToken && (
                                    <Modal
                                        portalId="modal"
                                        isVisible={true}
                                        className=" bg-white !sticky !bottom-0 !left-0 !rounded-none !translate-x-0 !translate-y-0 h-1/2"
                                        onBackdropCb={() => {
                                            setShowInput({ isShow: true, name: 'q_covered' })
                                            setOpenChangeToken(false)
                                        }}
                                    >
                                        <div className="bg-white text-sm  mx-auto">
                                            <div className="font-semibold text-xl mb-[24px]">{t('insurance:buy:asset')}</div>
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
                                                                    setState({
                                                                        ...state,
                                                                        symbol: { ...coin },
                                                                        q_covered: 0,
                                                                        p_claim: 0,
                                                                        q_claim: 0,
                                                                        margin: 0,
                                                                        r_claim: 0,
                                                                    })
                                                                    setOpenChangeToken(false)
                                                                    setShowInput({ isShow: true, name: 'q_covered' })
                                                                }}
                                                                className={`${
                                                                    isPress ? 'bg-gray-1' : 'hover:bg-hover'
                                                                } flex flex-row justify-start w-full items-center p-3 font-medium`}
                                                            >
                                                                <img
                                                                    alt={''}
                                                                    src={`${coin.icon}`}
                                                                    width="24"
                                                                    height="24"
                                                                    className={'mr-[12px] rounded-[50%]'}
                                                                ></img>
                                                                <div className={'flex flex-row justify-between w-full'}>
                                                                    <span className={'hover:cursor-default'}>{coin.name}</span>
                                                                    {coin.id === selectCoin.id ? <Check size={16} className={'text-red'}></Check> : ''}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <a
                                                                id={`${coin.id}`}
                                                                key={key}
                                                                className={`hover:bg-hover flex flex-row justify-start w-full items-center p-3 text-divider font-medium`}
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
                                                                    {coin.id === selectCoin.id ? <Check size={16} className={'text-red'}></Check> : ''}
                                                                </div>
                                                            </a>
                                                        )
                                                    })}
                                            </div>
                                        </div>
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
                                            <ArrowLeft />
                                        </div>
                                        <div data-tut="tour_custom" id="tour_custom" className={`h-[32px] flex flex-row mx-[16px]`}>
                                            <span
                                                className={'text-blue underline hover:cursor-pointer pr-[16px] flex items-center'}
                                                onClick={() => {
                                                    setShowGuideModal(true)
                                                }}
                                            >
                                                {t('insurance:guild:title')}
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
                                                        if (tab == 6) {
                                                            return setTab(3)
                                                        } else {
                                                            setShowInput({ isShow: true, name: 'margin' })
                                                            return setTab(6)
                                                        }
                                                    }}
                                                    className={`${
                                                        tab == 6 ? 'bg-red' : 'bg-[#F2F3F4]'
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
                                        {componentsInputMobile()}
                                    </div>
                                )}
                                {index == 1 && (
                                    <div data-tut="tour_chart" id="tour_chart" className="">
                                        <div className={'flex flex-row relative'}>
                                            <Suspense fallback={`Loading...`}>
                                                <ChartComponent
                                                    width={358}
                                                    height={252}
                                                    data={dataChart}
                                                    state={state ? state : null}
                                                    p_claim={Number(state && state.p_claim)}
                                                    p_expired={Number(state.p_expired)}
                                                    setP_Claim={(data: number) => setState({ ...state, p_claim: data })}
                                                    setP_Market={(data: number) => setState({ ...state, p_market: data })}
                                                    isMobile={isMobile}
                                                ></ChartComponent>
                                            </Suspense>
                                            <svg
                                                className={`absolute right-0 z-10`}
                                                width="3"
                                                height={252}
                                                viewBox="0 0 2 500"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <line
                                                    x1="1"
                                                    y1="3.5011e-08"
                                                    x2="0.999987"
                                                    y2="500"
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
                                                            selectTime == time ? 'text-red' : 'text-txtSecondary'
                                                        } hover:cursor-pointer font-medium  text-sm`}
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
                                                <span className={'mr-[6px] text-txtSecondary text-sm'}>P-Claim</span>
                                                <div data-tip={t('insurance:terminology:p_claim')} data-for={`p_claim`}>
                                                    <InfoCircle size={14} color={colors.txtSecondary} />
                                                    <Tooltip className="max-w-[200px]" id={'p_claim'} placement="right" />
                                                </div>
                                            </span>
                                            <InputNumber
                                                className="mt-2"
                                                validator={validator('p_claim')}
                                                value={state.p_claim}
                                                onChange={(e: any) => onHandleChange('p_claim', e)}
                                                customSuffix={() => unitMoney}
                                                suffixClassName="text-txtSecondary"
                                                placeholder={`${menu[9].name}`}
                                                decimal={decimalList?.decimal_p_claim}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Period */}
                                {index == 1 && (
                                    <div data-tut="tour_period" id="tour_period" className={'mt-5 pl-[32px] pr-[32px] pb-[32px] text-sm text-txtSecondary'}>
                                        <span className="flex flex-row items-center">
                                            <span className={'mr-[8px]'}>Period ({menu[8].name})</span>
                                            <div data-tip={t('insurance:terminology:period')} data-for={`period`}>
                                                <InfoCircle size={14} color={colors.txtSecondary} />
                                                <Tooltip className="max-w-[200px]" id={'period'} placement="right" />
                                            </div>
                                        </span>
                                        <Tab.Group>
                                            <Tab.List
                                                className={`flex flex-row justify-between mt-[1rem]  ${isMobile ? 'w-full' : 'w-[85%]'} ${
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
                                                                state.period == item && 'bg-[#FFF1F2] text-red'
                                                            } bg-hover rounded-[300px] p-3 h-[32px] w-[49px] flex justify-center items-center hover:cursor-pointer ${
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

                                {index == 1 && (
                                    <div
                                        onClick={() => {
                                            setChosing(false)
                                        }}
                                        className={`${clear ? 'visible' : 'invisible'} items-center w-[300px] xs:w-full`}
                                    >
                                        {saved > 0 && (
                                            <div className={'flex justify-center items-center mt-[24px] mx-[16px]'}>
                                                <CheckCircle></CheckCircle>
                                                <span className={'text-sm text-txtPrimary w-[230px] xs:w-full px-[4px] font-semibold'}>
                                                    {t('insurance:buy:saved')}{' '}
                                                    <span className={'text-red'}>
                                                        {saved.toFixed(4)} {unitMoney}
                                                    </span>{' '}
                                                    {t('insurance:buy:sub_saved')}
                                                </span>
                                            </div>
                                        )}
                                        <div className={'flex flex-col mt-[24px] hover:cursor-default'}>
                                            <div
                                                className={`${
                                                    tab == 4 ? 'hidden' : ''
                                                } flex flex-row justify-between items-center rounded-[12px] px-[24px] py-[16px] mx-[12px]`}
                                            >
                                                <div className={'text-txtSecondary flex flex-row items-center'}>
                                                    <span className={'mr-[8px]'}>R-Claim</span>
                                                    <div data-tip={t('insurance:terminology:r_claim')} data-for={`r_claim`}>
                                                        <InfoCircle size={14} color={colors.txtSecondary} />
                                                        <Tooltip className="max-w-[200px]" id={'r_claim'} placement="right" />
                                                    </div>
                                                </div>
                                                <div className={'font-semibold'}>
                                                    <span>{state?.r_claim > 0 ? Number(state?.r_claim.toFixed(decimalList.decimal_q_covered)) : 0}%</span>
                                                </div>
                                            </div>
                                            <div
                                                className={`${
                                                    tab == 5 ? 'hidden' : ''
                                                } flex flex-row justify-between items-center rounded-[12px] px-[24px] py-[16px] mx-[12px]`}
                                            >
                                                <div className={'text-txtSecondary flex flex-row items-center'}>
                                                    <span className={'mr-[8px]'}>Q-Claim</span>
                                                    <div data-tip={t('insurance:terminology:q_claim')} data-for={`q_claim`}>
                                                        <InfoCircle size={14} color={colors.txtSecondary} />
                                                        <Tooltip className="max-w-[200px]" id={'q_claim'} placement="right" />
                                                    </div>
                                                </div>
                                                <div className={'font-semibold flex flex-row hover:cursor-pointer relative'}>
                                                    {state.q_claim > 0 ? Number(state.q_claim.toFixed(decimalList.decimal_q_covered)) : 0}
                                                    <span
                                                        className={'text-red pl-[8px]'}
                                                        onClick={() =>
                                                            setShowChangeUnit({ ...showChangeUnit, isShow: true, name: `${t('insurance:unit:q_claim')}` })
                                                        }
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
                                                <div className={'text-txtSecondary flex flex-row items-center'}>
                                                    <span className={'mr-[8px]'}>Margin</span>
                                                    <div data-tip={t('insurance:terminology:margin')} data-for={`margin`}>
                                                        <InfoCircle size={14} color={colors.txtSecondary} />
                                                        <Tooltip className="max-w-[200px]" id={'margin'} placement="right" />
                                                    </div>
                                                </div>
                                                <div className={'font-semibold flex flex-row hover:cursor-pointer'}>
                                                    {state.margin > 0 ? Number(state.margin.toFixed(decimalList.decimal_margin)) : 0}

                                                    <span
                                                        className={'text-red pl-[8px]'}
                                                        onClick={() => {
                                                            // setShowChangeUnit({ ...showChangeUnit, isShow: true, name: `${t('insurance:unit:margin')}` })
                                                        }}
                                                    >
                                                        {unitMoney}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`flex flex-col justify-center items-center mb-[32px] mx-[16px]`}>
                                            <button
                                                className={`${
                                                    clear.current == true
                                                        ? 'bg-red text-white border border-red'
                                                        : 'text-white bg-divider border border-divider'
                                                }flex items-center justify-center rounded-lg px-auto py-auto font-semibold py-[12px] !px-[100px] xs:px-[148px]`}
                                                onClick={() => {
                                                    handleNext()
                                                }}
                                                disabled={!clear.current}
                                            >
                                                {menu[11].name}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )
            ) : (
                <></>
            )}
        </>
    )
}

export const fetchApiNami = async (symbol: string, from: string, to: string, resolution: string, setDataChart: any, timeLine: number) => {
    try {
        const ts = Math.round(new Date().getTime() / 1000)
        console.log(timeLine)

        const tsYesterday = ts - timeLine * (24 * 3600)
        const params = {
            broker: 'NAMI_SPOT',
            symbol: symbol,
            from: tsYesterday,
            to: ts,
            resolution: resolution,
        }
        const test = await fetchApi({ url: API_GET_PRICE_CHART, baseURL: '', params: params })

        let data: { date: number; value: any }[] = []
        test?.map((item: any) => {
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
                    {t('insurance:guild:the_glossary')}
                </div>
            </div>
        </Modal>
    )
}

export default InsuranceFrom
