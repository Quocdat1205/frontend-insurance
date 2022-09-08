import axios from 'axios'
import Button from 'components/common/Button/Button'
import Config from 'config/config'
import useWeb3Wallet from 'hooks/useWeb3Wallet'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatPriceToWeiValue } from 'utils/format'
import { CheckBoxIcon, CheckCircle, ErrorCircleIcon, StartIcon } from 'components/common/Svg/SvgIcon'
import { buyInsurance } from 'services/buy-insurance'
import useWindowSize from 'hooks/useWindowSize'
import { screens } from 'utils/constants'
import NotificationInsurance from 'components/layout/notifucationInsurance'
import { useRouter } from 'next/router'

export type IProps = {
    state: any
    setState: any
    menu: any
    checkUpgrade: boolean
    setCheckUpgrade: any
    getPrice: any
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

export const AcceptBuyInsurance = ({ state, setState, menu, checkUpgrade, setCheckUpgrade, getPrice }: Partial<IProps>) => {
    const {
        t,
        i18n: { language },
    } = useTranslation()
    const wallet = useWeb3Wallet()
    const router = useRouter()
    const { width } = useWindowSize()
    const isMobile = width && width < screens.drawer

    console.log(wallet)

    const [isUpdated, setUpdated] = useState<boolean>(false)
    const [isCanBuy, setCanBuy] = useState<boolean>(false)
    const [active, setActive] = useState<boolean>(false)

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
                    margin: formatPriceToWeiValue(state.margin),
                    q_covered: formatPriceToWeiValue(state.q_covered),
                    p_market: formatPriceToWeiValue(data.data[0].p),
                    p_claim: formatPriceToWeiValue(state.p_claim),
                    period: state.period,
                }

                console.log(state, dataPost)

                const buy = await wallet.contractCaller.insuranceContract.contract
                    .createInsurance(
                        dataPost.buyer,
                        dataPost.asset,
                        dataPost.margin,
                        dataPost.q_covered,
                        dataPost.p_market,
                        dataPost.p_claim,
                        dataPost.period,
                        { value: dataPost.margin },
                    )
                    .then((receipt: any) => {
                        console.log(receipt)
                        handlePostInsurance(receipt, dataPost, state)
                    })
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
                }
                const buy = await wallet.contractCaller.insuranceContract.contract
                    .createInsurance(
                        dataPost.buyer,
                        dataPost.asset,
                        dataPost.margin,
                        dataPost.q_covered,
                        dataPost.p_market,
                        dataPost.p_claim,
                        dataPost.period,
                        { value: dataPost.margin },
                    )
                    .then((e: any) => {
                        console.log(e)
                        handlePostInsurance(e, dataPost, state)
                    })
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handlePostInsurance = async (props: any, dataPost: any, state: any) => {
        if (props) {
            try {
                const data = {
                    owner: props.from,
                    transaction_hash: props.hash,
                    id_sc: 0,
                    asset_covered: dataPost.asset,
                    asset_refund: 'USDT',
                    margin: state.margin,
                    q_covered: state.q_covered,
                    p_claim: state.p_claim,
                    period: state.period,
                }

                await buyInsurance(data).then((e) => {
                    if (e) {
                        setActive(true)
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
        <>
            <div
                className="max-w-screen-md mx-auto relative flex flex-col"
                style={{ filter: 'drop-shadow(0px 6px 18px rgba(9, 30, 66, 0.15)) drop-shadow(0px 0px 1px rgba(9, 30, 66, 0.31))' }}
            >
                <div className="relative bg-white" style={{ borderRadius: '5px 5px 0 0' }}>
                    <div className={'flex justify-center items-center my-[32px]'}>
                        <CheckCircle />
                        <span className={'font-semibold text-[#22313F] px-[4px]'}>
                            {`${t('insurance:buy:saved')} `}
                            <span className={'text-[#EB2B3E]'}>1,000 USDT</span> {t('insurance:buy:sub_saved')}
                        </span>
                    </div>
                </div>

                <div className="ticket relative overflow-hidden">
                    <div className="dashedLine absolute z-2000 top-[50%] left-[18px] w-[95%]"></div>
                </div>

                <div className="bg-[white] p-[1px] " style={{ borderRadius: '0 0 5px 5px' }}>
                    <div className={''}>
                        <div className="p-[32px] pb-[24px] pt-0">
                            <div className="flex flex-row justify-between py-[8px] px-[8px] bg-[#F7F8FA]">
                                <div className={'text-[#808890]'}>R-Claim</div>
                                <div className={'font-semibold'}>
                                    <span className={`${checkUpgrade ? 'line-through text-[#808890]' : 'pr-[2px]'}`}>{state.r_claim}</span>{' '}
                                    <span className={`${checkUpgrade ? 'text-[#52CC74] font-semibold' : 'hidden'}`}>
                                        {(state.q_claim + (state.q_claim * 5) / 100) / state.margin}
                                    </span>{' '}
                                    %
                                </div>
                            </div>
                            <div className="flex flex-row justify-between py-[8px] px-[8px]">
                                <div className={'text-[#808890]'}>Q-Claim</div>
                                <div className={'font-semibold flex flex-row hover:cursor-pointer'}>
                                    <span className={`${checkUpgrade ? 'line-through text-[#808890] pr-[2px]' : 'pr-[2px]'}`}>{state.q_claim}</span>{' '}
                                    <span className={`${checkUpgrade ? 'text-[#52CC74] font-semibold pr-[2px]' : 'hidden'}`}>
                                        {state.q_claim + (state.q_claim * 5) / 100}
                                    </span>{' '}
                                    <span className={'text-[#EB2B3E]'}>USDT</span>
                                </div>
                            </div>
                            <div className="flex flex-row justify-between py-[8px] px-[8px] bg-[#F7F8FA]">
                                <div className={'text-[#808890]'}>Margin</div>
                                <div className={'font-semibold flex flex-row hover:cursor-pointer'}>
                                    <span className={'pr-[2px]'}>{state.margin}</span> <span className={'text-[#EB2B3E]'}>USDT</span>
                                </div>
                            </div>
                            <div className="flex flex-row justify-between py-[8px] px-[8px]">
                                <div className={'text-[#808890]'}>Period</div>
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
                            {!isUpdated && (
                                <div className="text-[#EB2B3E] bg-[#F7F8FA] rounded-[12px] mb-[24px] w-full flex flex-row justify-between items-center px-[18px]">
                                    <div className={'flex flex-row py-[14px]'}>
                                        <span className="">
                                            <ErrorCircleIcon />
                                        </span>
                                        <span className=""> {t('insurance:buy:price_had_update')}</span>
                                    </div>
                                    <div>
                                        <Button
                                            variants="outlined"
                                            className="py-[8px] px-[24px] rounded-[8px]"
                                            onClick={() => {
                                                console.log(state.symbol)
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
                                            <label htmlFor="test1" className="select-none text-[#22313F] font-medium">
                                                {t('insurance:buy:upgrade')}
                                            </label>
                                        </div>
                                    </div>
                                    <span className="select-none text-[#22313F] font-medium">{t('insurance:buy:upgrade_info')}</span>
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
            </div>

            <div className={'flex flex-col justify-center items-center my-[48px]'}>
                <Button
                    variants={'primary'}
                    className={`${
                        !isCanBuy ? 'bg-[#E5E7E8]' : 'bg-[#EB2B3E]'
                    }  h-[48px] w-[374px] flex justify-center items-center text-white rounded-[8px] py-[12px]`}
                    onClick={() => {
                        createContract()
                    }}
                    disable={!isCanBuy}
                >
                    {t('insurance:buy:accept')}
                </Button>
                <span>
                    {t('insurance:buy:Term_of_Service')} <span className={`${language == 'en' ? '' : 'hidden'}`}>{t('insurance:buy:Term_of_Service_of')}</span>
                    <span
                        className={'my-[16px] text-[#00ABF9] underline hover:cursor-pointer'}
                        onClick={() => {
                            router.push('https://nami.today/bao-hiem-trong-crypto-manh-dat-mau-mo-can-duoc-khai-pha/')
                        }}
                    >
                        {t('insurance:buy:Term_of_Service_sub')}
                    </span>
                    <span className={`${language == 'vi' ? '' : 'hidden'}`}>{t('insurance:buy:Term_of_Service_of')}</span>
                </span>
            </div>
        </>
    ) : (
        <div className="relative">
            <NotificationInsurance id="" name={'success'} state={state} active={active} setActive={setActive} isMobile={true} />
            <div className="relative flex flex-col w-full">
                <div className="relative bg-white w-full mx-[24px]" style={{ borderRadius: '5px 5px 0 0' }}>
                    <div className={'flex flex-col w-[100%] mt-[24px] items-center'}>
                        <div className={'font-semibold text-xl'}>
                            <span>{t('insurance:buy:info_covered')}</span>
                        </div>
                        <div className="flex flex-row">
                            <span className={'font-semibold text-[#22313F]'}>
                                {`${t('insurance:buy:saved')} `}
                                <span className={'text-[#EB2B3E] px-[4px]'}>1,000 USDT</span> {t('insurance:buy:sub_saved')}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-[white] my-[24px]">
                    <div className="mx-[24px]">
                        <div className="flex flex-row justify-between py-[8px] px-[8px] bg-[#F7F8FA]">
                            <div className={'text-[#808890]'}>R-Claim</div>
                            <div className={'font-semibold'}>
                                <span className={`${checkUpgrade ? 'line-through text-[#808890]' : 'pr-[2px]'}`}>{state.r_claim}</span>{' '}
                                <span className={`${checkUpgrade ? 'text-[#52CC74] font-semibold' : 'hidden'}`}>
                                    {(state.q_claim + (state.q_claim * 5) / 100) / state.margin}
                                </span>{' '}
                                %
                            </div>
                        </div>
                        <div className="flex flex-row justify-between py-[8px] px-[8px]">
                            <div className={'text-[#808890]'}>Q-Claim</div>
                            <div className={'font-semibold flex flex-row hover:cursor-pointer'}>
                                <span className={`${checkUpgrade ? 'line-through text-[#808890] pr-[2px]' : 'pr-[2px]'}`}>{state.q_claim}</span>{' '}
                                <span className={`${checkUpgrade ? 'text-[#52CC74] font-semibold pr-[2px]' : 'hidden'}`}>
                                    {state.q_claim + (state.q_claim * 5) / 100}
                                </span>{' '}
                                <span className={'text-[#EB2B3E]'}>USDT</span>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between py-[8px] px-[8px] bg-[#F7F8FA]">
                            <div className={'text-[#808890]'}>Margin</div>
                            <div className={'font-semibold flex flex-row hover:cursor-pointer'}>
                                <span className={'pr-[2px]'}>{state.margin}</span> <span className={'text-[#EB2B3E]'}>USDT</span>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between py-[8px] px-[8px]">
                            <div className={'text-[#808890]'}>Period</div>
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
                        {!isUpdated && (
                            <div className="text-[#EB2B3E] bg-[#F7F8FA] rounded-[12px] mb-[24px] w-full flex flex-row justify-between items-center px-[18px]">
                                <div className={'flex flex-row py-[14px]'}>
                                    <span className="">
                                        <ErrorCircleIcon />
                                    </span>
                                    <span className=""> {t('insurance:buy:price_had_update')}</span>
                                </div>
                                <div>
                                    <Button
                                        variants="outlined"
                                        className="py-[8px] px-[24px] rounded-[8px]"
                                        onClick={() => {
                                            console.log(state.symbol)
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
                                        <label htmlFor="test1" className="select-none text-[#22313F] font-medium">
                                            {t('insurance:buy:upgrade')}
                                        </label>
                                    </div>
                                </div>
                                <span className="select-none text-[#22313F] font-medium">{t('insurance:buy:upgrade_info')}</span>
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

            <div className={'flex flex-col justify-center items-center mt-[89px] mx-[24px]'}>
                <span className="text-center pb-[16px]">
                    {t('insurance:buy:Term_of_Service')}{' '}
                    <span
                        className={'my-[16px] text-[#00ABF9] underline hover:cursor-pointer'}
                        onClick={() => {
                            router.push('https://nami.today/bao-hiem-trong-crypto-manh-dat-mau-mo-can-duoc-khai-pha/')
                        }}
                    >
                        {t('insurance:buy:Term_of_Service_sub')}
                    </span>
                </span>
                <Button
                    variants={'primary'}
                    className={`${
                        !isCanBuy ? 'bg-[#E5E7E8]' : 'bg-[#EB2B3E]'
                    }  h-[48px] w-[374px] flex justify-center items-center text-white rounded-[8px] py-[12px]`}
                    onClick={() => {
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
