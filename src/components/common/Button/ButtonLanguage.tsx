import React from 'react'
import styled from 'styled-components'
import useLanguage, { LANGUAGE_TAG } from 'hooks/useLanguage'
import { useTranslation } from 'next-i18next'
import colors from 'styles/colors'
import classnames from 'classnames'

interface Language {
    active?: boolean
    onClick?: () => void
    onChangeLang?: () => void
    mobile?: boolean
    className?: string
}

const ButtonLanguage = ({ mobile = false, className }: Language) => {
    const { onChangeLang }: Language = useLanguage()
    const {
        t,
        i18n: { language },
    } = useTranslation()
    return (
        <div className={`${className} border border-red rounded-[3px] w-max`}>
            <div className="flex items-center space-x-1 bg-white-3 px-1 py-[3px] rounded-[3px]">
                <Language mobile={mobile} active={language === LANGUAGE_TAG.VI} onClick={() => language !== LANGUAGE_TAG.VI && onChangeLang()}>
                    VI
                </Language>
                <Language mobile={mobile} active={language === LANGUAGE_TAG.EN} onClick={() => language !== LANGUAGE_TAG.EN && onChangeLang()}>
                    EN
                </Language>
            </div>
        </div>
    )
}
const bg = `linear-gradient(
    88.09deg,
    #ce0014 0.48%,
    #e92828 52.94%,
    #ff5f6d 114.93%
)`
const Language = styled.div.attrs<any>(({ mobile, active }) => ({
    className: classnames('rounded text-sm px-2 py-1 leading-5 cursor-pointer', { '': active }),
}))`
    background: ${({ active }: Language) => (active ? bg : '')};
    color: ${({ active }: Language) => (active ? colors.white.white : '')};
`

export default ButtonLanguage
