import { ReactNode, useEffect, useRef, useState } from 'react'
import classnames from 'classnames'
import ReactTooltip from 'react-tooltip'
import colors from 'styles/colors'

interface Tooltip {
    children?: ReactNode
    placement: 'left' | 'right' | 'top' | 'bottom'
    className?: string
    id: string
    arrowColor?: string
    backgroundColor?: string
}

const Tooltip = ({ children, placement = 'right', className, id, backgroundColor, arrowColor, ...props }: Tooltip) => {
    const [mount, setMount] = useState<boolean>(false)
    const ref = useRef<any>()

    useEffect(() => {
        setMount(true)
    }, [])
    if (!mount) return null

    return (
        <ReactTooltip
            id={id}
            ref={ref}
            {...props}
            place={placement}
            arrowColor={arrowColor ?? 'transparent'}
            backgroundColor={backgroundColor ?? colors.white.white}
            className={classnames('!rounded-md !text-xs !p-2 relative !border !border-red !opacity-100', className)}
            type="light"
            effect="solid"
            afterShow={() => ref?.current?.updatePosition()}
        >
            {children}
        </ReactTooltip>
    )
}

export default Tooltip
