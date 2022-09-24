import { useTranslation } from 'next-i18next'
import React, { useState } from 'react'
import { isMobile } from 'react-device-detect'
import styled from 'styled-components'
import Button from 'components/common/Button/Button'
import InputField, { ErrorSectionNote } from 'components/common/Input/InputField'
import Modal from 'components/common/Modal/Modal'
import Config from 'config/config'
import { API_GET_INFO_USER, API_UPDATE_USER_INFO } from 'services/apis'
import fetchApi from 'services/fetch-api'
import colors from 'styles/colors'
import useWeb3Wallet from 'hooks/useWeb3Wallet';

interface EmailSubModal {
    visible: boolean
    onClose: () => void
}

const isValidEmail = (email: any) =>
    !!String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        )

const EmailSubscriptionModal = ({ visible, onClose }: EmailSubModal) => {
    const { t } = useTranslation()
    const [email, setEmail] = useState('')
    const [ableSubmit, setAbleSubmit] = useState(false)
    const { account, chain } = useWeb3Wallet()

    console.log('account-----', account)

    const handleChange = (name: string, event: any) => {
        setEmail(event.target.value)
        if (validator(name).isValid) {
            setAbleSubmit(true)
        } else setAbleSubmit(false)
    }

    const validator = (key: string) => {
        const rs = { isValid: true, message: '' }
        switch (key) {
            case 'email':
                rs.isValid = isValidEmail(email)
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
                Config.toast.show('success', t('home:landing:email_update_success'))
                onClose()
            }
        } catch (e) {
            Config.toast.show('error', t('home:landing:email_invalid'), {
                position: 'top-right',
            })
        }
    }

    // Config.toast.show('error', t('home:landing:email_invalid'), {
    //     position:"top-right"
    // })

    return (
        <Modal
            isMobile={isMobile}
            isVisible={visible}
            onBackdropCb={onClose}
            wrapClassName="!p-6"
            className={'lg:max-w-[524px]'}
            containerClassName="z-[9999999]"
        >
            <div className="flex flex-col justify-center items-center pb-5 text-xl font-medium">
                <img src="/images/email.png" className="w-[80px] h-[80px]" />
                <div className="text-center pt-6 text-xl">
                    {t('common:modal:email_subscription:update_email')}
                    <div className="text-center text-sm md:text-base text-txtSecondary pt-2">{t('common:modal:email_subscription:description')}</div>
                </div>
            </div>
            {/* <div className="text-xl font-medium mb-6 sm:mb-8 sm:text-center">{t('common:modal:dont_show_later')}</div> */}
            <ErrorSectionNote content={t('common:modal:email_subscription:ignore_description')} />
            <InputField
                id={'email'}
                key={'email'}
                label={t('common:email')}
                // value={'email' && 'email'}
                onChange={(e: any) => handleChange('email', e)}
                validator={validator('email')}
                value={email}
                placeholder={`${t('insurance:final:label_email')}`}
            />
            {/* <div className="flex flex-col text-sm divide-solid divide-y divide-divider overflow-auto -mx-6 px-6"> */}
            <div className="flex flex-col text-sm overflow-auto -mx-6 px-6 mt-8 ">
                <div className="flex justify-center items-center text-base">
                    <Button
                        variants={'primary'}
                        className={`!w-full h-[48px] !w-[374px] flex justify-center items-center text-white rounded-[8px]`}
                        onClick={() => {
                            updateEmail()
                        }}
                        disable={!email || !ableSubmit}
                    >
                        {t('common:update')}
                    </Button>
                </div>
                <div onClick={onClose} className={'text-center text-red text-base underline mt-4 font-semibold'}>
                    Bỏ qua, tôi sẽ cập nhật sau!
                </div>
            </div>
        </Modal>
    )
}

export default EmailSubscriptionModal
