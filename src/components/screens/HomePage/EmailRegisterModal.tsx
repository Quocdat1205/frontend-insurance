import { useTranslation } from 'next-i18next'
import React, { useState } from 'react'
import { isMobile } from 'react-device-detect'
import Button from 'components/common/Button/Button'
import InputField, { ErrorSectionNote } from 'components/common/Input/InputField'
import CircleSpinner from 'components/common/Loader/CircleSpinner'
import Modal from 'components/common/Modal/Modal'
import Config from 'config/config'
import useWeb3Wallet from 'hooks/useWeb3Wallet'
import { API_UPDATE_USER_INFO } from 'services/apis'
import fetchApi from 'services/fetch-api'
import { setModalSubscribeStorage } from 'utils/utils'

interface EmailRegisterModal {
    visible: boolean
    onClose: () => void
}

const isValidEmail = (email: any) =>
    !!String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        )

const EmailSubscriptionModal = ({ visible, onClose }: EmailRegisterModal) => {
    const { t } = useTranslation()
    const [email, setEmail] = useState('')
    const [ableSubmit, setAbleSubmit] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { account, chain } = useWeb3Wallet()

    const handleChange = (name: string, event: any) => {
        setEmail(event.target.value)
        if (validator(name, event.target.value).isValid) {
            setAbleSubmit(true)
        } else setAbleSubmit(false)
    }

    const handlePaste = (name: string, event: any) => {
        event.preventDefault()
        const pastedValue = event.clipboardData.getData('text')
        setEmail(pastedValue)
        if (validator(name, pastedValue).isValid) {
            setAbleSubmit(true)
        } else setAbleSubmit(false)
    }

    const validator = (key: string, value?: '') => {
        const rs = { isValid: true, message: '' }
        switch (key) {
            case 'email':
                rs.isValid = isValidEmail(value || email)
                rs.message = t('common:modal:error_format_email')
                break
            default:
                break
        }
        return rs
    }

    //
    const updateEmail = async () => {
        try {
            setIsLoading(true)
            const { data, error, message } = await fetchApi({
                url: API_UPDATE_USER_INFO,
                options: {
                    method: 'PUT',
                },
                params: {
                    owner: account,
                    email,
                },
            })
            if (error) {
                Config.toast.show('error', message[0])
            }
            if (data) {
                // update local storage
                setModalSubscribeStorage(Config.MODAL_REGISTER_EMAIL, 'true')
                Config.toast.show('success', t('common:modal:success_update_email'))
                onClose()
            }
        } catch (e) {
            Config.toast.show('error', t('home:landing:email_invalid'), {
                position: 'top-right',
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleOnClose = () => {
        setModalSubscribeStorage(Config.MODAL_REGISTER_EMAIL, 'true')
        onClose()
    }

    return (
        <Modal
            isMobile={isMobile}
            isVisible={visible}
            onBackdropCb={handleOnClose}
            wrapClassName="!p-6"
            className={'lg:max-w-[524px]'}
            containerClassName="z-[9999999]"
        >
            <div className="flex flex-col items-center justify-center pb-5 text-xl font-medium">
                <img src="/images/icons/ic_gmail.png" className="w-[80px] h-[80px]" />
                <div className="pt-6 text-xl text-center">
                    {t('common:modal:email_subscription:update_email')}
                    <div className="pt-2 text-sm text-center md:text-base text-txtSecondary">{t('common:modal:email_subscription:description')}</div>
                </div>
            </div>
            <ErrorSectionNote content={t('common:modal:email_subscription:ignore_description')} />
            <InputField
                id={'email'}
                key={'email'}
                label={t('common:email')}
                onChange={(e: any) => handleChange('email', e)}
                onPaste={(e: any) => handlePaste('email', e)}
                validator={validator('email')}
                value={email || ''}
                placeholder={`${t('common:modal:label_email')}`}
            />
            <div className="flex flex-col px-6 mt-8 -mx-6 overflow-auto text-sm ">
                <div className="flex items-center justify-center text-base">
                    <Button
                        variants={'primary'}
                        className={`h-[48px] !w-[374px] flex justify-center items-center text-white rounded-[8px]`}
                        onClick={() => {
                            if (isLoading) return
                            if (!email || !ableSubmit) return
                            updateEmail()
                        }}
                        disabled={!email || !ableSubmit}
                    >
                        {isLoading && <CircleSpinner />}
                        {t('common:update')}
                    </Button>
                </div>
                <div onClick={onClose} className={'text-center cursor-pointer text-red text-base underline mt-4 font-semibold'}>
                    {t('common:modal:email_subscription:subscribe_later')}
                </div>
            </div>
        </Modal>
    )
}

export default EmailSubscriptionModal
