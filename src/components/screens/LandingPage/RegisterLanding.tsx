// import useDebounce from 'hooks/useDebounce'
import React, { useState, useEffect } from 'react'
import { API_REGISTER_NOTIFICATON } from 'services/apis'
import fetchApi from 'services/fetch-api'
import styled from 'styled-components'
import Config from 'config/config'
import Button from 'components/common/Button/Button'
import useWindowSize from 'hooks/useWindowSize'
import Modal from 'components/common/Modal/Modal'
import { X } from 'react-feather'
import { useTranslation } from 'next-i18next'
import throttle from 'lodash/throttle'

const RegisterLanding = () => {
    const { t } = useTranslation()
    const { width } = useWindowSize()
    const isMobile = width && width < 640
    const [visible, setVisible] = useState<boolean>(false)
    const [email, setEmail] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const onRegister = throttle(async () => {
        if (!email || loading) return
        const regex = Config.pattern('email')
        if (!regex.test(email)) {
            Config.toast.show('error', t('home:landing:email_invalid'))
            return
        }
        setLoading(true)
        try {
            const { data, message } = await fetchApi({
                url: API_REGISTER_NOTIFICATON,
                options: { method: 'POST' },
                params: { email },
            })
            if (data) {
                setVisible(true)
            } else {
                Config.toast.show('error', t(`errors:${message}`))
            }
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }, 3000)

    return (
        <section className="px-4 mb:px-10 lg:px-20">
            <SuccessModal isVisible={visible} onClose={() => setVisible(false)} t={t} />
            <div className="max-w-[1062px] m-auto register-landing flex items-center justify-center pt-20 sm:pt-[10.5rem]">
                <Background isMobile={isMobile}>
                    <div className="font-semibold text-2xl sm:text-5xl leading-8 sm:leading-10 mb-2 text-red">{t('home:landing:stay_up_to_date')}</div>
                    <div className="text-center sm:text-left px-5 sm:px-0 text-sm sm:text-base">{t('home:landing:stay_up_to_date_content')}</div>
                    <div className="mt-8 sm:mt-6 px-3 py-2 bg-white rounded-[3px] border border-red flex items-center">
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('home:landing:enter_your_email')}
                            className="no-border sm:w-[419px] leading-[20px]"
                        />
                        <Button onClick={onRegister} className="!font-medium px-6 py-2 text-sm whitespace-nowrap">
                            {t('home:landing:subscribe')}
                        </Button>
                    </div>
                </Background>
            </div>
        </section>
    )
}

const SuccessModal = ({ isVisible, onClose, t }: any) => {
    return (
        <Modal
            portalId="modal"
            isVisible={isVisible}
            onBackdropCb={onClose}
            className="rounded-xl bg-white max-w-[424px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
            <div className="text-center flex flex-col items-center mb-6">
                <img width={80} height={80} src="/images/icons/ic_gmail.png" />
                <div className="mt-6 text-xl font-medium ">{t('home:landing:register_successfully')}</div>
                <span className="text-txtSecondary mt-2 px-4">{t('home:landing:register_content')}</span>
            </div>
        </Modal>
    )
}

const Background = styled.div.attrs({
    className: 'w-full sm:max-w-[1062px] pt-8 pb-12 px-4 sm:py-[4.25rem] sm:w-[1062px] flex flex-col items-center justify-center',
})<any>`
    background-image: ${({ isMobile }) => `url(${`/images/screens/landing-page/bg_register${isMobile ? '_mobile' : ''}.png`})`};
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 12px;
`

export default RegisterLanding
