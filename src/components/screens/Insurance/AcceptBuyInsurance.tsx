import axios from 'axios'
import Button from 'components/common/Button/Button'
import Config from 'config/config'
import useWeb3Wallet from 'hooks/useWeb3Wallet'
import { useState, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckBoxIcon, CheckCircle, InfoCircle, LeftArrow, StartIcon, XMark } from 'components/common/Svg/SvgIcon'
import useWindowSize from 'hooks/useWindowSize'
import { errorsWallet, screens } from 'utils/constants'
import { useRouter } from 'next/router'
import Tooltip from 'components/common/Tooltip/Tooltip'
import colors from 'styles/colors'
import { formatPriceToWeiValue, formatWeiValueToPrice } from 'utils/format'
import { contractAddress, USDTaddress } from 'components/web3/constants/contractAddress'
import { Menu, Popover } from '@headlessui/react'
import { ChevronDown } from 'react-feather'
import Modal from 'components/common/Modal/Modal'
import NotificationInsurance from 'components/layout/notifucationInsurance'
import { RootStore, useAppDispatch, useAppSelector } from 'redux/store'
import { isString } from 'lodash'
import { useWeb3React } from '@web3-react/core'
import fetchApi from 'services/fetch-api'
import { API_CHECK_REF, API_GET_BUY_INSURANCE } from 'services/apis'
import InputField from 'components/common/Input/InputField'
import { setAccount } from 'redux/actions/setting'
import { getInfoCoveredCustom } from './Insurance_funtion'

export type IBuyInsurance = {
    createInsurance: number
    _buyer: string
    _cover_payout: any
    _asset: string
    _current_price: any
    _insurance_value: any
    _expire: any
}

export type IState = {
    period: number
    p_claim: number
    q_claim: number
    r_claim: number
    margin: number
    symbol: string
    unit: string
    tab: string
    q_covered: number
    p_market: number
    decimalList: {
        decimal_margin: number
        decimal_p_claim: number
        decimal_q_covered: number
    }
    default_r_claim: any
}

