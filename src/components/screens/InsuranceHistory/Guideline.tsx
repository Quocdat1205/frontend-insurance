import { useTranslation } from 'next-i18next'
import React, { useMemo, useRef } from 'react'
import colors from 'styles/colors'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import Tour from 'reactour'
import styled from 'styled-components'
import { X } from 'react-feather'

interface Guideline {
    start: boolean
    setStart: (e: boolean) => void
}
const Guideline = ({ start, setStart }: Guideline) => {
    const { t } = useTranslation()
    const step = useRef<number>(0)
    const refGuide = useRef<any>(null)

    const getCurrentStep = (e: number) => {
        step.current = e
    }

    const tourConfig: any = useMemo(() => {
        return [
            {
                selector: '[data-tut="statistics"]',
                content: (props: any) => <Content {...props} top onClose={onClose} />,
                position: 'bottom',
            },
        ]
    }, [])

    const onClose = (e: any) => {
        if (!e) {
            if (refGuide.current.state.current === tourConfig.length - 1) {
                setStart(false)
            } else {
                refGuide.current.nextStep()
            }
        } else {
            setStart(false)
        }
    }

    return (
        <Tour
            onRequestClose={() => onClose(false)}
            steps={tourConfig}
            isOpen={start}
            showCloseButton={false}
            maskClassName="guideline"
            rounded={6}
            startAt={0}
            maskSpace={2}
            disableInteraction
            disableKeyboardNavigation
            // accentColor={colors.red.red}
            getCurrentStep={getCurrentStep}
            showNavigation={false}
            showButtons={false}
            showNumber={false}
            scrollDuration={300}
            ref={refGuide}
            onAfterOpen={disableBodyScroll}
            onBeforeClose={enableBodyScroll}
            // inViewThreshold={100}
        />
    )
}

const Content = ({ title, text, step, onClose, top, goTo, ...props }: any) => {
    const { t } = useTranslation()
    return (
        <div className="flex flex-col items-center font-inter justify-center" onClick={() => onClose(false)}>
            <div className="relative">
                <View id={`guideline-step-${step}`}>
                    <div className="flex items-center justify-between">
                        <label className="text-onus-base font-semibold text-sm">{t(`futures:mobile:guide:step_title_${step}`)}</label>
                        <div className="cursor-pointer text-white" onClick={() => onClose(true)}>
                            <X width={20} />
                        </div>
                    </div>
                    <div className="mt-[8px] mb-[16px] text-onus-white text-xs">{t(`futures:mobile:guide:step_${step}`)}</div>
                    <div className="flex items-center justify-between font-medium text-white">
                        <div className="text-sm text-onus-white">
                            {t('futures:mobile:guide:step')} {step + '/'}
                            <span className="text-[10px]">8</span>
                        </div>
                    </div>
                </View>
                <div
                    className="absolute bottom-6 right-4 min-w-[60px] px-[10px] bg-onus-base rounded-[4.33333px] text-center text-[10px] text-onus-white"
                    onClick={() => step === 8 && onClose(true)}
                >
                    {t(step === 8 ? 'common:close' : 'futures:mobile:guide:next')}
                </div>
            </div>
        </div>
    )
}

const View = styled.div.attrs({
    className: 'my-[10px] bg-onus-bgModal3 font-inter flex flex-col justify-between',
})`
    width: 294px;
    ${'' /* background-color:${colors.darkBlue1}; */}
    opacity: 0.8;
    border-radius: 8px;
    padding: 16px;
`

export default Guideline
