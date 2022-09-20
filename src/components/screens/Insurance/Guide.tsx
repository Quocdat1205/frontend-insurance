import { useTranslation } from 'next-i18next'
import { useEffect, useMemo, useRef, useState } from 'react'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import styled from 'styled-components'
import { X } from 'react-feather'
import { LeftArrow } from 'components/common/Svg/SvgIcon'
import Button from 'components/common/Button/Button'
import Tour from 'reactour'
import useWindowSize from 'hooks/useWindowSize'
import { screens } from 'utils/constants'

interface Guideline {
    start: boolean
    setStart: (e: boolean) => void
}
const Guide = ({ start, setStart }: Guideline) => {
    const { t } = useTranslation()
    const step = useRef<number>(0)
    const refGuide = useRef<any>(null)
    const [count, setCount] = useState<number>(0)
    const { width } = useWindowSize()
    const isMobile = width && width <= screens.drawer

    const getCurrentStep = (e: number) => {
        if (e === 1) {
            const _el = document.querySelector('#tour_chart')
            if (_el) _el.scrollIntoView()
        }
        if (e === 2) {
            const _el = document.querySelector('#tour_period')
            if (_el) _el.scrollIntoView()
        }
        if (e === 3) {
            const _el = document.querySelector('#tour_custom')
            if (_el) _el.scrollIntoView()
        }
        setCount(e)
    }

    useEffect(() => {
        if (start) {
            const _el = document.querySelector('#tour_custom')
            if (_el) _el.scrollIntoView()
        }
    }, [start])

    const contentStep1 = () => {
        return (
            <>
                <div>*Period: {t('insurance:terminology:period')}</div>
            </>
        )
    }
    const contentStep2 = () => {
        return (
            <>
                <div>*P-Claim: {t('insurance:terminology:p_claim')}</div>
            </>
        )
    }

    const tourConfig: any = useMemo(() => {
        return [
            {
                selector: '[data-tut="tour_statistics"]',
                content: (props: any) => <Content title={t('insurance:guild:step_title_1')} top {...props} onClose={onClose} />,
                position: 'bottom',
            },
            {
                selector: '[data-tut="tour_chart"]',
                content: (props: any) => <Content title={t('insurance:guild:step_title_2')} content={contentStep2()} top {...props} onClose={onClose} />,
                position: 'bottom',
            },
            {
                selector: '[data-tut="tour_period"]',
                content: (props: any) => <Content title={t('insurance:guild:step_title_3')} content={contentStep1()} top {...props} onClose={onClose} />,
                position: 'bottom',
            },
            {
                selector: '[data-tut="tour_custom"]',
                content: (props: any) => <Content title={t('insurance:guild:step_title_4')} top {...props} onClose={onClose} />,
                position: isMobile ? 'top' : 'bottom',
            },
        ]
    }, [])

    const onClose = (e: boolean) => {
        if (!e) {
            if (refGuide.current.state.current === tourConfig.length - 1) {
                setStart(false)
                setCount(0)
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
            className={`${count == 3 && 'reactour__arrow__right'} !max-w-md  `}
            maskClassName="guideline "
            rounded={6}
            startAt={0}
            maskSpace={2}
            disableInteraction
            disableKeyboardNavigation
            getCurrentStep={getCurrentStep}
            showNavigation={false}
            showButtons={false}
            showNumber={false}
            ref={refGuide}
            onAfterOpen={disableBodyScroll}
            onBeforeClose={enableBodyScroll}
            // inViewThreshold={100}
        />
    )
}

const Content = ({ title, content, step, onClose, top, goTo, ...props }: any) => {
    const { t } = useTranslation()
    return (
        <div>
            <div className="relative !max-w-md">
                <div id={`guideline-step-${step}`} className="flex flex-col space-y-3">
                    <div className="flex items-center justify-between">
                        {step > 1 ? (
                            <div className="cursor-pointer" onClick={() => goTo(step - 2)}>
                                <LeftArrow />
                            </div>
                        ) : (
                            <div />
                        )}
                        <div className="text-sm text-red font-medium">{step + '/4'}</div>
                        <div className="cursor-pointer" onClick={() => onClose(true)}>
                            <X width={16} />
                        </div>
                    </div>
                    <div className="text-sm">
                        <div className="mb-4">{title}</div>
                        <div className="mb-3">{content}</div>
                    </div>
                    <Button onClick={() => onClose(step === 4)} variants="primary" className="text-xs py-2 w-full">
                        {t(step === 4 ? 'insurance:guild:got_it' : 'common:next')}
                    </Button>
                </div>
            </div>
        </div>
    )
}

const View = styled.div.attrs({
    className: '',
})``

export default Guide
