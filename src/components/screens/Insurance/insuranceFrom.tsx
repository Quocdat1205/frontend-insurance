import dynamic from 'next/dynamic'
import LayoutInsurance from 'components/layout/layoutInsurance'
import { ICoin } from 'components/common/Input/input.interface'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import useWindowSize from 'hooks/useWindowSize'
import { screens } from 'utils/constants'
import { RootStore, useAppSelector } from 'redux/store'
import Config from 'config/config'
import GlossaryModal from 'components/screens/Glossary/GlossaryModal'
import { countDecimals } from 'utils/utils'
import { getUnixTime, sub } from 'date-fns'
import { BTCaddress, DAIaddress, ETHaddress, USDTaddress } from 'components/web3/constants/contractAddress'
import Emitter from 'socket/emitter'
import { PublicSocketEvent } from 'socket/socketEvent'
import FuturesMarketWatch from 'models/FuturesMarketWatch'
import { changePeriod, fetchApiNami, getBalance, getInfoCoveredCustom, getInfoCoveredDefault, GuidelineModal, setDefaultValue } from './Insurance_funtion'

const Guide = dynamic(() => import('components/screens/Insurance/Guide'), {
    ssr: false,
})

const InsuranceFromMobile = dynamic(() => import('./InsuranceFromMobile'), {
    ssr: false,
})
const InsuranceFromWeb = dynamic(() => import('./InsuranceFromWeb'), {
    ssr: false,
})

