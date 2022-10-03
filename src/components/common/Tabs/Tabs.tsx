import classnames from 'classnames'
import React, { ReactNode, useEffect, useMemo, useRef, useState, Fragment } from 'react'
import styled from 'styled-components'
import colors from 'styles/colors'
import { isMobile } from 'react-device-detect'

interface Tabs {
    children: any
    tab: any
}
const Tabs = ({ children, tab }: Tabs) => {
    const TabRef = useRef<any>(null)
    const [mount, setMount] = useState<boolean>(false)

    useEffect(() => {
        setMount(true)
    }, [])

    useEffect(() => {
        if (TabRef.current) {
            TabRef.current.querySelectorAll('.tab-item').forEach((el: any) => {
                if (el) el.classList[el.getAttributeNode('value').value === tab ? 'add' : 'remove']('tab-active')
            })
        }
    }, [tab, TabRef])

    const active = useMemo(() => {
        return Array.isArray(children) ? children.findIndex((rs: any) => rs?.props?.value === tab) : 0
    }, [tab, children])

    const offset = useMemo(() => {
        if (!mount) return null
        const el: any = document.querySelector('#tab-item-' + tab)
        return {
            left: isMobile ? 0 : `${el?.offsetLeft}px`,
            width: isMobile ? `calc(100% / ${children.length ?? 1})` : `${el?.offsetWidth}px` ?? '100%',
        }
    }, [tab, mount])

    return (
        <Tab offset={offset} isMobile={isMobile} ref={TabRef} active={active}>
            {children}
        </Tab>
    )
}

const Tab = styled.div.attrs({
    className: 'h-full flex items-center relative',
})<any>`
    &:before {
        content: '';
        position: absolute;
        bottom: 0;
        height: 2px;
        width: 100%;
        background-color: ${() => colors.divider};
    }
    &:after {
        content: '';
        position: absolute;
        bottom: 0;
        height: 2px;
        background-color: ${() => colors.red.red};
        transform: ${({ active, isMobile }) => isMobile && `translate(${active * 100}%,0)`};
        width: ${({ offset }) => offset?.width};
        left: ${({ offset }) => offset?.left};
        transition: all 0.2s;
    }
`

interface TabItem {
    value: any
}

export const TabItem = styled.div.attrs<TabItem>(({ value }) => ({
    className: classnames('px-4 py-3 whitespace-nowrap text-center cursor-pointer w-full sm:w-max text-gray tab-item sm:px-12'),
    id: `tab-item-${value}`,
}))<TabItem>``


export default Tabs
