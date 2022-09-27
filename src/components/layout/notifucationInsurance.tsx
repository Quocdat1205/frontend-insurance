import Button from 'components/common/Button/Button'
import { Input } from 'components/common/Input/input'
import { SuccessIcon } from 'components/common/Svg/SvgIcon'
import Config from 'config/config'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { API_SUBSCRIBE } from 'services/apis'
import fetchApi from 'services/fetch-api'
import styled from 'styled-components'
import { formatNumber } from 'utils/utils'

export type iProps = {
    id: string
    name: 'success' | 'expired' | 'expired1' | 'email' | 'loading' | string
    state: any
    active: boolean
    setActive: any
    isMobile: boolean
}

const NotificationInsurance = ({ id, name, state, active, setActive, isMobile }: iProps) => {
    const { t } = useTranslation()
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [clear, setClear] = useState(false)

    const noti = [
        {
            name: 'success',
            icon: <SuccessIcon />,
            description: `${t('insurance:final:succes')}`,
        },
        {
            name: 'expired',
            icon: <img src="/images/insurance/expired.png" className="w-[100px] h-[100px]" />,
            description: `${t('insurance:final:contract')}`,
            sub_Description: `${t('insurance:final:contract_sub')}`,
            reason: `${t('insurance:final:reasons')}`,
        },
        {
            name: 'expired1',
            icon: <img src="/images/insurance/calendar.png" className="w-[100px] h-[100px]" />,
            description: `${t('insurance:final:contract')}`,
            sub_Description: `${t('insurance:final:contract_sub')}`,
            reason: `${t('insurance:final:reasons1')}`,
        },
        {
            name: 'email',
            icon: <img src="/images/icons/ic_gmail.png" className="w-[100px] h-[100px]" />,
            description: `${t('insurance:final:get_noti')}`,
            reason: `${t('insurance:final:input_email')}`,
        },
        {
            name: 'loading',
            icon: (
                <div className="flex flex-col space-y-6 justify-center items-center">
                    <Loading>
                        <div className="bg-white w-[calc(5rem-30px)] h-[calc(5rem-30px)] sm:w-[calc(7rem-40px)] sm:h-[calc(7rem-40px)] flex items-center justify-center rounded-full" />
                    </Loading>
                </div>
            ),
            description: `${t('insurance:final:loading')}`,
            reason: ``,
        },
    ]

    const handleAPISubscribe = (email: string) => {
        fetchApi({ url: API_SUBSCRIBE, options: { method: 'POST' }, params: { email: email } }).then((res) => {
            if (res.statusCode == 201) {
                Config.toast.show('success', 'Successful')
                setActive(false)
            }
        })
    }

    useEffect(() => {
        const checkEmail = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/

        if (checkEmail.test(email)) {
            setClear(true)
        }
        if (!checkEmail.test(email)) {
            setClear(false)
        }
    }, [email])

    const handleClick = (index: number) => {
        if (index == 0) {
            return router.push('/insurance-history')
        }
        if (index == 3) {
            return handleAPISubscribe(email)
        }
        if (index != 0 && index != 3) {
            return router.push('/insurance-history')
        }
    }

    return active ? (
        isMobile ? (
            <>
                <div className="w-full absolute z-50 bg-gray/[0.25] flex flex-col-reverse">
                    {noti.map((item, index) => {
                        if (item.name === name) {
                            return (
                                <div key={index} className={`${index != 3 && 'divide-[#E5E7E8] divide-y '} bg-white text-sm  w-full mx-auto `}>
                                    <div className="flex flex-col justify-center items-center mb-[24px] text-xl font-medium">
                                        {noti[index].icon}
                                        <div className="text-center w-[70%] pt-[24px]">
                                            {noti[index].description}{' '}
                                            <span className="text-[#EB2B3E]">{name != 'success' && name != 'email' && name != 'loading' ? id : ''}</span>{' '}
                                            {noti[index].sub_Description}
                                            {noti[index].reason && <div className="text-center text-[#808890]">{noti[index].reason}</div>}
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center mx-[24px] ">
                                        {index < 3 && (
                                            <>
                                                <div className="flex flex-row justify-between pb-[0.5rem] text-base">
                                                    <div className={'text-[#808890]'}>Q-Claim</div>
                                                    <div className={'font-semibold flex flex-row hover:cursor-pointer'}>
                                                        <span className="mr-[8px]">{Number(formatNumber(state?.q_claim, 2))}</span>
                                                        <span className={''}>USDT</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row justify-between pt-[0.5rem]">
                                                    <div className={'text-[#808890]'}>R-Claim</div>
                                                    <div className={'font-semibold'}>
                                                        <span className="mr-[8px]">{Number(formatNumber(state?.r_claim, 2))}</span>
                                                        <span>%</span>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        {index == 3 && (
                                            <>
                                                <div className={'text-base'}>
                                                    <span className="pb-[8px]">Email</span>
                                                    <Input
                                                        className={'w-full bg-[#F7F8FA] py-[12px] px-[16px]'}
                                                        type={'email'}
                                                        inputName={'Loại tài sản và số lượng tài sản'}
                                                        idInput={''}
                                                        value={email && email}
                                                        onChange={(e: any) => {
                                                            setEmail(e.target.value)
                                                        }}
                                                        placeholder={`${t('insurance:final:label_email')}`}
                                                    />
                                                    <div className="py-[16px] flex  items-center">
                                                        <input type="checkbox" className="w-[24px] h-[24px] mr-[8px]" />
                                                        {t('insurance:final:hidden_noti')}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        {name !== 'loading' && (
                                            <div className={`flex justify-center items-center text-base`}>
                                                <Button
                                                    variants={'primary'}
                                                    className={`${
                                                        !clear && index == 3 ? 'bg-[#E5E7E8]' : 'bg-[#EB2B3E]'
                                                    } h-[48px] !w-[374px] flex justify-center items-center text-white rounded-[8px] py-[12px]`}
                                                    onClick={() => {
                                                        handleClick(index)
                                                    }}
                                                    disabled={!clear && index == 3}
                                                >
                                                    {index == 0
                                                        ? `${t('insurance:final:complete')}`
                                                        : index == 3
                                                        ? `${t('insurance:final:confirm_email')}`
                                                        : `${t('insurance:final:buy_again')}`}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        }
                    })}
                </div>
            </>
        ) : (
            <>
                <div className="z-50 flex flex-col-reverse ">
                    {noti.map((item, index) => {
                        if (item.name === name) {
                            return (
                                <div key={index} className={` bg-white text-sm w-full mx-auto `}>
                                    <div className="flex flex-col justify-center items-center my-[24px]  text-xl font-medium">
                                        {noti[index].icon}
                                        <div className="text-center pt-[24px]">
                                            {noti[index].description}{' '}
                                            <span className="text-[#EB2B3E]">{name != 'success' && name != 'email' && name != 'loading' ? id : ''}</span>{' '}
                                            {noti[index].sub_Description}
                                            {noti[index].reason && <div className="text-center text-[#808890]">{noti[index].reason}</div>}
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center mx-[24px] border-t border-1 border-[#E5E7E8]">
                                        {index < 3 && (
                                            <>
                                                <div className="flex flex-row justify-between pt-[1rem] pb-[0.5rem] px-[0.5rem] font-base">
                                                    <div className={'text-[#808890]'}>Q-Claim</div>
                                                    <div className={'font-semibold flex flex-row hover:cursor-pointer'}>
                                                        <span className="mr-[8px]">{Number(formatNumber(state?.q_claim, 2))}</span>
                                                        <span className={''}>USDT</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row justify-between  pb-[1rem] px-[0.5rem] ">
                                                    <div className={'text-[#808890]'}>R-Claim</div>
                                                    <div className={'font-semibold'}>
                                                        <span className="mr-[8px]">{Number(formatNumber(state?.r_claim, 2))}</span>
                                                        <span>%</span>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        {index == 3 && (
                                            <>
                                                <div className={''}>
                                                    <span className="pb-[8px]">Email</span>
                                                    <Input
                                                        className={'w-full bg-[#F7F8FA] py-[12px] px-[16px]'}
                                                        type={'email'}
                                                        inputName={'Loại tài sản và số lượng tài sản'}
                                                        idInput={''}
                                                        value={email && email}
                                                        onChange={(e: any) => {
                                                            setEmail(e.target.value)
                                                        }}
                                                        placeholder={`${t('insurance:final:label_email')}`}
                                                    />
                                                    <div className="py-[16px] flex  items-center">
                                                        <input type="checkbox" className="w-[24px] h-[24px] mr-[8px]" />
                                                        {t('insurance:final:hidden_noti')}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        {name != 'loading' && (
                                            <div className="flex justify-center items-center text-base">
                                                <Button
                                                    variants={'primary'}
                                                    className={`${
                                                        !clear && index == 3 ? 'bg-[#E5E7E8]' : 'bg-[#EB2B3E]'
                                                    }  h-[48px] !w-[374px] flex justify-center items-center text-white rounded-[8px] py-[12px]`}
                                                    onClick={() => {
                                                        handleClick(index)
                                                    }}
                                                    disabled={!clear && index == 3}
                                                >
                                                    {index == 0
                                                        ? `${t('insurance:final:complete')}`
                                                        : index == 3
                                                        ? `${t('insurance:final:confirm_email')}`
                                                        : `${t('insurance:final:buy_again')}`}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        }
                    })}
                </div>
            </>
        )
    ) : (
        <></>
    )
}

const Loading = styled.div.attrs({
    className:
        'gradient-spin after:!w-[15px] after:!h-[15px] sm:after:!w-5 sm:after:!h-5 w-[5rem] h-[5rem] sm:w-[7rem] sm:h-[7rem] animate-spin-reverse flex items-center justify-center rounded-full relative',
})`
    &:after {
        content: '';
        position: absolute;
        background: #eb2b3e;
        width: 20px;
        height: 20px;
        bottom: 0;
        border-radius: 50%;
    }
`

export default NotificationInsurance