const InsuranceFrom = () => {
    const { t } = useTranslation()
    const router = useRouter()
    const { width } = useWindowSize()
    const isMobile = width && width <= screens.drawer

    const assetsToken = useAppSelector((state: RootStore) => state?.setting.assetsToken)
    const pairConfigs = useAppSelector((state: RootStore) => state?.setting.pairConfigs)
    const account = useAppSelector((state: RootStore) => state?.setting.account)
    const publicSocket = useAppSelector((state: RootStore) => state?.socket.publicSocket)

    const min_notinal = useRef(0)
    const clear = useRef<boolean>(false)
    const percentInsurance = useRef<number>(0)
    const percentMargin = useRef<number>(8)

    const [selectTime, setSelectTime] = useState<string>('1Y')
    const [tab, setTab] = useState<number>(0)
    const [loadings, setLoadings] = useState(false)
    const [showDetails, setShowDetails] = useState(false)
    const [unitMoney, setUnitMoney] = useState('USDT')
    const [showGuide, setShowGuide] = useState<boolean>(false)
    const [chosing, setChosing] = useState(false)
    const [saved, setSaved] = useState<number>(0)
    const [isCanSave, setIsCanSave] = useState<boolean>(false)
    const [userBalance, setUserBalance] = useState<number>(0)
    const [listCoin, setListCoin] = useState<ICoin[]>([])
    const [pair_configs, setPairConfigs] = useState<any>({})
    const [dataChart, setDataChart] = useState()
    const [percentPrice, setPercentPrice] = useState<any>()
    const default_period = useRef(0)
    const default_r_claim = useRef(0)
    const [run_first, setFirst] = useState<boolean>(true)

    const [rangeQ_covered, setRangeQ_covered] = useState({
        min: 0,
        max: 0,
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

    useEffect(() => {
        setFirst(true)
    }, [])

    useEffect(() => {
        if (loadings && isMobile) {
            const timeout_guiled = setTimeout(() => {
                setShowGuide(true)
                return () => {
                    clearTimeout(timeout_guiled)
                }
            }, 500)
        }
    }, [loadings])

    useEffect(() => {
        if (assetsToken) {
            setDataIcon()
        } else {
            return
        }
    }, [assetsToken])

    useEffect(() => {
        runSocket()
    }, [selectCoin, publicSocket, listCoin])
    const timer = useRef<any>(null)

    useEffect(() => {
        getConfig(selectCoin?.type)
        getDefaultValue()
    }, [selectCoin])

    useEffect(() => {
        runSocket()
        timer.current = setInterval(() => {
            runSocket()
        }, 10000)
        return () => {
            clearInterval(timer.current)
        }
    }, [selectCoin])

    useEffect(() => {
        const first_timeout = setTimeout(() => {
            if (run_first) {
                loadData()
            } else {
                getBalaneToken(selectCoin?.type)
            }
            return () => {
                clearTimeout(first_timeout)
            }
        }, 1000)
    }, [pair_configs, selectCoin, account, p_market, userBalance])

    useEffect(() => {
        if (!q_covered.current || q_covered.current == 0 || !p_claim.current || p_claim.current == 0) {
            setSaved(0)
            p_expired.current = 0
            q_claim.current = 0
            r_claim.current = 0
            margin.current = 0
        } else {
            if (tab == 0) {
                const res = getInfoCoveredDefault(p_market.current, q_covered.current, p_claim.current, decimalList, default_r_claim)
                if (res) {
                    p_expired.current = res?.p_expired
                    q_claim.current = res?.q_claim
                    r_claim.current = res?.r_claim
                    margin.current = res?.margin
                }
            } else {
                const result = getInfoCoveredCustom(margin.current, q_covered.current, p_claim.current, p_market.current, decimalList, default_r_claim)
                if (result) {
                    p_expired.current = result?.p_expired
                    q_claim.current = result?.q_claim
                    r_claim.current = result?.r_claim
                }
            }
        }
    }, [q_covered, p_claim, margin])

    const loadData = async () => {
        if (pair_configs && selectCoin && account && p_market) {
            if (pair_configs && p_market.current) {
                if (!Config.web3.account) {
                    setUserBalance(0)
                    percentInsurance.current = 0
                    percentMargin.current = 0

                    await setDefaultValue(0, p_market.current, pair_configs.filters, default_period)
                        .then(async (res) => {
                            const _res = await res
                            if (_res) {
                                q_covered.current = _res?.q_covered
                                margin.current = _res?.margin
                                period.current = _res?.period
                                p_claim.current = _res?.p_claim
                            }
                        })
                        .finally(() => setFirst(false))
                } else {
                    await getBalaneToken(selectCoin?.type)
                        .then(async (res) => {
                            const balance = await res
                            if (balance) {
                                await setDefaultValue(balance, p_market.current, pair_configs.filters, default_period).then(async (e) => {
                                    const value = await e
                                    if (value) {
                                        q_covered.current = value.q_covered
                                        margin.current = value.margin
                                        period.current = value.period
                                        p_claim.current = value.p_claim
                                    }
                                })
                            }
                        })
                        .then(async () => {
                            if (tab === 0) {
                                const timeout_getData = setTimeout(() => {
                                    const res = getInfoCoveredDefault(p_market.current, q_covered.current, p_claim.current, decimalList, default_r_claim)
                                    if (res) {
                                        p_expired.current = res?.p_expired
                                        q_claim.current = res?.q_claim
                                        r_claim.current = res?.r_claim
                                        margin.current = res?.margin!
                                    }
                                    createSaved()
                                    clear.current = handleCheckFinal()
                                    return () => {
                                        clearTimeout(timeout_getData)
                                    }
                                }, 500)
                            } else {
                                const timeout_getData = setTimeout(() => {
                                    const result = getInfoCoveredCustom(
                                        margin.current,
                                        q_covered.current,
                                        p_claim.current,
                                        p_market.current,
                                        decimalList,
                                        default_r_claim,
                                    )
                                    if (result) {
                                        p_expired.current = result?.p_expired
                                        q_claim.current = result?.q_claim
                                        r_claim.current = result?.r_claim
                                    }
                                    createSaved()
                                    clear.current = handleCheckFinal()
                                    return () => {
                                        clearTimeout(timeout_getData)
                                    }
                                }, 500)
                            }
                        })
                        .finally(() => setFirst(false))
                }
            }
            createSaved()
        }
    }

    useEffect(() => {
        getDefaultValue()
    }, [userBalance])

    const getDefaultValue = () => {
        if (userBalance && p_market.current && pair_configs) {
            setDefaultValue(userBalance, p_market.current, pair_configs.filters, default_period).then(async (e) => {
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
            const res = getInfoCoveredDefault(p_market.current, q_covered.current, p_claim.current, decimalList, default_r_claim)
            if (res) {
                p_expired.current = res?.p_expired
                q_claim.current = res?.q_claim
                r_claim.current = res?.r_claim
                margin.current = res?.margin
            }
        }
    }, [tab])

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

    const handleChangePeriod = (item: number) => {
        period.current = item
        changePeriod(item, margin.current, q_claim, r_claim, default_period, default_r_claim)
    }

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
                ).then(() => {
                    setLoadings(false)
                })
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
            loadValidator()
            clearTimeout(time)
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
        setFirst(true)
        localStorage.setItem('buy_covered_state', JSON.stringify(coin))
    }

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
        percentInsurance.current = data
        if (data === 25) {
            q_covered.current = Number((0.25 * userBalance).toFixed(decimalList.decimal_q_covered))
        } else if (data === 100) {
            q_covered.current = userBalance
        } else {
            q_covered.current = Number(((data / 100) * userBalance).toFixed(decimalList.decimal_q_covered))
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
                            }}
                        >
                            <InsuranceFromWeb
                                account={account}
                                q_covered={q_covered}
                                p_claim={p_claim}
                                selectCoin={selectCoin}
                                tab={tab}
                                margin={margin}
                                unitMoney={unitMoney}
                                decimalList={decimalList}
                                percentInsurance={percentInsurance}
                                percentMargin={percentMargin}
                                listCoin={listCoin}
                                dataChart={dataChart}
                                period={period}
                                p_market={p_market}
                                listTime={listTime}
                                clear={clear}
                                selectTime={selectTime}
                                listTabPeriod={listTabPeriod}
                                saved={saved}
                                r_claim={r_claim}
                                q_claim={q_claim}
                                chosing={chosing}
                                userBalance={userBalance}
                                updateFormQCovered={updateFormQCovered}
                                validator={validator}
                                onHandleChange={onHandleChange}
                                updateFormPercentMargin={updateFormPercentMargin}
                                handleUpdateToken={handleUpdateToken}
                                setTab={setTab}
                                setSelectTime={setSelectTime}
                                handleChangePeriod={handleChangePeriod}
                                setChosing={setChosing}
                                handleNext={handleNext}
                                setShowDetails={setShowDetails}
                            />
                        </LayoutInsurance>
                    </>
                ) : (
                    <InsuranceFromMobile
                        account={account}
                        q_covered={q_covered}
                        p_claim={p_claim}
                        selectCoin={selectCoin}
                        tab={tab}
                        margin={margin}
                        unitMoney={unitMoney}
                        decimalList={decimalList}
                        percentInsurance={percentInsurance}
                        percentMargin={percentMargin}
                        isCanSave={isCanSave}
                        listCoin={listCoin}
                        dataChart={dataChart}
                        period={period}
                        p_market={p_market}
                        listTime={listTime}
                        clear={clear}
                        loadings={loadings}
                        selectTime={selectTime}
                        listTabPeriod={listTabPeriod}
                        saved={saved}
                        r_claim={r_claim}
                        q_claim={q_claim}
                        updateFormQCovered={updateFormQCovered}
                        validator={validator}
                        onHandleChange={onHandleChange}
                        updateFormPercentMargin={updateFormPercentMargin}
                        handleUpdateToken={handleUpdateToken}
                        setShowGuide={setShowGuide}
                        setTab={setTab}
                        setSelectTime={setSelectTime}
                        handleChangePeriod={handleChangePeriod}
                        setChosing={setChosing}
                        handleNext={handleNext}
                        setShowDetails={setShowDetails}
                    />
                )
            ) : (
                <></>
            )}
        </>
    )
}

export default InsuranceFrom
