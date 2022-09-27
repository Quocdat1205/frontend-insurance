import { useTranslation } from 'next-i18next'
import React, { useState } from 'react'
import { isMobile } from 'react-device-detect'
import styled from 'styled-components'
import Button from 'components/common/Button/Button'
import InputField from 'components/common/Input/InputField'
import Modal from 'components/common/Modal/Modal'

interface ContactModal {
    visible: boolean
    onClose: () => void
}

const Success = () => {
    const {
        t,
        i18n: { language },
    } = useTranslation()
    return (
        <>
            <div className="flex flex-col items-center justify-center pb-4 text-xl font-medium">
                <img src="/images/success.png" className="w-[80px] h-[80px]" />
                <div className="pt-6 text-xl text-center">
                    {t('common:modal:contact:send_success_title')}
                    <div className="pt-2 text-sm text-center md:text-base text-txtSecondary">{t('common:modal:contact:send_success_desc')}</div>
                </div>
            </div>
        </>
    )
}

const isValidEmail = (email: any) =>
    !!String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        )

const isNotEmptyString = (str: any) => !!String(str).trim()

const ContactModal = ({ visible, onClose }: ContactModal) => {
    const { t } = useTranslation()
    const [reqDetail, setReqDetail] = useState({
        email: '',
        request: '',
    })

    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (name: string, event: any) => {
        setReqDetail({ ...reqDetail, [name]: event.target.value })
    }

    const validator = (key: string) => {
        const rs = { isValid: false, message: '' }
        switch (key) {
            case 'email':
                rs.isValid = isValidEmail(reqDetail?.email)
                rs.message = t('common:modal:error_format_email')
                break
            case 'request':
                rs.isValid = !isNotEmptyString(reqDetail?.request)
                break
            // rs.message = t('common:modal:contact:title')
            default:
                return rs
                break
        }
        return rs
    }

    const handleSubscribe = () => {
        setIsLoading(true)
    }

    return (
        <Modal
            isMobile={isMobile}
            isVisible={visible}
            onBackdropCb={onClose}
            wrapClassName="!p-6"
            className={'lg:max-w-[600px]'}
            containerClassName="z-[9999999]"
        >
            {/* <Success/> */}
            <div className="flex flex-col items-center justify-center pt-6 text-xl font-medium md:pt-2">
                <img src="/images/email.png" className="w-[80px] h-[80px]" />
                <div className="pt-6 text-xl text-center">
                    {t('common:modal:contact:title')}
                    <div className="pt-2 text-sm text-center md:text-base text-txtSecondary">{t('common:modal:contact:description')}</div>
                </div>
            </div>
            {/* <div className="mb-6 text-xl font-medium sm:mb-8 sm:text-center">{t('common:modal:dont_show_later')}</div> */}
            {/* <ErrorSectionNote content={t('common:modal:email_subscription:ignore_description')} /> */}

            <InputField
                id={'email'}
                key={'email'}
                label={t('common:email')}
                value={reqDetail?.email || ''}
                onChange={(e: any) => handleChange('email', e)}
                validator={validator('email')}
                placeholder={`${t('common:modal:email_placeholder')}`}
            />

            <InputField
                isTextArea
                id={'request'}
                key={'request'}
                label={t('common:modal:contact:request')}
                value={reqDetail?.request || ''}
                onChange={(e: any) => handleChange('request', e)}
                validator={validator('request')}
                placeholder={`${t('common:modal:contact:request_placeholder')}`}
            />
            {/* <div className="flex flex-col px-6 -mx-6 overflow-auto text-sm divide-y divide-solid divide-divider"> */}
            <div className="flex flex-col px-6 -mx-6 overflow-auto text-sm">
                <div className="flex items-center justify-center text-base">
                    <Button
                        variants={'primary'}
                        className={`h-[48px] !w-[374px] flex justify-center items-center text-white rounded-[8px] py-[12px]`}
                        onClick={
                            handleSubscribe
                            // if (3 === 3) {
                            //     // return handleAPISubscribe(email)
                            // }
                            // if (index != 0 && index != 3) {
                            //     return router.push('/buy-covered/insurance-history')
                            // }
                        }
                        disabled={!reqDetail?.request || !reqDetail?.email || !validator('email')?.isValid}
                    >
                        <div className="flex items-center">
                            <div className="inline-block w-8 h-8 m-12 border-4 rounded-full spinner-border animate-spin" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                        <svg
                            aria-hidden="true"
                            class="mr-2 w-8 h-8 text-blue text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                            ></path>
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                            ></path>
                        </svg>

                        {isLoading ? (
                            <>
                                {/* <Loading>
                                    <div className="bg-white w-[calc(5rem-30px)] h-[calc(5rem-30px)] sm:w-[calc(7rem-40px)] sm:h-[calc(7rem-40px)] flex items-center justify-center rounded-full" />
                                </Loading> */}
                                {t('common:modal:contact:sending_request')}
                            </>
                        ) : (
                            t('common:modal:contact:send_request')
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

const Loading = styled.div.attrs({
    className:
        'animate-spin after:!w-[15px] after:!h-[15px] sm:after:!w-5 sm:after:!h-5 w-[5rem] h-[5rem] sm:w-[7rem] sm:h-[7rem] animate-spin-reverse flex items-center justify-center rounded-full relative',
})`
    &:after {
        content: '';
        position: absolute;
        background: #fff;
        width: 10px;
        height: 10px;
        bottom: 0;
        border-radius: 50%;
    }
`

export default ContactModal
