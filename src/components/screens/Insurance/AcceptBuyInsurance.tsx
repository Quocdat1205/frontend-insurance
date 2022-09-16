import axios from 'axios'
import Button from 'components/common/Button/Button'
import Config from 'config/config'
import useWeb3Wallet from 'hooks/useWeb3Wallet'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { formatPriceToWeiValue } from 'utils/format'
import { CheckBoxIcon, CheckCircle, ErrorCircleIcon, InfoCircle, StartIcon, XMark } from 'components/common/Svg/SvgIcon'
import { buyInsurance } from 'services/buy-insurance'
import useWindowSize from 'hooks/useWindowSize'
import { screens } from 'utils/constants'
import { useRouter } from 'next/router'
import Tooltip from 'components/common/Tooltip/Tooltip'
import colors from 'styles/colors'

export type IProps = {
    state: any
    setState: any
    menu: any
    checkUpgrade: boolean
    setCheckUpgrade: any
    getPrice: any
    setNoti: any
    handelSetActive: any
    setRes: any
    setIndex: any
    unit: string
}

export type IBuyInsurance = {
    createInsurance: number
    _buyer: string
    _cover_payout: any
    _asset: string
    _current_price: any
    _insurance_value: any
    _expire: any
}

export const AcceptBuyInsurance = ({
    state,
    setState,
    menu,
    checkUpgrade,
    setCheckUpgrade,
    getPrice,
    setNoti,
    handelSetActive,
    setRes,
    setIndex,
    unit,
}: Partial<IProps>) => {
    const {
        t,
        i18n: { language },
    } = useTranslation()
    const wallet = useWeb3Wallet()
    const router = useRouter()
    const { width } = useWindowSize()
    const isMobile = width && width < screens.drawer

    useEffect(() => {
        fetch()
    }, [])

    console.log(wallet)

    const fetch = async () => {
        try {
            const e = await wallet.contractCaller.insuranceContract.contract.filters.EBuyInsurance()

            const filter = await wallet.contractCaller.insuranceContract.contract.queryFilter(e, 22658137, 22658137 + 1000)
        } catch (err) {
            console.log(err)
        }
    }

    const [isUpdated, setUpdated] = useState<boolean>(false)
    const [isCanBuy, setCanBuy] = useState<boolean>(false)

    const onConnectWallet = () => {
        try {
            Config.connectWallet()
        } catch (err) {
            console.log(err)
        }
    }

    const createContract = async () => {
        if (!wallet.account) {
            return Config.toast.show('error', t('common:please_connect_your_wallet'), {
                button: (
                    <button className="text-sm font-semibold underline" onClick={onConnectWallet}>
                        {t('common:connect_now')}
                    </button>
                ),
            })
        }

        try {
            const { data } = await axios.get(`https://test.nami.exchange/api/v3/spot/market_watch?symbol=${state.symbol.symbol}`)

            if (data.data.length > 0) {
                if (data.data[0].p != state.p_market) {
                    setUpdated(false)
                    return setCanBuy(false)
                }
            }

            if (!checkUpgrade) {
                const t_expired = new Date()
                t_expired.setDate(state.t_market.getDate() + state.period)

                const dataPost = {
                    buyer: wallet?.account as string,
                    asset: state.symbol.type,
                    margin: formatPriceToWeiValue(Number(state.margin)),
                    q_covered: formatPriceToWeiValue(Number(state.q_covered)),
                    p_market: formatPriceToWeiValue(Number(data.data[0].p)),
                    p_claim: formatPriceToWeiValue(Number(state.p_claim)),
                    period: state.period,
                    isUseNain: checkUpgrade && checkUpgrade,
                }
                console.log(dataPost)

                const buy = await wallet.contractCaller.insuranceContract.contract.createInsurance(
                    dataPost.buyer,
                    dataPost.asset,
                    dataPost.margin,
                    dataPost.q_covered,
                    dataPost.p_market,
                    dataPost.p_claim,
                    dataPost.period,
                    dataPost.isUseNain,
                    { value: dataPost.margin },
                )
                await buy.wait()

                const id_sc = await buy.wait()

                if (buy && id_sc.events[0].args[0]) {
                    handlePostInsurance(buy, dataPost, state, Number(id_sc.events[0].args[0]))
                }
            }

            if (checkUpgrade) {
                const dataPost = {
                    buyer: wallet?.account as string,
                    asset: state.symbol.type,
                    margin: formatPriceToWeiValue(state.margin),
                    q_covered: formatPriceToWeiValue(state.q_covered),
                    p_market: formatPriceToWeiValue(data.data[0].p),
                    p_claim: formatPriceToWeiValue(state.p_claim),
                    period: state.period + 2,
                    isUseNain: checkUpgrade,
                }
                console.log(dataPost)

                const buy = await wallet.contractCaller.insuranceContract.contract.createInsurance(
                    dataPost.buyer,
                    dataPost.asset,
                    dataPost.margin,
                    dataPost.q_covered,
                    dataPost.p_market,
                    dataPost.p_claim,
                    dataPost.period,
                    dataPost.isUseNain,
                    { value: dataPost.margin },
                )
                await buy.wait()

                const id_sc = await buy.wait()

                if (buy && id_sc.events[0].args[0]) {
                    console.log(buy)

                    handlePostInsurance(buy, dataPost, state, Number(id_sc.events[0].args[0]))
                }
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handlePostInsurance = async (props: any, dataPost: any, state: any, _id: any) => {
        if (props) {
            try {
                const data = {
                    owner: props.from,
                    transaction_hash: props.hash,
                    id_sc: _id,
                    asset_covered: dataPost.asset,
                    asset_refund: dataPost.unit,
                    margin: state.margin,
                    q_covered: Number(state.q_covered),
                    p_claim: Number(state.p_claim),
                    period: state.period,
                    isUseNain: props.isUseNain,
                }
                handelSetActive(true)
                await buyInsurance(data).then((res) => {
                    if (res.statusCode === 201) {
                        setRes(res)
                        setNoti('success')
                    }
                })
            } catch (error) {
                console.log(error)
            }
        } else {
            console.error('Error submitting transaction')
        }
    }

    return !isMobile ? (
        <div className="max-w-screen-layout 4xl:max-w-screen-3xl m-auto">
            <div
                className="max-w-screen-md mx-auto flex flex-col"
                style={{ filter: 'drop-shadow(0px 6px 18px rgba(9, 30, 66, 0.15)) drop-shadow(0px 0px 1px rgba(9, 30, 66, 0.31))' }}
            >
                <div className="relative bg-white" style={{ borderRadius: '5px 5px 0 0' }}>
                    <div className={'flex justify-center items-center my-[32px]'}>
                        <CheckCircle />
                        <span className={'font-semibold text-[#22313F] px-[4px]'}>
                            {`${t('insurance:buy:saved')} `}
                            <span className={'text-[#EB2B3E]'}>1,000 {unit}</span> {t('insurance:buy:sub_saved')}
                        </span>
                    </div>
                </div>

                <div className="ticket relative overflow-hidden">
                    <div className="dashedLine absolute z-2000 top-[50%] left-[18px] w-[95%]"></div>
                </div>

                <div className="bg-[white] p-[1px]" style={{ borderRadius: '0 0 5px 5px' }}>
                    <div className="p-[32px] pb-[24px] pt-0">
                        <div className="flex flex-row justify-between py-[8px] px-[8px] bg-[#F7F8FA]">
                            <div className={'text-[#808890] flex items-center'}>
                                <span className={'mr-[8px]'}>R-Claim</span>
                                <div data-tip={t('insurance:terminology:r_claim')} data-for={`r-claim`}>
                                    <InfoCircle size={14} color={colors.txtSecondary} />
                                    <Tooltip className="max-w-[200px] !left-[120px] !top-[148px]" id={'r-claim'} placement="right" />
                                </div>
                            </div>
                            <div className={'font-semibold'}>
                                <span className={`${checkUpgrade ? 'line-through text-[#808890] text-xs pr-[8px]' : 'pr-[8px]'}`}>
                                    {state.r_claim.toFixed(2)} %
                                </span>
                                <span className={`${checkUpgrade ? 'text-[#52CC74] font-semibold' : 'hidden'}`}>
                                    {((state.q_claim + (state.q_claim * 5) / 100) / state.margin).toFixed(2)} %
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between py-[8px] px-[8px]">
                            <div className={'text-[#808890] flex flex-row items-center'}>
                                <span className={'mr-[8px]'}>Q-Claim</span>
                                <div data-tip={t('insurance:terminology:q_claim')} data-for={`q_claim`}>
                                    <InfoCircle size={14} color={colors.txtSecondary} />
                                    <Tooltip className="max-w-[200px] !left-[120px] !top-[179px]" id={'q_claim'} placement="right" />
                                </div>
                            </div>
                            <div className={'font-semibold '}>
                                <span className={`${checkUpgrade ? 'line-through text-[#808890] pr-[8px] text-xs' : 'pr-[8px]'}`}>
                                    {state.q_claim.toFixed(2)}
                                </span>{' '}
                                <span className={`${checkUpgrade ? 'text-[#52CC74] font-semibold pr-[8px]' : 'hidden'}`}>
                                    {(state.q_claim + (state.q_claim * 5) / 100).toFixed(2)}
                                </span>{' '}
                                <span className={'text-[#EB2B3E]'}>{unit}</span>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between py-[8px] px-[8px] bg-[#F7F8FA]">
                            <div className={'text-[#808890] flex flex-row items-center'}>
                                <span className={'mr-[8px]'}>Margin</span>
                                <div data-tip={t('insurance:terminology:margin')} data-for={`margin`}>
                                    <InfoCircle size={14} color={colors.txtSecondary} />
                                    <Tooltip className="max-w-[200px] !left-[110px] !top-[235px]" id={'margin'} placement="right" />
                                </div>
                            </div>
                            <div className={'font-semibold flex flex-row hover:cursor-pointer'}>
                                <span className={'pr-[8px]'}>{state.margin.toFixed(2)}</span> <span className={'text-[#EB2B3E]'}>{unit}</span>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between py-[8px] px-[8px]">
                            <div className={'text-[#808890] flex flex-row items-center'}>
                                <span className={'mr-[8px]'}>Period</span>
                                <div data-tip={t('insurance:terminology:period')} data-for={`period`}>
                                    <InfoCircle size={14} color={colors.txtSecondary} />
                                    <Tooltip className="max-w-[200px] !left-[110px] !top-[268px]" id={'period'} placement="right" />
                                </div>
                            </div>
                            <div className={'font-semibold'}>
                                <span>
                                    <span className={`${checkUpgrade ? 'line-through text-[#808890] text-xs' : 'pr-[2px]'}`}>
                                        {state.period} {menu[8].name}
                                    </span>{' '}
                                    <span className={`${checkUpgrade ? 'text-[#52CC74] font-semibold' : 'hidden'}`}>
                                        {state.period + 2} {menu[8].name}
                                    </span>
                                </span>
                            </div>
                        </div>
                        <div className="text-[#B2B7BC] text-xs py-[16px]">
                            *{t('insurance:buy:notified')} 10,000$ - 12,000$ {t('insurance:buy:notified_sub')}
                        </div>
                        {!isUpdated && (
                            <div className="text-[#EB2B3E] bg-[#F7F8FA] rounded-[12px] mb-[24px] w-full flex flex-row justify-between items-center px-[18px]">
                                <div className={'flex flex-row py-[14px]'}>
                                    <span className="mr-[6px]">
                                        <ErrorCircleIcon size={24} />
                                    </span>
                                    <span className=""> {t('insurance:buy:price_had_update')}</span>
                                </div>
                                <div>
                                    <Button
                                        variants="outlined"
                                        className="py-[8px] px-[24px] rounded-[8px]"
                                        onClick={() => {
                                            getPrice(state.symbol.symbol, state, setState)
                                            setUpdated(true)
                                            setCanBuy(true)
                                            Config.toast.show('success', `${t('insurance:buy:price_had_update')}`)
                                        }}
                                    >
                                        {t('insurance:buy:accept')}
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div
                            className="rounded-[12px] p-[24px] flex flex-row items-center border-[#F7F8FA] border-1 relative"
                            style={{ boxShadow: '0px 6px 18px rgba(9, 30, 66, 0.15), 0px 0px 1px rgba(9, 30, 66, 0.31)' }}
                        >
                            <div className={'rounded-[99999px] mr-[24px]'} style={{ background: 'linear-gradient(180deg, #FFFFFF -56.68%, #E6E6E6 100%)' }}>
                                <img src={'/images/logo.png'} className="py-[12px] px-[17px]" />
                            </div>
                            <div className="flex flex-col select-none">
                                <div>
                                    <div className="flex items-center mr-4 py-[8px] ">
                                        <input
                                            className={'hover:cursor-pointer hidden'}
                                            type="radio"
                                            id="test1"
                                            checked={checkUpgrade}
                                            onChange={(e) => {
                                                console.log(e)
                                            }}
                                            onClick={() => setCheckUpgrade(!checkUpgrade)}
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
                                            onChange={(e: any) => {
                                                console.log(e)
                                            }}
                                        />
                                        <label htmlFor="test1" className="select-none font-semibold text-base text-[#22313F]">
                                            {t('insurance:buy:upgrade')}
                                        </label>
                                    </div>
                                </div>
                                <span className="select-none text-[#22313F]">{t('insurance:buy:upgrade_info')}</span>
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
                    className={`${
                        !isCanBuy ? 'bg-[#E5E7E8]' : 'bg-[#EB2B3E]'
                    }  h-[48px] w-[374px] flex justify-center items-center text-white rounded-[8px] py-[12px]`}
                    onClick={() => {
                        setNoti('loading')
                        createContract()
                    }}
                    disable={!isCanBuy}
                >
                    {t('insurance:buy:accept')}
                </Button>
                <span className="my-[16px] flex flex-col justify-center items-center">
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
    ) : (
        <div className="relative">
            <div className="relative flex flex-col">
                <div className="mt-[32px] mx-[24px] flex flex-row-reverse">
                    <span
                        onClick={() => {
                            setIndex(1)
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
                            <span className={'text-sm text-[#22313F]'}>
                                {`${t('insurance:buy:saved')} `}
                                <span className={'text-[#EB2B3E] px-[4px]'}>1,000 {unit}</span> {t('insurance:buy:sub_saved')}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-[white] my-[24px]">
                    <div className="mx-[24px]">
                        <div className="flex flex-row justify-between py-[8px] px-[8px] bg-[#F7F8FA]">
                            <div className={'text-[#808890] flex flex-row items-center'}>
                                <span className={'mr-[8px]'}>R-Claim</span>
                                <div data-tip={t('insurance:terminology:r_claim')} data-for={`r-claim1`}>
                                    <InfoCircle size={14} color={colors.txtSecondary} />
                                    <Tooltip className="max-w-[200px]" id={'r-claim1'} placement="right" />
                                </div>
                            </div>
                            <div className={'font-semibold'}>
                                <span className={`${checkUpgrade ? 'line-through text-[#808890]' : 'pr-[8px]'}`}>{state.r_claim.toFixed(2)}</span>{' '}
                                <span className={`${checkUpgrade ? 'text-[#52CC74] font-semibold' : 'hidden'}`}>
                                    {((state.q_claim + (state.q_claim * 5) / 100) / state.margin).toFixed(2)}
                                </span>{' '}
                                %
                            </div>
                        </div>
                        <div className="flex flex-row justify-between py-[8px] px-[8px]">
                            <div className={'text-[#808890] flex flex-row items-center'}>
                                <span className={'mr-[8px]'}>Q-Claim</span>
                                <div data-tip={t('insurance:terminology:q_claim')} data-for={`q-claim`}>
                                    <InfoCircle size={14} color={colors.txtSecondary} />
                                    <Tooltip className="max-w-[200px]" id={'q-claim'} placement="right" />
                                </div>
                            </div>
                            <div className={'font-semibold flex flex-row hover:cursor-pointer'}>
                                <span className={`${checkUpgrade ? 'line-through text-[#808890] pr-[8px]' : 'pr-[8px]'}`}>{state.q_claim.toFixed(2)}</span>{' '}
                                <span className={`${checkUpgrade ? 'text-[#52CC74] font-semibold pr-[8px]' : 'hidden'}`}>
                                    {(state.q_claim + (state.q_claim * 5) / 100).toFixed(2)}
                                </span>{' '}
                                <span className={'text-[#EB2B3E] pl-[8px]'}>{unit}</span>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between py-[8px] px-[8px] bg-[#F7F8FA]">
                            <div className={'text-[#808890] flex flex-row items-center'}>
                                <span className={'mr-[8px]'}>Margin</span>
                                <div data-tip={t('insurance:terminology:margin')} data-for={`margin`}>
                                    <InfoCircle size={14} color={colors.txtSecondary} />
                                    <Tooltip className="max-w-[200px]" id={'margin'} placement="right" />
                                </div>
                            </div>
                            <div className={'font-semibold flex flex-row hover:cursor-pointer'}>
                                <span className={'pr-[2px]'}>{state.margin.toFixed(2)}</span> <span className={'text-[#EB2B3E] pl-[14px]'}>{unit}</span>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between py-[8px] px-[8px]">
                            <div className={'text-[#808890] flex flex-row items-center'}>
                                <span className={'mr-[8px]'}>Period</span>
                                <div data-tip={t('insurance:terminology:period')} data-for={`period`}>
                                    <InfoCircle size={14} color={colors.txtSecondary} />
                                    <Tooltip className="max-w-[200px]" id={'period'} placement="right" />
                                </div>
                            </div>
                            <div className={'font-semibold'}>
                                <span>
                                    <span className={`${checkUpgrade ? 'line-through text-[#808890]' : 'pr-[2px]'}`}>{state.period}</span>{' '}
                                    <span className={`${checkUpgrade ? 'text-[#52CC74] font-semibold' : 'hidden'}`}>{state.period + 2}</span> {menu[8].name}
                                </span>
                            </div>
                        </div>
                        <div className="text-[#B2B7BC] text-xs py-[16px]">
                            *{t('insurance:buy:notified')} 10,000$ - 12,000$ {t('insurance:buy:notified_sub')}
                        </div>
                        {!isUpdated ? (
                            <div className="text-[#EB2B3E] bg-[#F7F8FA] rounded-[12px] mb-[24px] w-full flex flex-row justify-between items-center px-[18px]">
                                <div className={'flex flex-row items-center py-[14px]'}>
                                    <span className="pr-[8px]">
                                        <ErrorCircleIcon size={16} />
                                    </span>
                                    <span className="text-sm"> {t('insurance:buy:price_had_update')}</span>
                                </div>
                                <div>
                                    <Button
                                        variants="outlined"
                                        className={`py-[8px] rounded-[8px] px-[6px] text-xs tiny:px-[24px]`}
                                        onClick={() => {
                                            getPrice(state.symbol.symbol, state, setState)
                                            setUpdated(true)
                                            setCanBuy(true)
                                            Config.toast.show('success', `${t('insurance:buy:price_had_update')}`)
                                        }}
                                    >
                                        {t('insurance:buy:accept')}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-[#52CC74] bg-[#F7F8FA] rounded-[12px] mb-[24px] w-full flex flex-row justify-between items-center px-[18px]">
                                <div className={'flex flex-row items-center py-[14px]'}>
                                    <span className="pr-[8px]">
                                        <CheckCircle />
                                    </span>
                                    <span className="text-sm"> {t('insurance:buy:price_had_update')}</span>
                                </div>
                            </div>
                        )}

                        <div
                            className="rounded-[12px] p-[24px] flex flex-row items-center border-[#F7F8FA] border-1 relative"
                            style={{ boxShadow: '0px 6px 18px rgba(9, 30, 66, 0.15), 0px 0px 1px rgba(9, 30, 66, 0.31)' }}
                        >
                            <div className={'rounded-full min-w-max h-auto'} style={{ background: 'linear-gradient(180deg, #FFFFFF -56.68%, #E6E6E6 100%)' }}>
                                <img src={'/images/logo.png'} className="flex items-center content-center py-[11px] px-[19px] w-auto h-[68px]" />
                            </div>
                            <div className="flex flex-col w-full select-none ml-[24px]">
                                <div>
                                    <div className="flex items-center mr-4 sm:py-[8px] ">
                                        <input
                                            className={'hover:cursor-pointer hidden'}
                                            type="radio"
                                            id="test1"
                                            checked={checkUpgrade}
                                            onChange={(e) => {
                                                console.log(e)
                                            }}
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
                                            onChange={(e: any) => {
                                                console.log(e)
                                            }}
                                        />
                                        <label htmlFor="test1" className="select-none text-sm text-[#22313F] font-semibold">
                                            {t('insurance:buy:upgrade')}
                                        </label>
                                    </div>
                                </div>
                                <span className="select-none text-[#22313F] text-xs font-medium">{t('insurance:buy:upgrade_info')}</span>
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

            <div className={'flex flex-col justify-center items-center mt-[89px] mx-[24px]'}>
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
                        !isCanBuy ? 'bg-[#E5E7E8]' : 'bg-[#EB2B3E]'
                    }  h-[48px] w-[95%] tiny:w-[374px] flex justify-center items-center text-white rounded-[8px] py-[12px]`}
                    onClick={() => {
                        setNoti('loading')
                        createContract()
                    }}
                    disable={!isCanBuy}
                >
                    {t('insurance:buy:accept')}
                </Button>
            </div>
        </div>
    )
}

export const getPriceFinal = async (symbol: string) => {
    try {
        const { data } = await axios.get(`https://test.nami.exchange/api/v3/spot/market_watch?symbol=${symbol}`)
        if (data) {
            if (data.data[0]) {
                return data.data[0].p
            }
        }
    } catch (err) {
        console.log(err)
    }
}
