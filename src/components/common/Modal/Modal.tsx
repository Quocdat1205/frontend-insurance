import classnames from 'classnames'
import { useOutside } from 'hooks/useOutsideAlerter'
import useWindowSize from 'hooks/useWindowSize'
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { X } from 'react-feather'
import { PORTAL_MODAL_ID, screens } from 'utils/constants'
import Portal from './Portal'

interface Modal {
    isVisible: boolean
    children: ReactNode
    containerClassName?: string
    className?: string
    onBackdropCb?: () => void
    portalId?: string
    isMobile?: boolean
    customHeader?: () => void
    wrapClassName?: string
    closeButton?: boolean
    canBlur?: boolean
}

const Modal = ({
    isVisible,
    portalId = PORTAL_MODAL_ID,
    children,
    containerClassName = '',
    className = '',
    onBackdropCb,
    isMobile,
    customHeader,
    wrapClassName = '',
    closeButton = true,
    canBlur = true,
}: Modal) => {
    const wrapperRef = useRef<any>(null)
    const container = useRef<any>(null)
    const timer = useRef<any>(null)
    const [mount, setMount] = useState<boolean>(false)
    const { width } = useWindowSize()

    const handleOutside = () => {
        if (isVisible && onBackdropCb) onBackdropCb()
    }

    if (canBlur) {
        useOutside(wrapperRef, handleOutside, container)
    }

    // useOutsideAlerter(wrapperRef, handleOutside)

    useEffect(() => {
        clearTimeout(timer.current)
        timer.current = setTimeout(
            () => {
                setMount(isVisible)
            },
            isVisible ? 10 : 100,
        )
        const hidding = document.body.classList.contains('overflow-hidden')
        if (hidding) return
        if (isVisible) {
            document.body.classList.add('overflow-hidden')
        } else {
            document.body.classList.remove('overflow-hidden')
        }
        return () => {
            if (!hidding) document.body.classList.remove('overflow-hidden')
        }
    }, [isVisible, isMobile])

    if (!isVisible && !mount) return null

    return (
        <Portal portalId={portalId} isVisible={isVisible}>
            <div
                onClick={() => {
                    return
                }}
                onBlur={() => {
                    return
                }}
                className={classnames(
                    'fixed top-0 left-0 z-[99] w-full h-full overflow-hidden bg-bgModal/[0.3]',
                    'z-30',
                    {
                        invisible: !isVisible,
                        visible: isVisible,
                    },
                    containerClassName,
                )}
                ref={container}
            >
                <div
                    className={classnames('h-full relative ease-in transition-all flex', {
                        'translate-y-full duration-200': !isVisible || !mount,
                        'translate-y-0 duration-200': mount,
                        'flex-col justify-end': isMobile && width && width < screens.drawer,
                    })}
                >
                    <div
                        ref={wrapperRef}
                        className={classnames(
                            'w-full absolute bg-white overflow-auto max-h-full',
                            { 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl': !isMobile || (width && width >= screens.drawer) },
                            className,
                        )}
                    >
                        <div className={`py-8 px-6 h-full ${wrapClassName}`}>
                            <>
                                {customHeader
                                    ? customHeader()
                                    : closeButton && (
                                          <div className="flex items-center justify-end pb-6 sm:pb-2">
                                              <X onClick={handleOutside} size={20} className="cursor-pointer" />
                                          </div>
                                      )}
                                {children}
                            </>
                        </div>
                    </div>
                </div>
            </div>
        </Portal>
    )
}

export default Modal
