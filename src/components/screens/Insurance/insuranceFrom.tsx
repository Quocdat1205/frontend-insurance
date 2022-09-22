import dynamic from 'next/dynamic'
import LayoutInsurance from 'components/layout/layoutInsurance'
import useWeb3Wallet from 'hooks/useWeb3Wallet'
import Button from 'components/common/Button/Button'
import axios from 'axios'
import { Menu, Popover, Switch, Tab } from '@headlessui/react'
import { Input } from 'components/common/Input/input'
import { ICoin } from 'components/common/Input/input.interface'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { CheckCircle, LeftArrow, InfoCircle, XMark, ErrorTriggersIcon, BxDollarCircle, BxLineChartDown, BxCaledarCheck } from 'components/common/Svg/SvgIcon'
import { ChevronDown, Check, ChevronUp } from 'react-feather'
import { useTranslation } from 'next-i18next'
import useWindowSize from 'hooks/useWindowSize'
import { screens } from 'utils/constants'
import { Suspense } from 'react'
import { RootStore, useAppSelector } from 'redux/store'
import Config from 'config/config'
// import NotificationInsurance from 'components/layout/notifucationInsurance'
import Modal from 'components/common/Modal/Modal'
import Tooltip from 'components/common/Tooltip/Tooltip'
import { formatNumber } from 'utils/utils'
import { ethers } from 'ethers'
import colors from 'styles/colors'
import classnames from 'classnames'
import GlossaryModal from 'components/screens/Glossary/GlossaryModal'
import { InsuranceFormLoading } from './insuranceFormLoading'
import InputNumber from 'components/common/Input/InputNumber'

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
    const { account } = useWeb3Wallet()
    const router = useRouter()
    const { width } = useWindowSize()
    const isMobile = width && width <= screens.drawer

    const [percentInsurance, setPercentInsurance] = useState<number>(0)
    const [selectTime, setSelectTime] = useState<string>('ALL')
    const [isDrop, setDrop] = useState(false)
    // const [checkUpgrade, setCheckUpgrade] = useState(false)
    const [clear, setClear] = useState(false)
    const assetsToken = useAppSelector((state: RootStore) => state.setting.assetsToken)
    const [index, setIndex] = useState<1 | 2>(1)
    const [tab, setTab] = useState<number>(3)
    const [loadings, setLoadings] = useState(true)
    const [openChangeToken, setOpenChangeToken] = useState(false)
    // const [active, setActive] = useState<boolean>(false)
    // const [nameNoti, setNameNoti] = useState<'success' | 'expired' | 'expired1' | 'email' | 'loading'>('loading')
    // const [res, setRes] = useState<any>()
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
    const [thisFisrt, setThisFisrt] = useState(true)
    const [saved, setSaved] = useState<number>(0)
    const [minQ_covered, setMinQ_covered] = useState(0)
    const [showChangeUnit, setShowChangeUnit] = useState({
        isShow: false,
        name: '',
    })
    const [userBalance, setUserBalance] = useState<number>(0)
    const [listCoin, setListCoin] = useState<ICoin[]>([])
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
        percent_margin: 0,
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

    const Leverage = (p_market: number, p_stop: number) => {
        const leverage = Number(formatNumber(p_market / Math.abs(p_market - p_stop), 2))
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

    const validatePclaim = (value: number) => {
        if (value > state.p_market * 1 + (2 * state.p_market) / 100 && value < state.p_market * 1 + (70 * state.p_market) / 100) {
            setErrorPCalim(true)
            return validateMargin(state.margin)
        } else if (value > state.p_market * 1 - (70 * state.p_market) / 100 && value < state.p_market * 1 - (2 * state.p_market) / 100) {
            setErrorPCalim(true)
            return validateMargin(state.margin)
        } else {
            setErrorPCalim(false)
            return setClear(false)
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

    // useEffect(() => {
    //     if (loadings) {
    //         setTimeout(() => {
    //             setShowGuide(true)
    //         }, 1500)
    //     }
    // }, [loadings])

    const handleNext = () => {
        const query = {
            r_claim: Number(formatNumber(state.r_claim, 2)),
            q_claim: Number(formatNumber(state.q_claim, 4)),
            margin: Number(formatNumber(state.margin, 4)),
            period: Number(state.period),
            symbol: selectCoin?.type,
            unit: unitMoney,
            p_claim: Number(state.p_claim),
            tab: menu[tab]?.name,
            q_covered: Number(state.q_covered),
            p_market: Number(state.p_market),
        }
        localStorage.setItem('info_covered_state', JSON.stringify(query))
        return router.push('/buy-covered/info-covered')
    }

    const validateQCovered = (value: number) => {
        if (wallet.account) {
            if (value > 0) {
                return setClear(true)
            } else {
                return setClear(false)
            }
        }
    }

    const getUSDT = async () => {
        const result = wallet.getBalance()
        result.then((balance: number) => {
            setUserBalance(balance)
        })

        // const balanceUsdt = await wallet.contractCaller.usdtContract.contract.balanceOf(account)
        // if (balanceUsdt) {
        //     console.log(balanceUsdt)

        //     return setUserBalance(Number(formatNumber(Number(ethers.utils.formatEther(balanceUsdt)) / Number(state.p_market), 4)))
        // } else {
        //     return false
        // }
    }
    const setStorage = (value: any) => {
        localStorage.setItem('buy_covered_state', JSON.stringify(value))
        setThisFisrt(false)
    }

    const updateFormPercentMargin = (value: number) => {
        if (state.q_covered > 0) {
            setState({
                ...state,
                percent_margin: value,
                margin: Number((value * state.q_covered) / 100),
            })
        }
    }

    const getStorage = async () => {
        setLoadings(true)

        const data = await localStorage.getItem('buy_covered_state')
        if (data) {
            const res = JSON.parse(data)
            setState({
                ...state,
                symbol: {
                    icon: res.icon,
                    id: res.id,
                    name: res.name,
                    symbol: res.symbol,
                    type: res.type,
                    disable: res.disable,
                },
            })
            if (res.symbol != '') {
                setSelectedCoin({
                    icon: res.icon,
                    id: res.id,
                    name: res.name,
                    symbol: res.symbol,
                    type: res.type,
                    disable: res.disable,
                })
                setState({
                    ...state,
                    symbol: {
                        icon: res.icon,
                        id: res.id,
                        name: res.name,
                        symbol: res.symbol,
                        type: res.type,
                        disable: res.disable,
                    },
                })
            } else {
                setSelectedCoin({
                    icon: listCoin[0].icon,
                    id: listCoin[0].id,
                    name: listCoin[0].name,
                    symbol: listCoin[0].symbol,
                    type: listCoin[0].type,
                    disable: listCoin[0].disable,
                })
                setState({
                    ...state,
                    symbol: {
                        icon: listCoin[0].icon,
                        id: listCoin[0].id,
                        name: listCoin[0].name,
                        symbol: listCoin[0].symbol,
                        type: listCoin[0].type,
                        disable: listCoin[0].disable,
                    },
                })
            }

            setTab(res.tab)
            setUnitMoney(res.unitMoney)
            setIndex(res.index)
            validatePclaim(res.p_claim)
            setThisFisrt(true)
            refreshApi(selectTime, selectCoin)
        } else {
            setThisFisrt(false)
            setStorage(state)
        }
    }

    const refreshApi = (
        selectTime: string | undefined,
        selectCoin: { id?: string; name?: string; icon?: string; disable?: boolean | undefined; symbol?: string; type: any },
    ) => {
        const timeEnd = new Date()
        const timeBegin = new Date()
        // setLoadings(true)
        if (selectCoin) {
            if (selectTime == '1H' || selectTime == '1D') {
                timeBegin.setDate(timeEnd.getDate() - 10)
                fetchApiNami(
                    `${selectCoin.type && selectCoin.type}${unitMoney}`,
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
                    `${selectCoin.type && selectCoin.type}${unitMoney}`,
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
                    `${selectCoin.type && selectCoin.type}${unitMoney}`,
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
        let list: ICoin[] = []
        assetsToken.map(async (token: any) => {
            const tmp = {
                id: token._id,
                name: token.name,
                icon: token.attachment,
                symbol: `${token.symbol}USDT`,
                type: token.symbol,
                disable: !token.isActive,
            }

            await list.push(tmp)
        })
        if (list.length > 0) {
            return setListCoin(list)
        }
    }, [assetsToken])

    useEffect(() => {
        try {
            if (typeof window.ethereum !== undefined) {
                console.log('MetaMask is installed!')
            }
            if (account) {
                getStorage()
                getUSDT()
            }
        } catch (error) {
            console.log('error get USDT balance')
        }
    }, [account])

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
        }
    }, [selectCoin])

    const createSaved = async () => {
        const x = state.q_claim + state.q_covered * (state.p_claim - state.p_market)

        if (state.p_claim < state.p_market) {
            setSaved(x - state.margin + state.q_covered * Math.abs(state.q_claim - state.p_market))
        }

        if (state.p_claim > state.p_market) {
            setSaved(x - state.margin)
        }
    }

    useEffect(() => {
        if (state.q_covered > 0) {
            const percent: number = Math.floor((state.q_covered / userBalance) * 100)
            setPercentInsurance(percent)
        }

        if (state.q_covered && state.p_claim) {
            const margin = Number((10 * state.q_covered * state.p_market) / 100)
            const userCapital = margin
            const systemCapital = userCapital
            const hedge_capital = userCapital + systemCapital
            const hedge = Number(margin / (state.q_covered * state.p_market))
            const p_stop = P_stop(Number(state.p_market), Number(state.p_claim), Number(hedge))
            const laverage = Leverage(state.p_market, p_stop)
            const ratio_profit = Number(Math.abs(state.p_claim - state.p_market) / state.p_market)
            const q_claim = Number(ratio_profit * hedge_capital * laverage) * (1 - 0.05) + margin
            setState({ ...state, q_claim: q_claim, r_claim: Number(q_claim / margin) * 100, p_expired: Math.floor(p_stop), margin: margin })
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
            setState({ ...state, q_claim: q_claim, r_claim: Number(q_claim / state.margin) * 100, p_expired: Math.floor(p_stop) })
        }
        createSaved()
        validatePclaim(state.p_claim)
    }, [state.q_covered, state.margin, state.p_claim])

    useEffect(() => {
        if (percentInsurance) {
            const defaultMargin = 8
            const min = (defaultMargin * 100) / (10 * state.p_market)
            setMinQ_covered(min)
        }
    }, [percentInsurance, state.margin, state.q_covered])

    useEffect(() => {
        if (state.p_claim > 0) {
            validatePclaim(state.p_claim)
        }
    }, [state.p_claim])

    useEffect(() => {
        if (showGuide) {
            return setTab(3)
        } else {
            return
        }
    }, [showGuide])

    const validator = (key: string) => {
        const rs = { isValid: true, message: '' }
        switch (key) {
            case 'q_covered':
                rs.isValid = !(state.q_covered > userBalance || state.q_covered < Number(minQ_covered.toFixed(2)))
                rs.message = `<div class="flex items-center">
                ${
                    state.q_covered > userBalance
                        ? t('common:available', { value: `${formatNumber(userBalance)}` })
                        : t('common:minimum_balance', { value: formatNumber(Number(minQ_covered.toFixed(2))) })
                }
            </div>`
                break
            case 'p_claim':
                const min = state.p_claim > state.p_market ? state.p_market * 1 + 2 * state.p_market : state.p_market * 1 + (70 * state.p_market) / 100
                const max = state.p_claim > state.p_market ? state.p_market * 1 - (70 * state.p_market) / 100 : state.p_market * 1 - (2 * state.p_market) / 100
                rs.isValid = errorPCalim || state.p_claim <= 0
                rs.message = `<div class="flex items-center">
                ${t('insurance:error:p_claim')}: ${min.toFixed(2)} < P Claim < ${max.toFixed(2)}
                </div>`
                break
            case 'margin':
                rs.isValid = state.margin < (2 / 100) * state.q_covered * state.p_market || state.margin > (10 / 100) * state.q_covered * state.p_market
                rs.message = `<div class="flex items-center">
                ${t('insurance:error:p_claim')}: ${(state.q_covered * 2) / 100} < P Claim < ${(state.q_covered * 10) / 100}
                </div>`
                break
            default:
                break
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
                                            setState({ ...state, symbol: { ...coin } })
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
                                        <img alt={''} src={`${coin.icon}`} width="36" height="36" className={'mr-[5px] grayscale hover:cursor-default'}></img>
                                        <div className={'flex flex-row justify-between w-full'}>
                                            <span>{coin.name}</span>
                                            {coin.id === selectCoin.id ? <Check size={16} className={'text-red'}></Check> : ''}
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
            <Popover.Button className={'flex items-center space-x-2 hover:cursor-pointer'} onClick={() => setChangeUnit2(!changeUnit2)}>
                <span className="text-red">{unitMoney}</span> {!changeUnit2 ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
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
        switch (key) {
            case 'q_covered':
            case 'p_claim':
                setState({ ...state, [key]: value })
                setPercentInsurance(8)
                break
            case 'margin':
                setState({ ...state, margin: value, percent_margin: 0 })
                break
            default:
                break
        }
    }

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
                                setDrop(false)
                                setChosing(false)
                                setChangeUnit2(false)
                                setChangeUnit(false)
                                setChangeUnit1(false)
                            }}
                        >
                            {
                                // head Insurance
                                <div
                                    className="max-w-screen-layout 4xl:max-w-screen-3xl m-auto px-[5rem] mt-[4rem] mb-5 flex items-center justify-between"
                                    onClick={() => {
                                        setDrop(false)
                                        setChosing(false)
                                    }}
                                >
                                    <div className="flex items-center font-semibold">
                                        <LeftArrow />
                                        <span
                                            className={'hover:cursor-pointer ml-2'}
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

                                    <Popover className="relative" data-tut="tour_custom" id="tour_custom">
                                        <Popover.Button
                                            className={classnames('rounded-md h-10 w-auto py-2 px-3 flex items-center space-x-2 bg-hover', {
                                                'bg-[#EDEEF0]': isDrop,
                                            })}
                                            onClick={() => setDrop(!isDrop)}
                                        >
                                            <span>{menu[tab]?.name}</span>
                                            {!isDrop ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                                        </Popover.Button>
                                        <Popover.Panel className="absolute z-50 bg-white w-[260px] py-1 right-0 top-[48px] rounded shadow">
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
                                                                    className={`${Press ? 'bg-gray-1' : 'hover:bg-hover'}
                                                        flex flex-row justify-start w-full items-center font-medium hover:cursor-pointer`}
                                                                >
                                                                    <div className={`text-sm flex flex-row justify-between w-full px-4 py-[10px] `}>
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
                                    className={'flex flex-col justify-center items-center mb-8 max-w-screen-layout 4xl:max-w-screen-3xl m-auto'}
                                    onClick={() => {
                                        setDrop(false)
                                        setChosing(false)
                                    }}
                                >
                                    <div>{index}/2</div>
                                    <div className={'font-semibold text-[32px] leading-[44px]'}>
                                        {index == 1 ? menu[1].name : t('insurance:buy:info_covered')}
                                    </div>
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
                            {
                                //chart
                                index == 1 && (
                                    <div
                                        className={`${
                                            !isMobile
                                                ? 'shadow border border-1 border-divider h-auto rounded-xl mt-8 max-w-[912px] xl:max-w-screen-lg m-auto p-8'
                                                : ''
                                        }`}
                                        onClick={() => {
                                            setDrop(false)
                                            setChosing(false)
                                        }}
                                    >
                                        {/*head*/}
                                        <div id="tour_statistics" data-tut="tour_statistics">
                                            <div className={'pb-2 text-sm leading-5 text-txtSecondary flex items-center space-x-6'}>
                                                <div className={'w-full flex flex-row items-center'}>
                                                    <span>{menu[7].name}</span>
                                                </div>
                                                {tab == 6 && (
                                                    <div className={'w-full flex flex-row items-center'}>
                                                        <span className={'mr-2'}>Margin</span>
                                                        <div data-tip={t('insurance:terminology:margin')} data-for={`margin`}>
                                                            <InfoCircle size={14} color={colors.txtSecondary} />
                                                            <Tooltip className="max-w-[200px]" id={'margin'} placement="right" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className={'pb-2 space-x-6 flex justify-between'}>
                                                <div className={`flex justify-between border-collapse rounded-[3px] shadow-none w-full`}>
                                                    <InputNumber
                                                        validator={validator('q_covered')}
                                                        value={state.q_covered}
                                                        onChange={(e: any) => onHandleChange('q_covered', e)}
                                                        customSuffix={renderPopoverQCover}
                                                        decimal={8}
                                                    />
                                                </div>

                                                {tab > 3 && (
                                                    <div
                                                        className={`${
                                                            tab > 3 ? '' : 'hidden'
                                                        } ml-[12px] flex justify-between border-collapse rounded-[3px] shadow-none w-full`}
                                                    >
                                                        <InputNumber
                                                            validator={validator('margin')}
                                                            value={state.q_covered > 0 ? state.margin : 0}
                                                            onChange={(e: any) => onHandleChange('margin', e)}
                                                            customSuffix={renderPopoverMargin}
                                                            decimal={8}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-row w-full space-x-6 text-xs font-semibold">
                                            <div className={`flex flex-row justify-between space-x-4 ${tab == 6 ? 'w-1/2' : 'w-full'}`}>
                                                {[25, 50, 75, 100].map((item, key) => {
                                                    return (
                                                        <div
                                                            key={key}
                                                            className={`flex flex-col space-y-3 justify-center w-1/4 items-center hover:cursor-pointer`}
                                                            onClick={() => setState({ ...state, q_covered: (item / 100) * userBalance })}
                                                        >
                                                            <div className={`${percentInsurance == item ? 'bg-red' : 'bg-gray-1'} h-1 w-full rounded-sm`}></div>
                                                            <span className={percentInsurance === item ? 'text-red' : 'text-gray'}>{item}%</span>
                                                        </div>
                                                    )
                                                })}
                                            </div>

                                            <div className={`flex flex-row justify-between space-x-4 ${tab == 6 ? 'w-1/2' : 'hidden'}`}>
                                                {[2, 5, 7, 10].map((item, key) => {
                                                    return (
                                                        <div
                                                            key={key}
                                                            className={'flex flex-col space-y-3 justify-center w-1/4 items-center hover:cursor-pointer'}
                                                            onClick={() => {
                                                                updateFormPercentMargin(item)
                                                            }}
                                                        >
                                                            <div
                                                                className={`${state.percent_margin == item ? 'bg-red' : 'bg-gray-1'} h-1 w-full rounded-sm`}
                                                            ></div>
                                                            <span className={state.percent_margin === item ? 'text-red' : 'text-gray'}>{item}%</span>
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
                                                        height={300}
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
                                                    decimal={8}
                                                />
                                                {/* {!errorPCalim && state.p_claim != 0 && (
                                                    <span className="flex flex-row text-[#E5544B] mt-[8px]">
                                                        <ErrorTriggersIcon /> <span className="pl-[6px]">{t('insurance:error:p_claim')}</span>
                                                    </span>
                                                )} */}
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
                                                    className={`flex flex-row mt-4 space-x-3  w-full ${isMobile && showCroll ? 'overflow-scroll' : ''}`}
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

                            {/*Only Show Claim And Margin*/}
                            {index == 1 && (
                                <div
                                    className={
                                        'max-w-screen-md lg:max-w-screen-md xl:max-w-screen-lg m-auto flex flex-row justify-center items-center mt-[24px] hover:cursor-default z-50 space-x-2 xl:space-x-3'
                                    }
                                    onClick={() => {
                                        setDrop(false)
                                        setChosing(false)
                                    }}
                                >
                                    <div
                                        className={`${
                                            tab == 4 ? 'hidden' : ''
                                        } flex flex-row justify-between items-center w-[33%] rounded-[12px] border border-divider border-0.5 px-5 py-4`}
                                    >
                                        <div className={'text-txtSecondary flex flex-row items-center'}>
                                            <span className={'mr-[8px]'}>R-Claim</span>
                                            <div data-tip={t('insurance:terminology:r_claim')} data-for={`r_claim`}>
                                                <InfoCircle size={14} color={colors.txtSecondary} />
                                                <Tooltip className="max-w-[200px]" id={'r_claim'} placement="right" />
                                            </div>
                                        </div>
                                        <div className={''}>
                                            <span>{state?.r_claim > 0 ? Number(formatNumber(state?.r_claim, 2)) : 0}%</span>
                                        </div>
                                    </div>
                                    <div
                                        className={`${
                                            tab == 5 ? 'hidden' : ''
                                        } flex flex-row justify-between items-center w-[33%] rounded-[12px] border border-divider border-0.5 px-5 py-4 `}
                                    >
                                        <div className={'text-txtSecondary flex flex-row items-center'}>
                                            <span className={'mr-[8px]'}>Q-Claim</span>
                                            <div data-tip={t('insurance:terminology:q_claim')} data-for={`q_claim`}>
                                                <InfoCircle size={14} color={colors.txtSecondary} />
                                                <Tooltip className="max-w-[200px]" id={'q_claim'} placement="right" />
                                            </div>
                                        </div>
                                        <div className={'flex flex-row justify-center items-center hover:cursor-pointer relative max-h-[24px]'}>
                                            {state.q_claim > 0 ? Number(formatNumber(state?.q_claim, 2)) : 0}
                                            <span className={'text-red pl-2 mr-1'}>{unitMoney}</span>
                                            <div className="relative">
                                                <Popover className="relative">
                                                    <Popover.Button
                                                        className={'my-4 text-txtPrimary underline hover:cursor-pointer '}
                                                        onClick={() => setChangeUnit(!changeUnit)}
                                                    >
                                                        {!changeUnit ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                                                    </Popover.Button>
                                                    <Popover.Panel
                                                        className="flex flex-col text-txtPrimary absolute  top-[63px] right-[-15px] bg-white z-[100] rounded"
                                                        style={{ boxShadow: '0px 3px 5px rgba(9, 30, 66, 0.2), 0px 0px 1px rgba(9, 30, 66, 0.31)' }}
                                                    >
                                                        {({ close }) => (
                                                            <div className="flex flex-col justify-center h-full font-normal text-sm">
                                                                {['USDT', 'BUSD', 'USDC'].map((e, key) => {
                                                                    return (
                                                                        <div
                                                                            key={key}
                                                                            className={` py-2 px-4 hover:bg-hover font-normal`}
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
                                        } flex flex-row justify-between items-center w-[33%] rounded-[12px] border border-divider border-0.5 px-5 py-4`}
                                    >
                                        <div className={'text-txtSecondary flex flex-row items-center'}>
                                            <span className={'mr-[8px]'}>Margin</span>
                                            <div data-tip={t('insurance:terminology:margin')} data-for={`margin`}>
                                                <InfoCircle size={14} color={colors.txtSecondary} />
                                                <Tooltip className="max-w-[200px]" id={'margin'} placement="right" />
                                            </div>
                                        </div>
                                        <div className={'flex flex-row items-center justify-center hover:cursor-pointer relative max-h-[24px]'}>
                                            {state.margin > 0 ? Number(formatNumber(state?.margin, 2)) : 0}
                                            <span className={'text-red pl-2 mr-1'}>{unitMoney}</span>
                                            <div className="relative">
                                                <Popover className="relative">
                                                    <Popover.Button
                                                        className={'my-[16px] text-txtPrimary underline hover:cursor-pointer'}
                                                        onClick={() => setChangeUnit1(!changeUnit1)}
                                                    >
                                                        {!changeUnit1 ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                                                    </Popover.Button>
                                                    <Popover.Panel
                                                        className="flex flex-col text-txtPrimary absolute  top-[63px] right-[-15px] bg-white z-[100] rounded"
                                                        style={{ boxShadow: '0px 3px 5px rgba(9, 30, 66, 0.2), 0px 0px 1px rgba(9, 30, 66, 0.31)' }}
                                                    >
                                                        {({ close }) => (
                                                            <div className="flex flex-col justify-center h-full font-normal text-sm">
                                                                {['USDT', 'BUSD', 'USDC'].map((e, key) => {
                                                                    return (
                                                                        <div
                                                                            key={key}
                                                                            className={` py-[8px] px-[16px] hover:bg-hover font-normal`}
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
                                index == 1 && state.q_covered > 0 && state.p_claim > 0 && (
                                    <div
                                        className={'flex justify-center items-center mt-[24px] max-w-screen-layout 4xl:max-w-screen-3xl m-auto'}
                                        onClick={() => {
                                            setDrop(false)
                                            setChosing(false)
                                        }}
                                    >
                                        <CheckCircle></CheckCircle>
                                        <span className={'font-medium text-txtPrimary px-[4px]'}>
                                            {`${t('insurance:buy:saved')} `}
                                            <span className={'text-red'}>
                                                {saved.toFixed(4)} {unitMoney}
                                            </span>{' '}
                                            {t('insurance:buy:sub_saved')}
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
                                            clear ? 'bg-red text-white border border-red' : 'text-white bg-divider border border-divider'
                                        }flex items-center justify-center rounded-lg px-auto py-auto font-semibold py-[12px] px-[148px]`}
                                        onClick={() => {
                                            if (clear) {
                                                handleNext()
                                            }
                                        }}
                                        disabled={!clear}
                                    >
                                        {menu[11].name}
                                    </button>
                                    <Menu>
                                        <Menu.Button className={'my-[16px] text-blue underline hover:cursor-pointer'}>{menu[12].name}</Menu.Button>
                                        <Menu.Items
                                            className={'flex flex-col text-txtPrimary'}
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
                        </LayoutInsurance>
                    </>
                ) : (
                    <>
                        {!wallet.account ? (
                            <>
                                <div style={{ background: 'linear-gradient(180deg, rgba(244, 63, 94, 0.15) 0%, rgba(254, 205, 211, 0) 100%)' }}>
                                    <div className="px-[16px] pt-[8px]" onClick={() => router.push('/home')}>
                                        <XMark />
                                    </div>
                                    <div className="flex flex-col items-center px-[60px] pt-[8px]">
                                        <img src={'/images/buyInsurance.png'} width="269" height="212" className="w-[269px] h-auto" />
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
                                        className=" bg-white absolute bottom-0 translate-y-0 h-max"
                                        onBackdropCb={() => setShowChangeUnit({ ...showChangeUnit, isShow: false, name: '' })}
                                    >
                                        <div className={` bg-white text-sm  mx-auto `}>
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
                                {openChangeToken && (
                                    <Modal
                                        portalId="modal"
                                        isVisible={true}
                                        className=" bg-white absolute bottom-0 !translate-y-1"
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
                                            <XMark></XMark>
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
                                                        tab == 6 ? setTab(3) : setTab(6)
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
                                        <div>
                                            <span>{t('insurance:buy:buy_covered')} </span>{' '}
                                            <span
                                                className="text-red"
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
                                                    state.q_covered && state.q_covered > 0 ? 'text-red' : 'text-[#B2B7BC]'
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
                                                            setState({ ...state, q_covered: a.target.value.replace(/^0+/, '') })
                                                        } else {
                                                            setState({ ...state, q_covered: Number(a.target.value) })
                                                        }
                                                        setPercentInsurance(0)
                                                    }}
                                                ></input>
                                            </label>{' '}
                                            <span className="text-red">{selectCoin.type}</span>
                                        </div>
                                        {tab == 6 && (
                                            <div data-tut="tour_custom" id="tour_custom">
                                                <span>{t('insurance:buy:title_change_margin')}</span>{' '}
                                                <label className={`${state.margin == 0 ? 'text-[#B2B7BC]' : 'text-red'} max-w-[245] relative ml-[6xp]`}>
                                                    {state.margin > 0 ? Number(state.margin) : 'Số tiền?'}
                                                    <input
                                                        type="number"
                                                        className={` text-white pl-[4px] focus-visible:outline-none w-0 border border-1 border-black`}
                                                        placeholder="Số tiền?"
                                                        value={state.margin > 0 ? Number(state.margin) : 0}
                                                        name="name"
                                                        id="name"
                                                        onChange={(a: any) => {
                                                            if (Number(a.target.value) >= 1) {
                                                                return setState({
                                                                    ...state,
                                                                    margin: a.target.value.replace(/^0+/, ''),
                                                                    percent_margin: Number(a.target.value / (state.q_covered * state.p_market)),
                                                                })
                                                            } else {
                                                                return setState({
                                                                    ...state,
                                                                    margin: Number(a.target.value) * 1,
                                                                    percent_margin: Number(a.target.value / (state.q_covered * state.p_market)),
                                                                })
                                                            }
                                                        }}
                                                    ></input>
                                                </label>{' '}
                                                <span
                                                    className="text-red"
                                                    onClick={() =>
                                                        setShowChangeUnit({ ...showChangeUnit, isShow: true, name: `${t('insurance:unit:margin')}` })
                                                    }
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
                                                    p_expired={Number(state.p_expired)}
                                                    setP_Claim={(data: number) => setState({ ...state, p_claim: data })}
                                                    setP_Market={(data: number) => setState({ ...state, p_market: data })}
                                                    isMobile={isMobile}
                                                ></ChartComponent>
                                            </Suspense>
                                            <svg
                                                className={`absolute right-0 z-10`}
                                                width="3"
                                                height={300}
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
                                            <div
                                                className={`mt-[8px] flex justify-between border-collapse rounded-[3px] shadow-none ${
                                                    !clear && 'border border-1 border-red'
                                                }`}
                                            >
                                                <Input
                                                    className={'w-[90%] appearance-none bg-hover outline-none focus:ring-0 shadow-none '}
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
                                                <div className={'bg-hover text-[#B2B7BC] w-[10%] shadow-none flex items-center justify-end px-[16px]'}>
                                                    {unitMoney}
                                                </div>
                                            </div>
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
                                {tab == 6 && index == 1 && (
                                    <div className={'mt-5 pl-[32px] pr-[32px] pb-[32px]'}>
                                        <span className={'flex flex-row items-center'}>
                                            <span className={'mr-[6px] text-txtSecondary text-sm'}>Margin</span>
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
                                                                state.percent_margin == item && 'bg-[#FFF1F2] text-red'
                                                            } bg-hover rounded-[300px] p-3 h-[32px] w-[49px] flex justify-center items-center hover:cursor-pointer ${
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
                                        className={`${clear ? 'visible' : 'invisible'} items-center w-[300px] xs:w-full`}
                                    >
                                        {state.q_covered > 0 && state.p_claim > 0 && (
                                            <div className={'flex justify-center items-center mt-[24px] mx-[16px]'}>
                                                <CheckCircle></CheckCircle>
                                                <span className={'text-sm text-txtPrimary w-[230px] xs:w-full px-[4px] font-semibold'}>
                                                    {t('insurance:buy:saved')}
                                                    <span className={'text-red'}>
                                                        {saved.toFixed(4)} {unitMoney}
                                                    </span>
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
                                                    <span>{state?.r_claim > 0 ? Number(formatNumber(state?.r_claim, 2)) : 0}%</span>
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
                                                    {state.q_claim > 0 ? Number(formatNumber(state.q_claim, 2)) : 0}
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
                                                    {state.margin > 0 ? Number(formatNumber(state.margin, 2)) : 0}

                                                    <span
                                                        className={'text-red pl-[8px]'}
                                                        onClick={() =>
                                                            setShowChangeUnit({ ...showChangeUnit, isShow: true, name: `${t('insurance:unit:margin')}` })
                                                        }
                                                    >
                                                        {unitMoney}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`flex flex-col justify-center items-center mb-[32px] mx-[16px]`}>
                                            <button
                                                className={`${
                                                    clear ? 'bg-red text-white border border-red' : 'text-white bg-divider border border-divider'
                                                }flex items-center justify-center rounded-lg px-auto py-auto font-semibold py-[12px] !px-[100px] xs:px-[148px]`}
                                                onClick={() => {
                                                    if (clear) {
                                                        handleNext()
                                                    }
                                                }}
                                                disabled={!clear}
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
                <InsuranceFormLoading isMobile={!isMobile} />
            )}
        </>
    )
}

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
                    {t('insurance:guild:the_glossary')}
                </div>
            </div>
        </Modal>
    )
}

export default InsuranceFrom