const AcceptBuyInsurance = () => {
    const {
        t,
        i18n: { language },
    } = useTranslation()
    const dispatch = useAppDispatch()
    const wallet = useWeb3Wallet()
    const router = useRouter()
    const { width, height } = useWindowSize()
    const isMobile = width && width < screens.drawer
    const { account: address, error, chainId, isActive } = useWeb3React()
    const account = useAppSelector((state: RootStore) => state.setting.account)
    const [Noti, setNoti] = useState<string>('')
    const [checkUpgrade, setCheckUpgrade] = useState<boolean>(false)
    const [state, setState] = useState<IState>({
        period: 0,
        p_claim: 0,
        q_claim: 0,
        r_claim: 0,
        margin: 0,
        symbol: '',
        unit: '',
        tab: '',
        q_covered: 0,
        p_market: 0,
        decimalList: {
            decimal_margin: 0,
            decimal_p_claim: 0,
            decimal_q_covered: 0,
        },
        default_r_claim: { current: 0 },
    })
    const [isUpdated, setUpdated] = useState<boolean>(true)
    const [isCanBuy, setCanBuy] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(false)
    const [active, setActive] = useState<boolean>(false)
    const [res, setRes] = useState(null)
    const [saved, setSaved] = useState(0)
    const [refCode, setRefCode] = useState('')
    const [refError, setRefError] = useState({ isValid: true, message: '' })
    const [count, setCount] = useState(10)
    const reason = useRef<any>(null)
    const textErrorButton = useRef<string>(t(`common:reconnect`))
    const showIconReload = useRef<boolean>(true)
    const isReload = useRef<boolean>(false)
    const unitMoney = useRef<string>('USDT')

    useEffect(() => {
        fetch()
        getData()
    }, [])

    const inValidNetword = useMemo(() => {
        return account.address ? (chainId ? Config.chains.includes(chainId) : false) : true
    }, [chainId, account])

    const lostConnection = () => {
        connectionError({ code: errorsWallet.Connect_failed, message: t('errors:CONNECT_FAILED') })
    }

    const connectionError = (error: any) => {
        let isNotFoundNetWork = false
        const code = isString(error?.code) ? error?.code : Math.abs(error?.code)
        switch (code) {
            case 32600:
            case 32601:
            case 32602:
            case 32603:
            case errorsWallet.Cancel:
                if (inValidNetword) {
                    reason.current = t('errors:40001')
                    textErrorButton.current = t(`common:reconnect`)
                    showIconReload.current = true
                }
                break
            case errorsWallet.Not_found:
                isNotFoundNetWork = true
                break
            case errorsWallet.Success:
                Config.toast.show('success', t('common:connect_successful'))
                break
            case errorsWallet.NetWork_error:
                showIconReload.current = true
                reason.current = t('common:network_error')
                break
            case errorsWallet.Connect_failed:
                reason.current = t('errors:CONNECT_FAILED')
                textErrorButton.current = t(`common:refresh`)
                isReload.current = true
                break
            case errorsWallet.Already_opened:
                reason.current = t('common:user_not_login')
                showIconReload.current = false
                textErrorButton.current = t('common:got_it')
                break
            default:
                showIconReload.current = true
                reason.current = t('errors:CONNECT_FAILED')
                break
        }
        setLoading(false)
    }

    const getData = async () => {
        setLoading(true)
        const dataSate = await localStorage.getItem('info_covered_state')
        if (dataSate) {
            const res = JSON.parse(dataSate)
            setState({ ...res })
            if (res.p_claim < res.p_market) {
                setSaved(res.q_claim + res.q_covered * (res.p_claim - res.p_market) - res.margin + res.q_covered * (res.p_market - res.p_claim))
            }

            if (res.p_claim > res.p_market) {
                setSaved(res.q_claim + res.q_covered * (res.p_claim - res.p_market) - res.margin)
            }
        }
        setLoading(false)
    }

    useEffect(() => {
        console.log(state?.p_market)
        const res = getInfoCoveredCustom(state?.margin!, state?.q_covered!, state?.p_claim!, state?.p_market!, state?.decimalList!, state?.default_r_claim!)
        if (res) {
            setState({ ...state, q_claim: res?.q_claim, r_claim: res?.r_claim })
        }
    }, [state?.p_market])

    useEffect(() => {
        if (!account?.address) {
            router.push('/buy-covered')
        }
    }, [account])

    const fetch = async () => {
        try {
            const e = await Config.web3.contractCaller.insuranceContract.contract.filters.EBuyInsurance()
            await wallet.contractCaller.insuranceContract.contract.queryFilter(e, 22658137, 22658137 + 1000)
        } catch (err) {
            console.log(err)
        }
    }

    const onConnectWallet = () => {
        try {
            Config.connectWallet()
        } catch (err) {
            console.log(err)
        }
    }

    const createContract = async () => {
        if (account.address == null) {
            return Config.toast.show('error', t('common:please_connect_your_wallet'), {
                button: (
                    <button className="text-sm font-semibold underline" onClick={onConnectWallet}>
                        {t('common:connect_now')}
                    </button>
                ),
            })
        }
        setNoti('loading')
        setActive(true)

        try {
            if (account.address != null && state != undefined) {
                const { data } = await axios.get(`https://test.nami.exchange/api/v3/spot/market_watch?symbol=${state.symbol}${state.unit}`)

                if (data.data.length > 0) {
                    const min = data.data[0].p - data.data[0].p * 0.05
                    const max = data.data[0].p + data.data[0].p * 0.05
                    if (state.p_market > max || state.p_market < min) {
                        setUpdated(false)
                        Config.toast.show('error', t('insurance:buy:price_had_update'))
                        return setActive(false)
                    }
                }

                if (!checkUpgrade && state != undefined) {
                    const dataPost = {
                        buyer: account.address as string,
                        asset: state.symbol,
                        margin: formatPriceToWeiValue(Number(state.margin.toFixed(state.decimalList.decimal_margin))),
                        q_covered: formatPriceToWeiValue(Number(state.q_covered.toFixed(state.decimalList.decimal_q_covered))),
                        p_market: formatPriceToWeiValue(data.data[0].p),
                        p_claim: formatPriceToWeiValue(Number(state.p_claim)),
                        period: Number(state.period),
                        isUseNain: false,
                    }
                    const token = await Config.web3.contractCaller.sign(account.address)

                    setTimeout(async () => {
                        if (!token) {
                            lostConnection()
                            Config.toast.show(
                                'error',
                                `${language === 'vi' ? 'Giao dịch không thành công, vui lòng thử lại' : 'Transaction fail, try again please'}`,
                            )
                            return setActive(false)
                        }
                        if (token?.message || token?.code) {
                            connectionError(token)
                            Config.toast.show(
                                'error',
                                `${language === 'vi' ? 'Giao dịch không thành công, vui lòng thử lại' : 'Transaction fail, try again please'}`,
                            )
                            return setActive(false)
                        } else {
                            const allowance = await Config.web3.contractCaller.tokenContract(USDTaddress).contract.allowance(account.address, contractAddress)

                            const parseAllowance = formatWeiValueToPrice(allowance)

                            if (parseAllowance < state.margin) {
                                const approve = await Config.web3.contractCaller
                                    .tokenContract(USDTaddress)
                                    .contract.approve(contractAddress, formatPriceToWeiValue(state.margin), {
                                        from: account.address,
                                    })
                            }
                            await Config.web3.contractCaller.insuranceContract.contract
                                .createInsurance(
                                    dataPost.buyer,
                                    dataPost.asset,
                                    dataPost.margin,
                                    dataPost.q_covered,
                                    dataPost.p_market,
                                    dataPost.p_claim,
                                    dataPost.period,
                                    dataPost.isUseNain,
                                    { value: 0 },
                                )
                                .then(async (res: any) => {
                                    const id_sc = await res.wait()

                                    if (res && id_sc.events[2].args[0]) {
                                        handlePostInsurance(res, dataPost, state, Number(id_sc.events[2].args[0]), token)
                                    }
                                })
                                .catch((result: any) => {
                                    if (result?.error?.code === -32603) {
                                        Config.toast.show(
                                            'error',
                                            `${
                                                language === 'vi'
                                                    ? 'Giao dịch không thành công, số dư USDT của bạn không đủ'
                                                    : 'Transaction fail, your balance USDT not enough'
                                            }`,
                                        )
                                        return setActive(false)
                                    }

                                    if (result.code === 4001) {
                                        Config.toast.show('error', `${language === 'vi' ? 'Bạn đã hủy giao dịch' : 'You rejected transaction'}`)
                                        return setActive(false)
                                    }
                                })
                        }
                    }, 1000)
                }
            }
        } catch (err) {
            console.log(err, 'Transaction fail, try again please')
            setNoti('')
            setActive(false)
        }
    }

    const handlePostInsurance = async (props: any, dataPost: any, state: any, _id: any, authToken: any) => {
        if (props) {
            try {
                if (_id) {
                    setRes(_id)
                    setNoti('success')
                    const params = {
                        owner: props.from,
                        transaction_hash: props.hash,
                        id_sc: _id,
                        asset_covered: dataPost.asset,
                        asset_refund: state.symbol,
                        margin: Number(state.margin),
                        q_covered: Number(state.q_covered),
                        p_claim: Number(state.p_claim),
                        period: Number(state.period),
                        isUseNain: dataPost.isUseNain,
                        p_market: state.p_market,
                        ref: !account?.ref && refError.isValid ? refCode : null,
                    }

                    const { data } = await fetchApi({
                        url: API_GET_BUY_INSURANCE,
                        options: {
                            method: 'POST',
                        },
                        params: params,
                        token: authToken,
                    })
                    if (data) {
                        if (!account?.ref) dispatch(setAccount({ ...account, ref: params.ref }))
                        localStorage.removeItem('REF_CODE')
                    }
                }
                if (!_id) {
                    setActive(false)
                    Config.toast.show('error', 'Purchased Fail')
                }
            } catch (error) {
                console.log(error)
            }
        } else {
            console.error('Error submitting transaction')
        }
    }

    const rangeOfRefund = () => {
        if (state) {
            if (state.p_claim > state.p_market) {
                return ` $${(state.p_market + (0.05 / 100) * state.p_market).toFixed(state?.decimalList?.decimal_p_claim)} - $${state.p_claim.toFixed(
                    state?.decimalList?.decimal_p_claim,
                )}`
            }
            if (state.p_claim < state.p_market) {
                return ` $${(state.p_market - (0.05 / 100) * state.p_market).toFixed(state?.decimalList?.decimal_p_claim)} - $${state.p_claim.toFixed(
                    state?.decimalList?.decimal_p_claim,
                )} `
            }
        }
    }

    useEffect(() => {
        setTimeout(() => {
            if (isUpdated) {
                if (count > 0) {
                    setCount(count - 1)
                }
                if (count == 0) {
                    return setUpdated(false)
                }
            }
        }, 1000)
    }, [count])

    const getHoursEN = (hours: number, minutes: number) => {
        const min = minutes < 10 ? `0${minutes}` : minutes
        if (hours < 12) {
            return (hours < 10 ? `0${hours}` : hours) + ':' + min + ' AM'
        } else if (hours == 12) {
            return hours + ':' + min + ' PM'
        } else if (hours == 24) {
            return 0 + 'AM'
        } else {
            return hours - 12 + ':' + min + ' PM'
        }
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    const timeEnd = () => {
        if (state) {
            let time = new Date()

            return language === 'en' ? (
                <span>
                    {getHoursEN(time.getHours(), time.getMinutes())} - {monthNames[time.getMonth() + 1]}/{time.getDate()}/{time.getFullYear()}
                </span>
            ) : (
                <span>
                    {time.getHours() < 10 ? '0' + time.getHours() : time.getHours()}:{time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()} -{' '}
                    {time.getDate()}/{time.getMonth() + 1}/{time.getFullYear()}
                </span>
            )
        }
    }

    useEffect(() => {
        const _refCode = localStorage.getItem('REF_CODE')
        if (!account?.address) return
        if (_refCode && !account?.ref) {
            setRefCode(_refCode)
        } else {
            localStorage.removeItem('REF_CODE')
        }
    }, [account])

    const checkRef = async () => {
        try {
            const { data, message } = await fetchApi({
                url: API_CHECK_REF,
                params: { ref: refCode, owner: account.address },
            })
            if (!data) {
                setRefError({ isValid: false, message: t(`errors:${message}`) })
                setCanBuy(false)
            } else {
                setCanBuy(true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const timer = useRef<any>(null)
    useEffect(() => {
        if (!refCode) {
            setCanBuy(true)
        }
        clearTimeout(timer.current)
        timer.current = setTimeout(() => {
            if (refCode) {
                setCanBuy(false)
                checkRef()
            }
        }, 500)
        setRefError({ isValid: true, message: '' })
    }, [refCode])

    return !loading && state != undefined ? (
        <>
            <Modal
                canBlur={false}
                isMobile={isMobile == true && true}
                portalId="modal"
                isVisible={active}
                closeButton={Noti == 'loading' && false}
                onBackdropCb={() => {
                    if (Noti == 'email' || Noti == 'loading') {
                        setActive(false)
                    }
                    if (Noti != 'email' && Noti != 'loading') {
                        setNoti('email')
                    }
                }}
                className={`${!isMobile ? 'w-max' : 'rounded-none !sticky !bottom-0 !left-0 !translate-y-0 !translate-x-0'} ${Noti === 'loading' && ''}`}
            >
                <NotificationInsurance id={res ? res : ''} name={`${Noti}`} state={state} active={active} setActive={() => setActive(false)} isMobile={false} />
            </Modal>
            {!isMobile ? (
                <div className="px-4 mb:px-10 lg:px-20">
                    <div className="max-w-screen-layout 4xl:max-w-screen-3xl m-auto">
                        {
                            // head Insurance
                            <div className="max-w-screen-layout 4xl:max-w-screen-3xl m-auto mt-[4rem] mb-[3rem] grid grid-cols-12 content-center items-center justify-between">
                                <div
                                    className="flex items-center font-semibold text-base col-span-4 hover:cursor-pointer"
                                    onClick={() => {
                                        return router.push('/buy-covered')
                                    }}
                                >
                                    <LeftArrow></LeftArrow>
                                    <span className={' text-txtPrimary hover:cursor-pointer ml-[8px]'}>{language == 'en' ? 'Back' : 'Quay về'}</span>
                                </div>

                                <div className={'flex flex-col justify-center items-center col-span-4'}>
                                    <div className={'font-semibold text-[32px] leading-[44px]'}>{t('insurance:buy:info_covered')}</div>
                                </div>

                                <Popover className="relative col-span-4 flex justify-end" data-tut="tour_custom" id="tour_custom">
                                    <Popover.Button
                                        className={
                                            'border border-[0.5] text-base border-hover rounded-[6px] h-[40px] w-auto py-[8px] px-[12px] flex flex-row bg-hover shadow focus-visible:outline-none'
                                        }
                                    >
                                        {`${state.tab == '0' ? t('insurance:buy:default') : t('insurance:buy:change_margin')}`}
                                        <ChevronDown></ChevronDown>
                                    </Popover.Button>
                                    <Popover.Panel className="absolute z-50 bg-white w-[260px] right-0 top-[48px] rounded shadow"></Popover.Panel>
                                </Popover>
                            </div>
                        }
                        <div
                            className="max-w-screen-md mx-auto flex flex-col"
                            style={{ filter: 'drop-shadow(0px 6px 18px rgba(9, 30, 66, 0.15)) drop-shadow(0px 0px 1px rgba(9, 30, 66, 0.31))' }}
                        >
                            <div className="relative bg-white" style={{ borderRadius: '5px 5px 0 0' }}>
                                <div className={'flex justify-center items-center mt-[32px]'}>
                                    <CheckCircle />
                                    <span className={'font-semibold text-txtPrimary px-[4px]'}>
                                        {`${t('insurance:buy:saved')} `}
                                        <span className={'text-redPrimary'}>
                                            ${saved.toFixed(4)} {state && state.unit}
                                        </span>{' '}
                                        {t('insurance:buy:sub_saved')}
                                    </span>
                                </div>
                            </div>

                            <div className="ticket relative overflow-hidden">
                                <div className="dashedLine absolute z-2000 top-[50%] left-[18px] w-[95%]"></div>
                            </div>

                            <div className="bg-[white] p-[1px]" style={{ borderRadius: '0 0 5px 5px' }}>
                                <div className="p-[2rem] pb-[3rem] pt-0">
                                    <div className="flex flex-row justify-between py-[8px] px-[8px] bg-hover">
                                        <div className={'text-txtSecondary flex items-center'}>
                                            <span className={'mr-[8px]'}>R-Claim</span>
                                            <div data-tip={t('insurance:terminology:r_claim')} data-for={`r-claim`}>
                                                <InfoCircle size={14} color={colors.txtSecondary} />
                                                <Tooltip className="max-w-[200px] !left-[120px] !top-[148px]" id={'r-claim'} placement="right" />
                                            </div>
                                        </div>
                                        <div className={'font-semibold'}>
                                            <span className={`${checkUpgrade ? 'line-through text-txtSecondary text-xs pr-[8px]' : 'pr-[8px]'}`}>
                                                {state?.r_claim?.toFixed(state?.decimalList?.decimal_q_covered)} %
                                            </span>
                                            <span className={`${checkUpgrade ? 'text-[#52CC74] font-semibold' : 'hidden'}`}>
                                                {((state?.q_claim + (state?.q_claim * 5) / 100) / state?.margin).toFixed(state?.decimalList?.decimal_q_covered)}{' '}
                                                %
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-row justify-between py-[8px] px-[8px]">
                                        <div className={'text-txtSecondary flex flex-row items-center'}>
                                            <span className={'mr-[8px]'}>Q-Claim</span>
                                            <div data-tip={t('insurance:terminology:q_claim')} data-for={`q_claim`}>
                                                <InfoCircle size={14} color={colors.txtSecondary} />
                                                <Tooltip className="max-w-[200px] !left-[120px] !top-[179px]" id={'q_claim'} placement="right" />
                                            </div>
                                        </div>
                                        <div className={'font-semibold flex flex-row items-center '}>
                                            <span className={`${checkUpgrade ? 'line-through text-txtSecondary pr-[8px] text-xs' : 'pr-[8px]'}`}>
                                                {(state?.q_claim).toFixed(state?.decimalList?.decimal_q_covered)}
                                            </span>{' '}
                                            <span className={`${checkUpgrade ? 'text-[#52CC74] font-semibold pr-[8px]' : 'hidden'}`}>
                                                {(state?.q_claim + (state?.q_claim * 5) / 100).toFixed(state?.decimalList?.decimal_q_covered)}
                                            </span>{' '}
                                            <div className="relative">
                                                <Menu>
                                                    <Menu.Button disabled={true} className={' text-blue underline hover:cursor-pointer'}>
                                                        <span className={'text-redPrimary decoration-white underline'}>{unitMoney.current}</span>
                                                    </Menu.Button>
                                                    <Menu.Items
                                                        className={'flex flex-col text-txtPrimary  bg-white absolute w-max right-0 text-base'}
                                                        style={{ boxShadow: '0px 3px 5px rgba(9, 30, 66, 0.2), 0px 0px 1px rgba(9, 30, 66, 0.31)' }}
                                                    >
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <a
                                                                    className={`${active && 'bg-blue-500'} py-[0.5rem] px-[1rem] w-max hover:bg-hover`}
                                                                    onClick={() => {
                                                                        unitMoney.current = 'USDT'
                                                                    }}
                                                                >
                                                                    <span>{'USDT'}</span>
                                                                </a>
                                                            )}
                                                        </Menu.Item>
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <a
                                                                    className={`${active && 'bg-blue-500'} py-[0.5rem] px-[1rem] w-max hover:bg-hover`}
                                                                    onClick={() => {
                                                                        unitMoney.current = state.symbol
                                                                    }}
                                                                >
                                                                    <span>{state.symbol}</span>
                                                                </a>
                                                            )}
                                                        </Menu.Item>
                                                    </Menu.Items>
                                                </Menu>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row justify-between py-[8px] px-[8px] bg-hover">
                                        <div className={'text-txtSecondary flex flex-row items-center'}>
                                            <span className={'mr-[8px]'}>Margin</span>
                                            <div data-tip={t('insurance:terminology:margin')} data-for={`margin`}>
                                                <InfoCircle size={14} color={colors.txtSecondary} />
                                                <Tooltip className="max-w-[200px] !left-[110px] !top-[235px]" id={'margin'} placement="right" />
                                            </div>
                                        </div>
                                        <div className={'font-semibold flex flex-row hover:cursor-pointer'}>
                                            <span className={'pr-[8px]'}>{state?.margin!.toFixed(state?.decimalList?.decimal_margin)}</span>{' '}
                                            <span className={'text-txtPrimary'}>{state?.unit}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-row justify-between py-[8px] px-[8px]">
                                        <div className={'text-txtSecondary flex flex-row items-center'}>
                                            <span className={'mr-[8px]'}>Period</span>
                                            <div data-tip={t('insurance:terminology:period')} data-for={`period`}>
                                                <InfoCircle size={14} color={colors.txtSecondary} />
                                                <Tooltip className="max-w-[200px] !left-[110px] !top-[268px]" id={'period'} placement="right" />
                                            </div>
                                        </div>
                                        <div className={'font-semibold'}>
                                            <span>
                                                <span className={`${checkUpgrade ? 'line-through text-txtSecondary text-xs' : 'pr-[2px]'}`}>
                                                    {state?.period} {t('insurance:buy:day')}
                                                </span>{' '}
                                                <span className={`${checkUpgrade ? 'text-[#52CC74] font-semibold' : 'hidden'}`}>
                                                    {state?.period + 2} {t('insurance:buy:day')}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    {!account?.ref && (
                                        <InputField
                                            label={t('common:ref_code')}
                                            vertical={false}
                                            containerClassName="justify-between"
                                            labelClassName="text-base w-full"
                                            inputClassName="!h-6 font-semibold text-right text-red text-base"
                                            placeholder="Nhập mã giới thiệu tại đây"
                                            validator={refError}
                                            value={refCode}
                                            onChange={(e: any) => {
                                                setRefCode(e.target.value)
                                                setCanBuy(false)
                                            }}
                                        />
                                    )}
                                    <div className="text-[#B2B7BC] text-xs py-[16px]">
                                        *{t('insurance:buy:notified')} {rangeOfRefund()} {t('insurance:buy:notified_sub')} {timeEnd()}
                                    </div>

                                    <div
                                        //flex
                                        className=" hidden rounded-[12px] p-[24px]  flex-row items-center border-hover border-1 relative"
                                        style={{ boxShadow: '0px 6px 18px rgba(9, 30, 66, 0.15), 0px 0px 1px rgba(9, 30, 66, 0.31)' }}
                                    >
                                        <div
                                            className={'rounded-[99999px] mr-[24px]'}
                                            style={{ background: 'linear-gradient(180deg, #FFFFFF -56.68%, #E6E6E6 100%)' }}
                                        >
                                            <img src={'/images/insurance/logo.png'} className="py-[12px] px-[17px]" />
                                        </div>
                                        <div className="flex flex-col select-none">
                                            <div>
                                                <div className="flex items-center mr-4 py-[8px] ">
                                                    <input
                                                        className={'hover:cursor-pointer hidden'}
                                                        type="radio"
                                                        id="test1"
                                                        checked={checkUpgrade}
                                                        onClick={() => setCheckUpgrade(!checkUpgrade)}
                                                        onChange={() => {}}
                                                    />
                                                    <CheckBoxIcon
                                                        bgColor="#F7F8FA"
                                                        dotColor="#F7F8FA"
                                                        size={24}
                                                        borderColor="#E5E7E8"
                                                        checked={checkUpgrade}
                                                        checkBgColor="#F7F8FA"
                                                        checkDotColor="#EB2B3E"
                                                        checkBorderColor="#EB2B3E"
                                                        className="hover:cursor-pointer mr-[8px]"
                                                        onClick={() => setCheckUpgrade(!checkUpgrade)}
                                                        onChange={() => {}}
                                                    />
                                                    <label htmlFor="test1" className="select-none font-semibold text-base text-txtPrimary">
                                                        {t('insurance:buy:upgrade')}
                                                    </label>
                                                </div>
                                            </div>
                                            <span className="select-none text-txtPrimary">{t('insurance:buy:upgrade_info')}</span>
                                            <div
                                                style={{
                                                    background: 'linear-gradient(88.09deg, #CE0014 0.48%, #E92828 52.94%, #FF5F6D 114.93%)',
                                                    borderRadius: '0px 0px 600px 600px',
                                                }}
                                                className={'absolute top-0 right-[24px] w-[48px] h-[48px] flex justify-center items-center'}
                                            >
                                                <StartIcon />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={'flex flex-col justify-center items-center my-[48px]'}>
                            <Button
                                variants={'primary'}
                                className={`bg-redPrimaryh-[48px] w-[374px] flex justify-center items-center text-white rounded-[8px] py-[12px]`}
                                onClick={() => {
                                    if (isUpdated) {
                                        setNoti('loading')
                                        createContract()
                                    }
                                    if (!isUpdated) {
                                        getPrice(`${state.symbol}${state?.unit}`, state, setState).then(() => {
                                            setUpdated(true)
                                            setCanBuy(true)
                                            setCount(10)
                                        })

                                        Config.toast.show('success', `${t('insurance:buy:price_had_update')}`)
                                    }
                                }}
                                disabled={!isCanBuy}
                            >
                                {isUpdated ? `${t('insurance:buy:accept')} (${count}s)` : language === 'vi' ? 'Cập nhật lại giá' : 'Update price'}
                            </Button>
                            <span className="my-[1rem] text-sm flex flex-col justify-center items-center">
                                {t('insurance:buy:Term_of_Service')}
                                <div>
                                    <span className={`${language == 'en' ? '' : 'hidden'}`}>{t('insurance:buy:Term_of_Service_of')}</span>
                                    <span
                                        className={'my-[16px] text-[#00ABF9] underline hover:cursor-pointer'}
                                        onClick={() => {
                                            router.push('https://nami.today/bao-hiem-trong-crypto-manh-dat-mau-mo-can-duoc-khai-pha/')
                                        }}
                                    >
                                        {t('insurance:buy:Term_of_Service_sub')}
                                    </span>
                                    <span className={`${language == 'vi' ? '' : 'hidden'}`}>{t('insurance:buy:Term_of_Service_of')}</span>
                                </div>
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="relative">
                    <div className="relative flex flex-col">
                        <div className="mt-[32px] mx-[24px] flex flex-row-reverse">
                            <span
                                onClick={() => {
                                    router.push('/buy-covered')
                                }}
                            >
                                <XMark></XMark>
                            </span>
                        </div>
                        <div className="relative bg-white mx-[24px]" style={{ borderRadius: '5px 5px 0 0' }}>
                            <div className={'flex flex-col mt-[24px] '}>
                                <div className={'font-semibold text-xl'}>
                                    <span>{t('insurance:buy:info_covered')}</span>
                                </div>
                                <div className="flex flex-row">
                                    <span className={'text-sm text-txtPrimary'}>
                                        {`${t('insurance:buy:saved')} `}
                                        <span className={'text-redPrimary px-[4px]'}>
                                            ${saved.toFixed(4)} {state?.unit}
                                        </span>{' '}
                                        {t('insurance:buy:sub_saved')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[white] my-[24px]">
                            <div className="mx-[24px]">
                                <div className="flex flex-row justify-between py-[8px] px-[8px] bg-hover">
                                    <div className={'text-txtSecondary flex flex-row items-center'}>
                                        <span className={'mr-[8px]'}>R-Claim</span>
                                        <div data-tip={t('insurance:terminology:r_claim')} data-for={`r-claim1`}>
                                            <InfoCircle size={14} color={colors.txtSecondary} />
                                            <Tooltip className="max-w-[200px]" id={'r-claim1'} placement="right" />
                                        </div>
                                    </div>
                                    <div className={'font-semibold'}>
                                        <span className={`${checkUpgrade ? 'line-through text-txtSecondary' : 'pr-[8px]'}`}>
                                            {(state?.r_claim).toFixed(state.decimalList.decimal_q_covered)}
                                        </span>{' '}
                                        <span className={`${checkUpgrade ? 'text-[#52CC74] font-semibold' : 'hidden'}`}>
                                            {((state?.q_claim + (state?.q_claim * 5) / 100) / state?.margin).toFixed(state?.decimalList?.decimal_q_covered)}
                                        </span>{' '}
                                        %
                                    </div>
                                </div>
                                <div className="flex flex-row justify-between py-[8px] px-[8px]">
                                    <div className={'text-txtSecondary flex flex-row items-center'}>
                                        <span className={'mr-[8px]'}>Q-Claim</span>
                                        <div data-tip={t('insurance:terminology:q_claim')} data-for={`q-claim`}>
                                            <InfoCircle size={14} color={colors.txtSecondary} />
                                            <Tooltip className="max-w-[200px]" id={'q-claim'} placement="right" />
                                        </div>
                                    </div>
                                    <div className={'font-semibold flex flex-row hover:cursor-pointer'}>
                                        <span className={`${checkUpgrade ? 'line-through text-txtSecondary pr-[8px]' : 'pr-[8px]'}`}>
                                            {(state?.q_claim).toFixed(state?.decimalList?.decimal_q_covered)}
                                        </span>{' '}
                                        <span className={`${checkUpgrade ? 'text-[#52CC74] font-semibold pr-[8px]' : 'hidden'}`}>
                                            {(state?.q_claim + (state?.q_claim * 5) / 100).toFixed(state?.decimalList?.decimal_q_covered)}
                                        </span>{' '}
                                        {/* <span className={'pl-[8px]'}>{state?.unit}</span> */}
                                        <div className="relative pl-[0.5rem]">
                                            <Menu>
                                                <Menu.Button className={' text-blue underline hover:cursor-pointer min-w-[2.5rem]'}>
                                                    <span className={'text-redPrimary decoration-white underline '}>{unitMoney.current}</span>
                                                </Menu.Button>
                                                <Menu.Items
                                                    className={'flex flex-col text-txtPrimary  bg-white absolute w-max right-0 text-base'}
                                                    style={{ boxShadow: '0px 3px 5px rgba(9, 30, 66, 0.2), 0px 0px 1px rgba(9, 30, 66, 0.31)' }}
                                                >
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <a
                                                                className={`${active && 'bg-blue-500'} py-[0.5rem] px-[1rem] w-max hover:bg-hover`}
                                                                onClick={() => {
                                                                    unitMoney.current = 'USDT'
                                                                }}
                                                            >
                                                                <span>{'USDT'}</span>
                                                            </a>
                                                        )}
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <a
                                                                className={`${active && 'bg-blue-500'} py-[0.5rem] px-[1rem] w-max hover:bg-hover`}
                                                                onClick={() => {
                                                                    unitMoney.current = state.symbol
                                                                }}
                                                            >
                                                                <span>{state.symbol}</span>
                                                            </a>
                                                        )}
                                                    </Menu.Item>
                                                </Menu.Items>
                                            </Menu>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row justify-between py-[8px] px-[8px] bg-hover">
                                    <div className={'text-txtSecondary flex flex-row items-center'}>
                                        <span className={'mr-[8px]'}>Margin</span>
                                        <div data-tip={t('insurance:terminology:margin')} data-for={`margin`}>
                                            <InfoCircle size={14} color={colors.txtSecondary} />
                                            <Tooltip className="max-w-[200px]" id={'margin'} placement="right" />
                                        </div>
                                    </div>
                                    <div className={'font-semibold flex flex-row hover:cursor-pointer'}>
                                        <span className={'pr-[2px]'}>{(state?.margin).toFixed(state?.decimalList?.decimal_margin)}</span>{' '}
                                        <span className={'text-txtPrimary pl-[14px]'}>{state?.unit}</span>
                                    </div>
                                </div>
                                <div className="flex flex-row justify-between py-[8px] px-[8px]">
                                    <div className={'text-txtSecondary flex flex-row items-center'}>
                                        <span className={'mr-[8px]'}>Period</span>
                                        <div data-tip={t('insurance:terminology:period')} data-for={`period`}>
                                            <InfoCircle size={14} color={colors.txtSecondary} />
                                            <Tooltip className="max-w-[200px]" id={'period'} placement="right" />
                                        </div>
                                    </div>
                                    <div className={'font-semibold'}>
                                        <span>
                                            <span className={`${checkUpgrade ? 'line-through text-txtSecondary' : 'pr-[2px]'}`}>{state?.period}</span>{' '}
                                            <span className={`${checkUpgrade ? 'text-[#52CC74] font-semibold' : 'hidden'}`}>{state?.period + 2}</span>{' '}
                                            {t('insurance:buy:day')}
                                        </span>
                                    </div>
                                </div>
                                {!account?.ref && (
                                    <InputField
                                        label={t('common:ref_code')}
                                        vertical={false}
                                        containerClassName="justify-between"
                                        labelClassName="text-base w-full"
                                        inputClassName="!h-6 font-semibold text-right text-red text-base"
                                        placeholder="Nhập mã giới thiệu tại đây"
                                        validator={refError}
                                        value={refCode}
                                        onChange={(e: any) => {
                                            setCanBuy(false)
                                            setRefCode(e.target.value)
                                        }}
                                    />
                                )}
                                <div className="text-[#B2B7BC] text-xs py-[16px]">
                                    *{t('insurance:buy:notified')} {rangeOfRefund()} {t('insurance:buy:notified_sub')} {timeEnd()}
                                </div>
                                <div
                                    //flex
                                    className="rounded-[12px] p-[24px] hidden flex-row items-center border-hover border-1 relative"
                                    style={{ boxShadow: '0px 6px 18px rgba(9, 30, 66, 0.15), 0px 0px 1px rgba(9, 30, 66, 0.31)' }}
                                >
                                    <div
                                        className={'rounded-full min-w-max h-auto'}
                                        style={{ background: 'linear-gradient(180deg, #FFFFFF -56.68%, #E6E6E6 100%)' }}
                                    >
                                        <img
                                            src={'/images/insurance/logo.png'}
                                            className="flex items-center content-center py-[11px] px-[19px] w-auto h-[68px]"
                                        />
                                    </div>
                                    <div className="flex flex-col w-full select-none ml-[24px]">
                                        <div>
                                            <div className="flex items-center mr-4 sm:py-[8px] ">
                                                <input
                                                    className={'hover:cursor-pointer hidden'}
                                                    type="radio"
                                                    id="test1"
                                                    checked={checkUpgrade}
                                                    onChange={() => {}}
                                                    onClick={() => setCheckUpgrade(!checkUpgrade)}
                                                />
                                                <CheckBoxIcon
                                                    bgColor="#F7F8FA"
                                                    dotColor="#F7F8FA"
                                                    size={26}
                                                    borderColor="#E5E7E8"
                                                    checked={checkUpgrade}
                                                    checkBgColor="#F7F8FA"
                                                    checkDotColor="#EB2B3E"
                                                    checkBorderColor="#EB2B3E"
                                                    className="hover:cursor-pointer mr-[8px]"
                                                    onClick={() => setCheckUpgrade(!checkUpgrade)}
                                                    onChange={() => {}}
                                                />
                                                <label htmlFor="test1" className="select-none text-sm text-txtPrimary font-semibold">
                                                    {t('insurance:buy:upgrade')}
                                                </label>
                                            </div>
                                        </div>
                                        <span className="select-none text-txtPrimary text-xs font-medium">{t('insurance:buy:upgrade_info')}</span>
                                        <div
                                            style={{
                                                background: 'linear-gradient(88.09deg, #CE0014 0.48%, #E92828 52.94%, #FF5F6D 114.93%)',
                                                borderRadius: '0px 0px 600px 600px',
                                            }}
                                            className={`${
                                                !isMobile ? 'w-[48px] h-[48px]' : 'w-[24px] h-[24px]'
                                            } absolute top-0 right-[24px]  flex justify-center items-center`}
                                        >
                                            <StartIcon size={!isMobile ? 36 : 24} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={'flex flex-col justify-center items-center mt-[4rem] mx-[24px]'}>
                        <span className="text-center pb-[16px] text-xs">
                            {t('insurance:buy:Term_of_Service')}
                            <div>
                                <span
                                    className={`${language == 'en' ? '' : 'hidden'}`}
                                    onClick={() => {
                                        router.push('https://nami.today/bao-hiem-trong-crypto-manh-dat-mau-mo-can-duoc-khai-pha/')
                                    }}
                                >
                                    {t('insurance:buy:Term_of_Service_of')}
                                </span>
                                <span
                                    className={'my-[16px] text-[#00ABF9] underline hover:cursor-pointer'}
                                    onClick={() => {
                                        router.push('https://nami.today/bao-hiem-trong-crypto-manh-dat-mau-mo-can-duoc-khai-pha/')
                                    }}
                                >
                                    {t('insurance:buy:Term_of_Service_sub')}
                                </span>
                                <span className={`${language == 'vi' ? '' : 'hidden'}`}>{t('insurance:buy:Term_of_Service_of')}</span>
                            </div>
                        </span>
                        <Button
                            variants={'primary'}
                            className={`${
                                !isCanBuy ? 'bg-[#E5E7E8]' : 'bg-redPrimary'
                            }  h-[48px] w-full flex flex-row justify-center items-center text-white rounded-[8px] py-[12px]`}
                            onClick={() => {
                                if (isUpdated) {
                                    setNoti('loading')
                                    createContract()
                                }
                                if (!isUpdated) {
                                    getPrice(`${state.symbol}${state?.unit}`, state, setState).then(() => {
                                        setUpdated(true)
                                        setCanBuy(true)
                                        setCount(10)
                                    })

                                    Config.toast.show('success', `${t('insurance:buy:price_had_update')}`)
                                }
                            }}
                            disabled={!isCanBuy}
                        >
                            {isUpdated ? `${t('insurance:buy:accept')} (${count}s)` : language === 'vi' ? 'Cập nhật lại giá' : 'Update price'}
                        </Button>
                    </div>
                </div>
            )}
        </>
    ) : (
        <></>
    )
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

export default AcceptBuyInsurance
