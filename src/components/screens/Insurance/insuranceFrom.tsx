import dynamic from 'next/dynamic'
import LayoutInsurance from 'components/layout/layoutInsurance'
import useWeb3Wallet from 'hooks/useWeb3Wallet'
import Button from 'components/common/Button/Button'
import { Menu, Popover, Switch, Tab } from '@headlessui/react'
import { ICoin } from 'components/common/Input/input.interface'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
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
import colors from 'styles/colors'
import GlossaryModal from 'components/screens/Glossary/GlossaryModal'
import InputNumber from 'components/common/Input/InputNumber'
import HeaderContent from './HeaderContent'
import { countDecimals } from 'utils/utils'
import { getUnixTime, sub } from 'date-fns'
import { BTCaddress, DAIaddress, ETHaddress, USDTaddress } from 'components/web3/constants/contractAddress'
import Emitter from 'socket/emitter'
import { PublicSocketEvent } from 'socket/socketEvent'
import FuturesMarketWatch from 'models/FuturesMarketWatch'
import { ethers } from 'ethers'
import { fetchApiNami, getBalance, getInfoCoveredCustom, getInfoCoveredDefault, GuidelineModal, setDefaultValue } from './Insurance'

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

    const assetsToken = useAppSelector((state: RootStore) => state?.setting.assetsToken)
    const pairConfigs = useAppSelector((state: RootStore) => state?.setting.pairConfigs)
    const account = useAppSelector((state: RootStore) => state?.setting.account)
    const publicSocket = useAppSelector((state: RootStore) => state?.socket.publicSocket)

    const min_notinal = useRef(0)
    const clear = useRef<boolean>(false)
    const percentInsurance = useRef<number>(0)
    const percentMargin = useRef<number>(8)
    const table = useRef<any>(null)
    const container = useRef<any>(null)
    const mouseDown = useRef(false)
    const startX = useRef<any>(null)
    const scrollLeft = useRef<any>(null)
    const startY = useRef<any>(null)
    const scrollTop = useRef<any>(null)
    const handleClick = useRef(true)
    const tmp_q_covered = useRef(0)
    const tmp_margin = useRef(0)
    const step = useRef<number>(0)

    const [selectTime, setSelectTime] = useState<string>('1Y')
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
    const [saved, setSaved] = useState<number>(0)
    const [isCanSave, setIsCanSave] = useState<boolean>(false)
    const [userBalance, setUserBalance] = useState<number>(0)
    const [listCoin, setListCoin] = useState<ICoin[]>([])
    const [pair_configs, setPairConfigs] = useState<any>({})
    const [dataChart, setDataChart] = useState()
    const [percentPrice, setPercentPrice] = useState<any>()

    const [rangeQ_covered, setRangeQ_covered] = useState({
        min: 0,
        max: 0,
    })
    const [showInput, setShowInput] = useState<{ isShow: boolean; name: string }>({ isShow: false, name: '' })
    const [showChangeUnit, setShowChangeUnit] = useState({
        isShow: false,
        name: '',
    })
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
    const margin = useRef<number>(0)
    const period = useRef<number>(0)
    const p_claim = useRef<number>(0)
    const q_claim = useRef<number>(0)
    const r_claim = useRef<number>(0)
    const q_covered = useRef<number>(0)
    const p_market = useRef<number>(0)
    const p_expired = useRef<number>(0)

    const [rangeP_claim, setRangeP_claim] = useState({
        min: 0,
        max: 0,
    })
    const [rangeMargin, setRangeMargin] = useState({
        min: 0,
        max: 0,
    })

    const listTime = ['3D', '1W', '1M', '3M', '1Y']

    const dateTransform: any = {
        '3D': {
            resolution: '1m',
            subtract: 'days',
            subtractBy: 3,
        },
        '1W': {
            resolution: '1h',
            subtract: 'weeks',
            subtractBy: 1,
        },
        '1M': {
            resolution: '1d',
            subtract: 'months',
            subtractBy: 1,
        },
        '3M': {
            resolution: '1d',
            subtract: 'months',
            subtractBy: 3,
        },
        '1Y': {
            resolution: '1d',
            subtract: 'years',
            subtractBy: 1,
        },
    }
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

    useEffect(() => {
        if (loadings && isMobile) {
            setTimeout(() => {
                setShowGuide(true)
            }, 1000)
        }
    }, [loadings])

    useEffect(() => {
        step.current = 0
    }, [])

    useEffect(() => {
        if (assetsToken) {
            setDataIcon()
            step.current = 1
        } else {
            return
        }
    }, [assetsToken])

    useEffect(() => {
        if (step.current === 1) {
            getConfig(selectCoin?.type)
        }
        runSocket()
    }, [selectCoin, publicSocket, listCoin])
    const timer = useRef<any>(null)

    useEffect(() => {
        getDefaultValue()
    }, [selectCoin])

    useEffect(() => {
        getBalaneToken(selectCoin?.type)
        getDefaultValue()
        runSocket()
        timer.current = setInterval(() => {
            getBalaneToken(selectCoin?.type)
            getDefaultValue()
            runSocket()
        }, 10000)
        return () => {
            clearInterval(timer.current)
        }
    }, [selectCoin])

    useEffect(() => {
        getDefaultValue()
        if (pair_configs && p_market.current) {
            if (!account.address) {
                setUserBalance(0)
                percentInsurance.current = 0
                percentMargin.current = 0
                setDefaultValue(0, p_market.current, pair_configs.filters).then(async (res) => {
                    const _res = await res
                    if (_res) {
                        q_covered.current = _res?.q_covered
                        margin.current = _res?.margin
                        period.current = _res?.period
                        p_claim.current = _res?.p_claim
                    }
                })
            } else {
                getBalaneToken(selectCoin?.type)
                    .then(async (res) => {
                        const balance = await res
                        setDefaultValue(balance, p_market.current, pair_configs.filters).then(async (e) => {
                            const value = await e
                            if (value) {
                                q_covered.current = value.q_covered
                                margin.current = value.margin
                                period.current = value.period
                                p_claim.current = value.p_claim
                            }
                        })
                    })
                    .then(async () => {
                        if (tab === 0) {
                            setTimeout(() => {
                                const res = getInfoCoveredDefault(p_market.current, q_covered.current, p_claim.current, decimalList)
                                if (res) {
                                    p_expired.current = res?.p_expired
                                    q_claim.current = res?.q_claim
                                    r_claim.current = res?.r_claim
                                    margin.current = res?.margin!
                                }
                                createSaved()
                                clear.current = handleCheckFinal()
                            }, 1000)
                        } else {
                            setTimeout(() => {
                                const result = getInfoCoveredCustom(margin.current, q_covered.current, p_claim.current, p_market.current, decimalList)
                                if (result) {
                                    p_expired.current = result?.p_expired
                                    q_claim.current = result?.q_claim
                                    r_claim.current = result?.r_claim
                                }
                                createSaved()
                                clear.current = handleCheckFinal()
                            }, 1000)
                        }
                    })
            }
        }
        createSaved()
    }, [pair_configs, selectCoin, account, p_market])

    useEffect(() => {
        getDefaultValue()
    }, [userBalance])

    const getDefaultValue = () => {
        if (userBalance && p_market.current && pair_configs) {
            setDefaultValue(userBalance, p_market.current, pair_configs.filters).then(async (e) => {
                const value = await e
                if (value) {
                    q_covered.current = value.q_covered
                    margin.current = value.margin
                    period.current = value.period
                    p_claim.current = value.p_claim
                }
            })
        }
    }

    const runSocket = () => {
        if (publicSocket && selectCoin?.symbol) publicSocket.emit('subscribe:futures:ticker', selectCoin?.symbol)

        refreshApi(selectTime, selectCoin)

        Emitter.on(PublicSocketEvent.FUTURES_TICKER_UPDATE + selectCoin?.symbol, (data) => {
            const pairPrice = FuturesMarketWatch.create(data)
            if (pairPrice?.lastPrice) {
                p_market.current = +pairPrice?.lastPrice
            }
        })

        return () => {
            if (publicSocket) publicSocket?.emit('unsubscribe:futures:ticker', selectCoin?.symbol)
            Emitter.off(PublicSocketEvent.FUTURES_TICKER_UPDATE)
        }
    }

    useEffect(() => {
        createSaved()
        clear.current = handleCheckFinal()
    }, [q_covered, p_claim, p_market, margin])

    useEffect(() => {
        if (tab === 0 && q_covered.current && p_claim.current && period.current) {
            const res = getInfoCoveredDefault(p_market.current, q_covered.current, p_claim.current, decimalList)
            if (res) {
                p_expired.current = res?.p_expired
                q_claim.current = res?.q_claim
                r_claim.current = res?.r_claim
                margin.current = res?.margin
            }
        } else {
            const result = getInfoCoveredCustom(margin.current, q_covered.current, p_claim.current, p_market.current, decimalList)
            if (result) {
                p_expired.current = result?.p_expired
                q_claim.current = result?.q_claim
                r_claim.current = result?.r_claim
            }
        }
    }, [tab, p_claim, q_covered])

    useEffect(() => {
        if (showGuide) {
            return setTab(1)
        } else {
            return
        }
    }, [showGuide])

    useEffect(() => {
        loadValidator()
    }, [pair_configs, q_covered, selectCoin, p_claim, userBalance, selectCoin])

    const loadValidator = () => {
        const _decimalList = { ...decimalList }
        let _percentPrice: any
        if (pair_configs?.filters && pair_configs?.filters.length > 0) {
            pair_configs?.filters?.map(async (item: any) => {
                if (item?.filterType === 'MIN_NOTIONAL') {
                    min_notinal.current = item?.notional
                }
                if (item?.filterType === 'LOT_SIZE') {
                    if (userBalance) {
                        const decimal = countDecimals(item.stepSize)
                        _decimalList.decimal_q_covered = +decimal
                        const min_Market = +(min_notinal.current / p_market.current).toFixed(+decimal)

                        const max = Number(item?.maxQty) < userBalance ? Number(item?.maxQty) : userBalance

                        if (min_Market == Infinity) {
                            const min = Number(item?.minQty)
                            setRangeQ_covered({ ...rangeQ_covered, min: Number(min.toFixed(+decimal)), max: Number(max.toFixed(+decimal)) })
                        } else {
                            const min = Number(item?.minQty) > min_Market ? Number(item?.minQty) : min_Market
                            setRangeQ_covered({ ...rangeQ_covered, min: Number(min.toFixed(+decimal)), max: Number(max.toFixed(+decimal)) })
                        }
                    }
                }
                if (item?.filterType === 'PERCENT_PRICE') {
                    _percentPrice = item
                }
                if (item?.filterType === 'PRICE_FILTER') {
                    const decimal_p_claim = countDecimals(Number(item.tickSize))

                    _decimalList.decimal_p_claim = +decimal_p_claim

                    const min1 = p_market.current + (2 / 100) * p_market.current
                    const max1 = p_market.current + (70 / 100) * p_market.current

                    const min2 = p_market.current - (70 / 100) * p_market.current
                    const max2 = p_market.current - (2 / 100) * p_market.current

                    if (p_claim.current > p_market.current) {
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

                    const MIN = Number((q_covered.current * p_market.current * item.minQtyRatio).toFixed(Number(decimalMargin)))
                    const MAX = Number((q_covered.current * p_market.current * item.maxQtyRatio).toFixed(Number(decimalMargin)))
                    setRangeMargin({ ...rangeP_claim, min: MIN, max: MAX })
                }
                setDecimalList({ ..._decimalList })
                setPercentPrice({ ..._percentPrice })
                validateP_Claim(p_claim.current)
            })
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
                                tmp_q_covered.current = q_covered.current
                            }}
                        >
                            {' '}
                            {width && width < 513 && width >= 437 && <br />}
                            {q_covered.current}{' '}
                        </span>
                    </label>
                    <span
                        className="text-redPrimary z-1"
                        onClick={() => {
                            setOpenChangeToken(true)
                            tmp_q_covered.current = q_covered.current
                        }}
                    >
                        {selectCoin?.type}{' '}
                    </span>
                    {p_claim.current > 0 && (
                        <>
                            {t('insurance:buy_mobile:at')} <span className="text-redPrimary">${p_claim.current} </span>
                            {tab != 1 && '?'}
                        </>
                    )}
                    {tab == 1 && (
                        <>
                            {t('insurance:buy_mobile:and')} {t('insurance:buy_mobile:margin')}{' '}
                            <label>
                                <span className="text-redPrimary">
                                    <span
                                        onClick={() => {
                                            setShowInput({ isShow: true, name: 'margin' })
                                            tmp_margin.current = margin.current
                                        }}
                                    >
                                        {margin.current && margin.current}{' '}
                                    </span>
                                    <span
                                        onClick={() => {
                                            setShowInput({ isShow: true, name: 'margin' })
                                            tmp_margin.current = margin.current
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

    const refreshApi = (
        selectTime: string | undefined,
        selectCoin: { id?: string; name?: string; icon?: string; disable?: boolean | undefined; symbol?: string; type: any },
    ) => {
        const timeBegin = new Date()
        setLoadings(true)

        const currentTimeStamp = getUnixTime(new Date())
        try {
            if (selectCoin?.symbol !== '') {
                const currentSelected = dateTransform[selectTime!]
                const dateBegin = getUnixTime(sub(timeBegin, { [currentSelected.subtract]: currentSelected.subtractBy }))
                timeBegin.setDate(dateBegin)
                fetchApiNami(
                    `${selectCoin?.type && selectCoin?.type}${unitMoney}`,
                    `${dateBegin}`,
                    `${currentTimeStamp}`,
                    dateTransform[selectTime!].resolution,
                    setDataChart,
                )
            }
        } catch (err) {
            console.log(err)
        } finally {
            setLoadings(false)
        }
    }

    const setDataIcon = () => {
        const res = getStorage()
        const tokenFilter = assetsToken.map((rs: any) => {
            return {
                icon: rs?.attachment,
                id: rs?._id,
                name: rs?.name,
                symbol: `${rs?.symbol}USDT`,
                type: rs?.symbol,
                disable: !rs?.isActive,
            }
        })
        setListCoin(tokenFilter)

        const time = setTimeout(() => {
            if (res) {
                if (!res.form_history) {
                    let itemFilter = tokenFilter.find((rs: any) => rs.type === res?.type)
                    handleUpdateToken(itemFilter)
                } else {
                    let itemFilter = tokenFilter.find((rs: any) => rs.type === res?.type)
                    handleUpdateToken(itemFilter)
                    clear.current = false
                }
            } else {
                let itemFilter = tokenFilter.find((rs: any) => rs.type === 'BNB')
                handleUpdateToken(itemFilter)
            }
            clearTimeout(time)
            step.current = step.current + 1
            loadValidator()
        }, 500)
    }

    const createSaved = () => {
        if (q_covered.current <= 0 || p_claim.current <= 0) {
            return setSaved(0)
        } else {
            const y = q_covered.current * (p_claim.current - p_market.current)
            const z = q_covered.current * Math.abs(p_claim.current - p_market.current)

            if (p_claim.current < p_market.current) {
                setSaved(q_claim.current + y - margin.current + z)
            } else {
                setSaved(q_claim.current + y - margin.current)
            }
        }
    }

    const validateP_Claim = (value: number) => {
        const _rangeP_claim = rangeP_claim

        //Pm*multiplierDown/Up
        const PmDown = p_market.current * percentPrice?.multiplierDown
        const PmUp = p_market.current * percentPrice?.multiplierUp
        //+-2 -> +-70
        const min1 = p_market.current + (2 / 100) * p_market.current
        const max1 = p_market.current + (70 / 100) * p_market.current

        const min2 = p_market.current - (70 / 100) * p_market.current
        const max2 = p_market.current - (2 / 100) * p_market.current

        if (p_claim.current < p_market.current) {
            const min = min2 > PmDown ? PmDown : min2
            const max = max2 > PmUp ? PmUp : max2
            _rangeP_claim.min = +min.toFixed(decimalList.decimal_p_claim)
            _rangeP_claim.max = +max.toFixed(decimalList.decimal_p_claim)
            return setRangeP_claim({ ..._rangeP_claim })
        }
        if (p_claim.current > p_market.current) {
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
                    q_covered.current > Number(rangeQ_covered?.max?.toFixed(decimalList.decimal_q_covered)) ||
                    q_covered.current < rangeQ_covered?.min ||
                    q_covered.current <= 0
                )
                rs.message = `<div class="flex items-center ">
                    ${
                        q_covered.current > Number(rangeQ_covered?.max?.toFixed(decimalList.decimal_q_covered))
                            ? t('common:available', {
                                  value: `${Number(rangeQ_covered?.max?.toFixed(decimalList.decimal_q_covered))}`,
                              })
                            : t('common:min', { value: rangeQ_covered.min })
                    }
                </div>`
                break
            case 'p_claim':
                rs.isValid = !(p_claim.current < rangeP_claim.min || p_claim.current > rangeP_claim.max)
                rs.message = `<div class="flex items-center">
                ${p_claim.current < p_market.current ? 'P-Claim < P-Market: ' : 'P-Claim > P-Market: '}
                  ${
                      p_claim.current > Number(rangeP_claim.max)
                          ? t('common:max', { value: `${Number(rangeP_claim.max)}` })
                          : t('common:min', { value: `${Number(rangeP_claim.min)}` })
                  }
                  </div>`
                break
            case 'margin':
                rs.isValid = !(margin.current < Number(rangeMargin.min) || margin.current > Number(rangeMargin.max) || margin.current <= 0)
                rs.message = `<div class="flex items-center">
                ${
                    margin.current > Number(rangeMargin.max)
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

    const handleUpdateToken = (coin: ICoin) => {
        if (publicSocket) publicSocket?.emit('unsubscribe:futures:ticker', selectCoin?.symbol)
        Emitter.off(PublicSocketEvent.FUTURES_TICKER_UPDATE)
        setSelectedCoin(coin)
        setSaved(0)
        setChosing(false)
        localStorage.setItem('buy_covered_state', JSON.stringify(coin))
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
                <img alt={''} src={`${selectCoin && selectCoin?.icon}`} width="20" height="20" className={'mr-1 rounded-[50%]'}></img>
                <span className={'whitespace-nowrap text-red mr-2'}>{selectCoin && selectCoin?.name}</span>
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
                                        }}
                                        onClick={() => {
                                            close()
                                            handleUpdateToken(coin)
                                        }}
                                        className={`${
                                            isPress ? 'bg-gray-1' : 'hover:bg-hover'
                                        } flex flex-row justify-start w-full items-center p-3 font-medium`}
                                    >
                                        <div className="max-w-[20px] mr-[0.5rem] max-h-[20px] ">
                                            <img alt={''} src={`${coin.icon}`} width="20" height="20" className={'mr-[5px] rounded-[50%]'}></img>
                                        </div>
                                        <div className={'flex flex-row justify-between w-full text-sm'}>
                                            <span className={'hover:cursor-default'}>{coin.name}</span>
                                            {coin.id === selectCoin?.id ? <Check size={16} className={'text-red'}></Check> : ''}
                                        </div>
                                    </div>
                                ) : (
                                    <a
                                        id={`${coin.id}`}
                                        key={key}
                                        className={`hover:bg-hover flex flex-row justify-start w-full items-center p-3 text-divider font-medium`}
                                    >
                                        <div className="max-w-[20px] mr-[0.5rem] max-h-[20px] ">
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

    const onHandleChange = (key: string, e: any) => {
        const value = +e.value

        if (userBalance > 0 && key === 'margin') {
            const percent2 = Number(rangeMargin.min)
            const percent5 = Number((q_covered.current * p_market.current * 0.05).toFixed(decimalList.decimal_margin))
            const percent7 = Number((q_covered.current * p_market.current * 0.07).toFixed(decimalList.decimal_margin))
            const percent10 = Number(rangeMargin.max)
            switch (value) {
                case percent2:
                    percentMargin.current = 2
                    break
                case percent5:
                    percentMargin.current = 5
                    break
                case percent7:
                    percentMargin.current = 7
                    break
                case percent10:
                    percentMargin.current = 10
                    break
                default:
                    percentMargin.current = 0
                    break
            }
        } else {
            percentMargin.current = 0
        }

        if (key === 'q_covered') {
            if (userBalance > 0) {
                const percent25 = Number((0.25 * userBalance).toFixed(decimalList.decimal_q_covered))
                const percent50 = Number((0.5 * userBalance).toFixed(decimalList.decimal_q_covered))
                const percent75 = Number((0.75 * userBalance).toFixed(decimalList.decimal_q_covered))
                const percent100 = Number(userBalance)

                switch (value) {
                    case percent25:
                        percentInsurance.current = 25
                        break
                    case percent50:
                        percentInsurance.current = 50
                        break
                    case percent75:
                        percentInsurance.current = 75
                        break
                    case percent100:
                        percentInsurance.current = 100
                        break
                    default:
                        percentInsurance.current = 0
                        break
                }
            } else {
                percentInsurance.current = 0
            }
        }

        switch (key) {
            case 'q_covered':
                q_covered.current = value
                if (value == 0 || q_covered.current.toString().length > value.toString().length) {
                    percentInsurance.current = 0
                }
                if (value > Number(rangeQ_covered?.max?.toFixed(decimalList.decimal_q_covered)) || value < rangeQ_covered.min || value <= 0) {
                    setIsCanSave(false)
                } else {
                    setIsCanSave(true)
                }

                break
            case 'p_claim':
                p_claim.current = value

                break
            case 'margin':
                if (value == 0 || margin.current.toString().length > value.toString().length) {
                    percentMargin.current = 0
                }
                margin.current = value
                if (value < Number(rangeMargin.min) || value > Number(rangeMargin.max) || value <= 0) {
                    setIsCanSave(false)
                } else {
                    setIsCanSave(true)
                }

                break
            default:
                break
        }
    }

    const handleCheckFinal = () => {
        if (account.address == null) {
            return false
        } else if (q_covered.current <= 0 || margin.current <= 0 || p_claim.current <= 0) {
            return false
        } else if (userBalance == null || userBalance == 0) {
            return false
        } else {
            return true
        }
    }

    const startDragging = (e: any) => {
        container.current.classList.add('cursor-grabbing')
        mouseDown.current = true
        startX.current = e.pageX - table.current.offsetLeft
        scrollLeft.current = table.current.scrollLeft

        startY.current = e.pageY - table.current.offsetTop
        scrollTop.current = table.current.scrollTop
        handleClick.current = true
    }

    const stopDragging = (event: any) => {
        container.current.classList.remove('cursor-grabbing')
        mouseDown.current = false
    }

    const updateFormPercentMargin = (value: number) => {
        if (!account.address) {
            return
        }
        if (q_covered.current > 0 && account.address) {
            percentMargin.current = value

            if (value == 2) {
                margin.current = rangeMargin.min
            } else if (value == 10) {
                margin.current = rangeMargin.max
            } else {
                margin.current = Number(((value / 100) * q_covered.current * p_market.current).toFixed(decimalList.decimal_margin))
            }
        }
    }

    const updateFormQCovered = (data: number) => {
        if (!account.address) {
            return
        } else {
            percentInsurance.current = data
            if (data === 25) {
                q_covered.current = Number((0.25 * userBalance).toFixed(decimalList.decimal_q_covered))
            } else if (data === 100) {
                q_covered.current = userBalance
            } else {
                q_covered.current = Number(((data / 100) * userBalance).toFixed(decimalList.decimal_q_covered))
            }
        }
    }

    const getConfig = (symbol: string) => {
        if (pairConfigs) {
            const item = pairConfigs.find((i: any) => {
                if (i.baseAsset === symbol) {
                    return i
                }
            })
            if (item) {
                runSocket()
                return setPairConfigs(item)
            }
        }
    }

    const getStorage = () => {
        const data = localStorage.getItem('buy_covered_state')
        if (data !== 'undefined' && data) {
            const res = JSON.parse(data.toString())
            return res
        } else {
            return false
        }
    }

    const handleNext = () => {
        const query = {
            r_claim: Number(r_claim.current),
            q_claim: Number(q_claim.current),
            margin: Number(margin.current),
            period: Number(period.current),
            symbol: selectCoin?.type,
            unit: unitMoney,
            p_claim: Number(p_claim.current),
            tab: tab,
            q_covered: Number(q_covered.current),
            p_market: Number(p_market.current),
            decimalList: { ...decimalList },
        }
        localStorage.setItem('info_covered_state', JSON.stringify(query))
        return router.push('/buy-covered/info-covered')
    }

    const getBalaneToken = async (symbol: string) => {
        try {
            if (account?.address) {
                const _list = [
                    {
                        name: 'USDT',
                        address: USDTaddress,
                    },
                    {
                        name: 'BTC',
                        address: BTCaddress,
                    },
                    {
                        name: 'ETH',
                        address: ETHaddress,
                    },
                    {
                        name: 'DAI',
                        address: DAIaddress,
                    },
                    {
                        name: 'BNB',
                        address: '',
                    },
                ]
                const _item = _list.find((e: any) => {
                    return e.name === symbol
                })

                if (_item) {
                    const res = getBalance(`${_item.name}`, account?.address, _item?.address, decimalList.decimal_q_covered)
                    setUserBalance(await res)
                    return await res
                }
            }
        } catch (err) {
            setUserBalance(0)
        }
    }

    return (
        <>
            {<GlossaryModal visible={showDetails} onClose={() => setShowDetails(false)} />}
            {isMobile && <Guide start={showGuide} setStart={setShowGuide} />}
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
                            {account?.address != null && (
                                <div className="w-full bg-[#E5E7E8]  h-[0.25rem] sticky top-[4.1875rem] z-[50]">
                                    <div className="bg-red h-[0.25rem] w-1/2"></div>
                                </div>
                            )}
                            <div className="px-4 mb:px-10 lg:px-20">
                                <div className="max-w-screen-layout 4xl:max-w-screen-3xl m-auto">
                                    <HeaderContent state={tab} setState={setTab} wallet={wallet} auth={account.address} />

                                    <div className="flex flex-row mb-[8rem] overflow-hidden">
                                        <div className="w-8/12">
                                            {
                                                <div
                                                    className={`shadow border border-1 border-divider h-auto rounded-xl  p-8`}
                                                    onClick={() => {
                                                        setChosing(false)
                                                    }}
                                                >
                                                    <div id="tour_statistics" data-tut="tour_statistics">
                                                        <div className={'pb-2 text-sm leading-5 text-txtSecondary flex items-center space-x-6'}>
                                                            <div className={'w-1/2 flex flex-row items-center'}>
                                                                <span className="mr-2">{menu[7].name}</span>
                                                                <div data-tip={t('insurance:terminology:q_covered')} data-for={`q_covered`}>
                                                                    <InfoCircle size={14} color={colors.txtSecondary} />
                                                                    <Tooltip className="max-w-[200px]" id={'q_covered'} placement="right" />
                                                                </div>
                                                            </div>
                                                            <div className={'w-1/2 flex flex-row justify-end text-right'}>
                                                                <span className="mr-2">{t('common:available', { value: userBalance })}</span>
                                                            </div>
                                                        </div>
                                                        <div className={'pb-2 space-x-6 flex justify-between'}>
                                                            <div className={`flex justify-between border-collapse rounded-[3px] shadow-none w-full`}>
                                                                <InputNumber
                                                                    validator={validator('q_covered')}
                                                                    value={q_covered.current}
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
                                                                            updateFormQCovered(data)
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

                                                    <div data-tut="tour_chart" id="tour_chart" className="mt-6 mb-4">
                                                        <div className={'flex flex-row relative'}>
                                                            <Suspense fallback={`Loading...`}>
                                                                <ChartComponent
                                                                    width={795}
                                                                    height={280}
                                                                    data={dataChart}
                                                                    state={{
                                                                        period: period.current,
                                                                        q_covered: q_covered.current,
                                                                        margin: margin.current,
                                                                        p_claim: p_claim.current,
                                                                        p_market: p_market.current,
                                                                    }}
                                                                    setP_Claim={(data: number) => {
                                                                        onHandleChange('p_claim', data)
                                                                    }}
                                                                    setP_Market={(data: number) => {
                                                                        return (p_market.current = data)
                                                                    }}
                                                                    resolution={selectTime!}
                                                                />
                                                                <svg
                                                                    className={`absolute right-0 z-2`}
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
                                                                value={p_claim.current}
                                                                onChange={(e: any) => onHandleChange('p_claim', e)}
                                                                customSuffix={() => unitMoney}
                                                                suffixClassName="text-txtSecondary"
                                                                placeholder={`${menu[9].name}`}
                                                                decimal={decimalList.decimal_p_claim}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className={'mt-5 text-sm '} data-tut="tour_period" id="tour_period">
                                                        <span className="flex flex-row items-center text-txtSecondary">
                                                            <span className={'mr-[0.5rem]'}>Period ({menu[8].name})</span>
                                                            <div data-tip={t('insurance:terminology:period')} data-for={`period`}>
                                                                <InfoCircle size={14} color={colors.txtSecondary} />
                                                                <Tooltip className="max-w-[200px]" id={'period'} placement="right" />
                                                            </div>
                                                        </span>
                                                        <Tab.Group>
                                                            <Tab.List
                                                                className={`flex flex-row mt-4 justify-between ${
                                                                    showCroll ? 'overflow-scroll' : ' overflow-hidden'
                                                                } hide-scroll`}
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
                                                                                period.current === item && 'bg-pink text-red font-semibold'
                                                                            } bg-hover rounded-[300px] ${
                                                                                key != 0 ? 'ml-[0.75rem]' : ''
                                                                            } px-4 py-1 flex justify-center items-center hover:cursor-pointer ${
                                                                                isMobile && !(item == 15) && 'mr-[12px]'
                                                                            }`}
                                                                            onClick={() => (period.current = item)}
                                                                        >
                                                                            {item}
                                                                        </div>
                                                                    )
                                                                })}
                                                            </Tab.List>
                                                        </Tab.Group>
                                                    </div>
                                                </div>
                                            }
                                        </div>

                                        <div className="w-4/12 flex flex-col justify-between shadow border border-1 border-divider rounded-xl p-8 ml-[1.5rem]">
                                            <div>
                                                {saved > 0 && (
                                                    <div
                                                        className={
                                                            'flex flex-col justify-center items-center mb-[2.5rem] max-w-7xl 4xl:max-w-screen-3xl m-auto'
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
                                                )}
                                                {
                                                    <div
                                                        className={'flex flex-col w-full justify-center items-center hover:cursor-default z-50'}
                                                        onClick={() => {
                                                            setChosing(false)
                                                        }}
                                                    >
                                                        <div
                                                            className={`flex flex-row justify-between items-center w-full rounded-[12px] border border-divider border-0.5 px-5 py-4`}
                                                        >
                                                            <div className={'text-txtSecondary flex flex-row items-center'}>
                                                                <span className={'mr-[0.5rem]'}>R-Claim</span>
                                                                <div data-tip={t('insurance:terminology:r_claim')} data-for={`r_claim`}>
                                                                    <InfoCircle size={14} color={colors.txtSecondary} />
                                                                    <Tooltip className="max-w-[200px]" id={'r_claim'} placement="right" />
                                                                </div>
                                                            </div>
                                                            <div className={''}>
                                                                <span>
                                                                    {r_claim.current > 0 ? Number(r_claim.current.toFixed(decimalList.decimal_q_covered)) : 0}%
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className={` flex flex-row justify-between items-center w-full rounded-[12px] border border-divider border-0.5 px-5 py-4 my-[1rem]`}
                                                        >
                                                            <div className={'text-txtSecondary flex flex-row items-center'}>
                                                                <span className={'mr-[0.5rem]'}>Q-Claim</span>
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
                                                                {q_claim.current > 0 ? Number(q_claim.current.toFixed(decimalList.decimal_q_covered)) : 0}
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
                                                                <span className={'mr-[0.5rem]'}>Margin</span>
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
                                                                {margin.current > 0 ? Number(margin.current.toFixed(decimalList.decimal_margin)) : 0}
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
                                                                        value={margin.current}
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
                                                }
                                            </div>

                                            {
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
                                                        <Menu.Button className={'my-[1rem] text-blue underline hover:cursor-pointer'}>
                                                            {menu[12].name}
                                                        </Menu.Button>
                                                        <Menu.Items
                                                            className={'flex flex-col text-txtPrimary text-sm'}
                                                            style={{ boxShadow: '0px 3px 5px rgba(9, 30, 66, 0.2), 0px 0px 1px rgba(9, 30, 66, 0.31)' }}
                                                        >
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <a
                                                                        href="https://nami.today/bao-hiem-trong-crypto-manh-dat-mau-mo-can-duoc-khai-pha/"
                                                                        className={`${active && 'bg-blue-500'}  py-[0.5rem] pl-[1rem] w-[300px] hover:bg-hover`}
                                                                        onClick={() => {
                                                                            router.push(
                                                                                'https://nami.today/bao-hiem-trong-crypto-manh-dat-mau-mo-can-duoc-khai-pha/',
                                                                            )
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
                                                                        }  py-[0.5rem] pl-[1rem] w-[300px] hover:bg-hover hover:cursor-pointer`}
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
                                            }
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
                                    <div className="px-[1rem] pt-[0.5rem]" onClick={() => router.push('/home')}>
                                        <XMark />
                                    </div>
                                    <div className="flex flex-col items-center px-[3.75rem] pt-[0.5rem]">
                                        <img src={'/images/icons/ic_pig.png'} width="269" height="212" className="w-[17rem] h-auto" />
                                    </div>
                                </div>
                                <div className="flex flex-col items-center pt-[1rem] text-txtPrimary">
                                    <span className="text-xl font-semibold ">Nami Insurance</span>
                                    <span className="text-center text-sm pt-[0.75rem] w-[342px] h-[40px]">
                                        {t('insurance:mobile_login:sub_title1')} - {t('insurance:mobile_login:sub_title2')}
                                    </span>
                                </div>
                                <div className="px-[1.5rem] flex flex-col justify-center mt-[1.75rem] mb-[3rem]">
                                    <div className="flex flex-row">
                                        <div className="pr-[1rem]">
                                            <BxDollarCircle />
                                        </div>
                                        <div className="flex flex-col pr-[7px]">
                                            <span className="text-txtPrimary text-sm font-semibold">{t('insurance:mobile_login:token')}</span>
                                            <span className="text-sm text-txtSecondary">{t('insurance:mobile_login:token_detail')}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-row my-[24px]">
                                        <div className="pr-[1rem]">
                                            <BxLineChartDown />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-txtPrimary text-sm font-semibold">{t('insurance:mobile_login:p_claim')}</span>
                                            <span className="text-sm text-txtSecondary">{t('insurance:mobile_login:p_claim_detail')}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-row">
                                        <div className="pr-[1rem]">
                                            <BxCaledarCheck />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-txtPrimary text-sm font-semibold">{t('insurance:mobile_login:period')}</span>
                                            <span className="text-sm text-txtSecondary">{t('insurance:mobile_login:period_detial')}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-center mb-[1rem]">
                                    <Button
                                        variants={'primary'}
                                        className={`bg-red text-sm font-semibold h-[40.5rem] w-[95%] tiny:w-[374px] flex justify-center items-center text-white rounded-[0.5rem] py-[12px]`}
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
                                                                className="w-full flex flex-row justify-between items-center hover:bg-gray-1 hover:pl-[0.5rem] font-normal"
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
                                        className={`!sticky !bottom-0 !left-0 !rounded-none !translate-x-0 !translate-y-0 h-1/2 !max-w-full`}
                                        onBackdropCb={() => {
                                            setShowInput({ ...showInput, isShow: false, name: '' })
                                            if (showInput.name == 'q_covered') {
                                                // setState({ ...state, q_covered: tmp_q_covered.current })
                                            }
                                            if (showInput.name == 'margin') {
                                                // setState({ ...state, margin: tmp_margin.current })
                                            }
                                        }}
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
                                                            value={q_covered.current}
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
                                                            value={margin.current}
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
                                                                    updateFormQCovered(data)
                                                                }}
                                                                onTouchStart={() => {
                                                                    updateFormQCovered(data)
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
                                                                onTouchStart={() => {
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
                                                } h-[40.5rem] w-full flex justify-center items-center text-white rounded-[0.5rem] py-[12px]`}
                                                onClick={() => {
                                                    setShowInput({ ...showInput, isShow: false, name: '' })
                                                }}
                                            >
                                                {t('insurance:buy:save')}
                                            </Button>
                                        </div>
                                    </Modal>
                                )}
                                {openChangeToken && (
                                    <Modal
                                        wrapClassName="!w-full"
                                        containerClassName="!w-full"
                                        portalId="modal"
                                        isVisible={true}
                                        className=" bg-white !max-w-full !w-full !sticky !bottom-0 !left-0 !rounded-none !translate-x-0 !translate-y-0 h-1/2"
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
                                                                    handleUpdateToken(coin)
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
                                                                    {coin.id === selectCoin?.id ? <Check size={16} className={'text-red'}></Check> : ''}
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
                                                                    {coin.id === selectCoin?.id ? <Check size={16} className={'text-red'}></Check> : ''}
                                                                </div>
                                                            </a>
                                                        )
                                                    })}
                                            </div>
                                        </div>
                                    </Modal>
                                )}
                                {
                                    <div className={`h-[32px] flex flex-row justify-between items-center mx-[1rem] mt-[24px] mb-[1rem]  top-0 bg-white z-50`}>
                                        <div
                                            onClick={() => {
                                                router.push('/home')
                                            }}
                                        >
                                            <ArrowLeft />
                                        </div>
                                        <div data-tut="tour_custom" id="tour_custom" className={`h-[32px] flex flex-row mx-[1rem]`}>
                                            <span
                                                className={'text-blue underline hover:cursor-pointer pr-[1rem] flex items-center'}
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
                                                    checked={tab == 1 ? true : false}
                                                    onChange={() => {
                                                        if (tab == 1) {
                                                            return setTab(0)
                                                        } else {
                                                            setShowInput({ isShow: true, name: 'margin' })
                                                            return setTab(1)
                                                        }
                                                    }}
                                                    className={`${
                                                        tab == 1 ? 'bg-red' : 'bg-[#F2F3F4]'
                                                    } relative inline-flex items-center h-[1rem] rounded-full w-[32px] transition-colors shadow-sm`}
                                                >
                                                    <span
                                                        className={`${
                                                            tab == 1 ? 'translate-x-[1.25rem] bg-[white]' : 'translate-x-1 bg-[#B2B7BC]'
                                                        } inline-block w-[6px] h-[6px] transform bg-white rounded-full transition-transform text-white/[0]`}
                                                    >
                                                        {tab == 1 ? 'Enable' : 'Disable'}
                                                    </span>
                                                </Switch>
                                                <span className="pl-[0.5rem]">{t('insurance:buy:change')}</span>
                                            </div>
                                        </div>
                                    </div>
                                }

                                {
                                    <div
                                        data-tut="tour_statistics"
                                        id="tour_statistics"
                                        className=" my-[24px] w-full mx-auto flex flex-wrap flex-col justify-center content-center font-bold text-2xl relative "
                                    >
                                        {componentsInputMobile()}
                                    </div>
                                }
                                {
                                    <div data-tut="tour_chart" id="tour_chart" className="">
                                        <div className={'flex flex-row relative'}>
                                            <Suspense fallback={`Loading...`}>
                                                <ChartComponent
                                                    width={358}
                                                    height={252}
                                                    data={dataChart}
                                                    state={{
                                                        period: period.current,
                                                        q_covered: q_covered.current,
                                                        margin: margin.current,
                                                        p_claim: p_claim.current,
                                                        p_market: p_market.current,
                                                    }}
                                                    setP_Claim={(data: number) => (p_claim.current = data)}
                                                    setP_Market={(data: number) => (p_market.current = data)}
                                                    isMobile={isMobile}
                                                    resolution={selectTime!}
                                                ></ChartComponent>
                                            </Suspense>
                                            <svg
                                                className={`absolute right-1 z-2`}
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
                                                value={p_claim.current}
                                                onChange={(e: any) => onHandleChange('p_claim', e)}
                                                customSuffix={() => unitMoney}
                                                suffixClassName="text-txtSecondary"
                                                placeholder={`${menu[9].name}`}
                                                decimal={decimalList?.decimal_p_claim}
                                            />
                                        </div>
                                    </div>
                                }
                                {/* Period */}
                                {
                                    <div data-tut="tour_period" id="tour_period" className={'mt-5 pl-[32px] pr-[32px] pb-[32px] text-sm text-txtSecondary'}>
                                        <span className="flex flex-row items-center">
                                            <span className={'mr-[0.5rem]'}>Period ({menu[8].name})</span>
                                            <div data-tip={t('insurance:terminology:period')} data-for={`period`}>
                                                <InfoCircle size={14} color={colors.txtSecondary} />
                                                <Tooltip className="max-w-[200px]" id={'period'} placement="right" />
                                            </div>
                                        </span>
                                        <div ref={table} className="overflow-auto hide-scroll scroll-table">
                                            <div
                                                ref={container}
                                                className={`hide-scroll flex flex-row justify-between mt-[1rem]  ${isMobile ? 'w-full' : 'w-[85%]'} `}
                                            >
                                                {listTabPeriod.map((item, key) => {
                                                    if (item === period.current || item <= item + 6)
                                                        return (
                                                            <div
                                                                key={key}
                                                                className={`${
                                                                    period.current == item && 'bg-[#FFF1F2] text-red'
                                                                } bg-hover rounded-[300px] p-3 h-[32px] w-[49px] flex justify-center items-center hover:cursor-pointer ${
                                                                    isMobile && !(item == 15) && 'mr-[12px]'
                                                                }`}
                                                                onClick={() => {
                                                                    // setState({ ...state, period: item })
                                                                }}
                                                            >
                                                                {item}
                                                            </div>
                                                        )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                }

                                {clear.current && (
                                    <>
                                        {
                                            <div
                                                onClick={() => {
                                                    setChosing(false)
                                                }}
                                                className={`${clear ? 'visible' : 'invisible'} items-center w-[300px] xs:w-full`}
                                            >
                                                {saved > 0 && (
                                                    <div className={'flex justify-center items-center mt-[24px] mx-[1rem]'}>
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
                                                    <div className={` flex flex-row justify-between items-center rounded-[12px] px-[24px] py-[1rem] mx-[12px]`}>
                                                        <div className={'text-txtSecondary flex flex-row items-center'}>
                                                            <span className={'mr-[0.5rem]'}>R-Claim</span>
                                                            <div data-tip={t('insurance:terminology:r_claim')} data-for={`r_claim`}>
                                                                <InfoCircle size={14} color={colors.txtSecondary} />
                                                                <Tooltip className="max-w-[200px]" id={'r_claim'} placement="right" />
                                                            </div>
                                                        </div>
                                                        <div className={'font-semibold'}>
                                                            <span>
                                                                {r_claim.current > 0 ? Number(r_claim.current.toFixed(decimalList.decimal_q_covered)) : 0}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className={` flex flex-row justify-between items-center rounded-[12px] px-[24px] py-[1rem] mx-[12px]`}>
                                                        <div className={'text-txtSecondary flex flex-row items-center'}>
                                                            <span className={'mr-[0.5rem]'}>Q-Claim</span>
                                                            <div data-tip={t('insurance:terminology:q_claim')} data-for={`q_claim`}>
                                                                <InfoCircle size={14} color={colors.txtSecondary} />
                                                                <Tooltip className="max-w-[200px]" id={'q_claim'} placement="right" />
                                                            </div>
                                                        </div>
                                                        <div className={'font-semibold flex flex-row hover:cursor-pointer relative'}>
                                                            {q_claim.current > 0 ? Number(q_claim.current.toFixed(decimalList.decimal_q_covered)) : 0}
                                                            <span
                                                                className={'text-red pl-[0.5rem]'}
                                                                onClick={() => {
                                                                    setShowChangeUnit({
                                                                        ...showChangeUnit,
                                                                        isShow: true,
                                                                        name: `${t('insurance:unit:q_claim')}`,
                                                                    })
                                                                }}
                                                            >
                                                                {unitMoney}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className={`${
                                                            tab === 1 ? 'hidden' : ''
                                                        } flex flex-row justify-between items-center rounded-[12px] px-[24px] py-[1rem] mx-[12px]`}
                                                    >
                                                        <div className={'text-txtSecondary flex flex-row items-center'}>
                                                            <span className={'mr-[0.5rem]'}>Margin</span>
                                                            <div data-tip={t('insurance:terminology:margin')} data-for={`margin`}>
                                                                <InfoCircle size={14} color={colors.txtSecondary} />
                                                                <Tooltip className="max-w-[200px]" id={'margin'} placement="right" />
                                                            </div>
                                                        </div>
                                                        <div className={'font-semibold flex flex-row hover:cursor-pointer'}>
                                                            {margin.current > 0 ? Number(margin.current.toFixed(decimalList.decimal_margin)) : 0}

                                                            <span
                                                                className={'text-red pl-[0.5rem]'}
                                                                onClick={() => {
                                                                    // khi nào hỗ trợ đỏi đơn vị tiền thi bỏ command
                                                                    // setShowChangeUnit({ ...showChangeUnit, isShow: true, name: `${t('insurance:unit:margin')}` })
                                                                }}
                                                            >
                                                                {unitMoney}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`flex flex-col justify-center items-center mb-[32px] mx-[1rem]`}>
                                                    <button
                                                        className={`${
                                                            clear.current == true
                                                                ? 'bg-red text-white border border-red'
                                                                : 'text-white bg-divider border border-divider'
                                                        }flex items-center justify-center rounded-lg px-auto py-auto font-semibold py-[12px] !px-[100px] xs:px-[140.5rem]`}
                                                        onClick={() => {
                                                            handleNext()
                                                        }}
                                                        disabled={!clear.current}
                                                    >
                                                        {menu[11].name}
                                                    </button>
                                                </div>
                                            </div>
                                        }
                                    </>
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

export default InsuranceFrom
