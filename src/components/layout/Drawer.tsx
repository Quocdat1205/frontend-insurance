import classnames from 'classnames'
import Portal from 'components/common/Modal/Portal'
import { useOutside } from 'hooks/useOutsideAlerter'
import useWindowSize from 'hooks/useWindowSize'
import React, { useEffect, useRef } from 'react'
import { screens } from 'utils/constants'

const Drawer = ({ visible, onClose, children }: any) => {
    const { width } = useWindowSize()
    const isMobile = width && width < screens.drawer

    useEffect(() => {
        if (!isMobile) onClose()
    }, [isMobile])

    const wrapperRef = useRef(null)
    const container = useRef(null)
    const timer = useRef<any>(null)
    const handleOutside = () => {
        if (visible && onClose) {
            onClose()
        }
    }

    useEffect(() => {
        if (visible) {
            document.body.classList.add('overflow-hidden')
        } else {
            clearTimeout(timer.current)
            timer.current = setTimeout(() => {
                document.body.classList.remove('overflow-hidden')
            }, 300)
        }
    }, [visible])

    useOutside(wrapperRef, handleOutside, container)

    return (
        <Portal portalId="PORTAL_MODAL">
            <div
                className={classnames(
                    'flex flex-col fixed top-[56px] right-0 h-[calc(100%-56px)] w-full z-[20] bg-shadow/[0.3] overflow-hidden',
                    'ease-in-out transition-all flex items-end duration-300 z-30',
                    { invisible: !visible },
                    { visible: visible },
                    { 'translate-x-full': !visible },
                    { 'translate-x-0': visible },
                )}
                ref={container}
            >
                <div
                    ref={wrapperRef}
                    className="text-sm font-semibold flex flex-col justify-between flex-1 w-[284px] min-h-0 bg-white border-t border-divider py-8"
                >
                    {children}
                </div>
            </div>
        </Portal>
    )
}
export default Drawer
