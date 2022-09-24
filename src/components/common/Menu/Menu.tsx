import classnames from 'classnames'
import { useTranslation } from 'next-i18next'
import React, { MouseEventHandler, useMemo, useState } from 'react'
import { isMobile as mobile } from 'react-device-detect'
import { ChevronDown, ChevronUp } from 'react-feather'
import styled from 'styled-components'
import useWindowSize from 'hooks/useWindowSize'
import { IconSvg } from 'types/types'
import { screens } from 'utils/constants'
import { isFunction } from 'utils/utils'
import { RootStore, useAppSelector } from 'redux/store'

interface MenuItem {
    name?: any
    router?: string
    icon?: string | React.ReactNode | IconSvg | any
    // when the icon is a custom react node
    isIconSvg?: boolean
    isMobile?: boolean
    menuId: string
    parentId?: string | number
    // when the name is custom react node
    nameComponentProps?: any
    parent?: string | number
    // show arrow down when the menu has children
    hideArrowIcon?: boolean
}

interface Menu {
    data: MenuItem[]
    onChange?: (menu: any) => void
    cbOnMouseOver?: (state: any) => void
    cbOnMouseOut?: (state: any) => void
}

const Menu = ({ data, onChange, cbOnMouseOut, cbOnMouseOver }: Menu) => {
    const { width } = useWindowSize()
    const { t } = useTranslation()
    const isMobile = (width && width < screens.drawer) || mobile
    const [active, setActive] = useState<any>(null)
    const [isHover, setIsHover] = useState(false)
    const account = useAppSelector((state: RootStore) => state.setting.account)

    const onToggleMenu = (e: any, menu: any) => {
        const _active = !menu.parentId && (active?.parentId === menu.menuId || active?.menuId === menu.menuId) ? null : menu
        e.stopPropagation()
        setActive(_active)
        if (onChange) onChange(menu)
    }

    const recursiveData = (menu: any[], parent: any = undefined, level = 0) => {
        if (!parent) {
            const listParents = menu.filter((rs: any) => !rs.parentId)
            listParents.forEach((parent) => {
                parent.level = 0
                parent.children = recursiveData(menu, parent.menuId, parent.level)
            })
            return listParents
        }
        const _children = menu.filter((item: any) => item.parentId === parent)
        if (_children.length > 0) {
            _children.forEach((child: any) => {
                child.level = level + 1
                child.children = recursiveData(menu, child.menuId, child.level)
            })
        }
        return _children
    }

    const handleOnMouseOut = (e: any) => {
        e.stopPropagation()

        if (isMobile) {
            return
        }
        setActive(false)
        setIsHover(false)
        if (cbOnMouseOut) {
            if (isFunction(cbOnMouseOut)) cbOnMouseOut(false)
        }

        // setActive(false)
    }

    const handleOnMouseOver = (e: any) => {
        e.stopPropagation()
        if (isMobile) return
        setIsHover(true)

        // cb mouse leave
        if (cbOnMouseOver) {
            if (isFunction(cbOnMouseOver)) cbOnMouseOver(true)
        }
        // setActive(true)
    }

    const dataFilter = useMemo(() => recursiveData(data), [data])

    const renderMenu = (menu: any, index: number, child = false) => {
        if (!account?.address && menu.menuId === 'disconnect') return null
        const hasChildren = menu.children.length > 0
        const _active = active?.menuId === menu.menuId || active?.parentId === menu.menuId
        const level = menu.level + 1

        // mobile check
        if (menu?.isMobile && !isMobile) {
            return null
        }

        const Icon = ({ isIconSvg = false, icon }: { isIconSvg?: boolean; icon: any }) => {
            if (menu?.isIconSvg) {
                const IconComponent = icon
                return <IconComponent />
            }
            return <img className="min-w-6 min-h-6 w-6 h-6" src={menu.icon} />
        }

        const Name = ({ name, ...nameProps }: any) => {
            if (typeof name === 'string' || name instanceof String) return <span>{t(menu.name)}</span>
            // custom name component
            const Component = name
            return (
                <>
                    <Component {...nameProps} />
                </>
            )
        }
        return (
            <ItemMenu
                key={index}
                onClick={(e) => onToggleMenu(e, menu)}
                // onMouseOut={handleOnMouseOut}
                className={classnames('', {
                    'sub-menu': hasChildren,
                    'active-menu': _active,
                })}
                isChild={child}
            >
                {!hasChildren ? (
                    <div className="flex items-center space-x-4 px-4">
                        {menu?.icon && <Icon isIconSvg={menu?.isIconSvg} icon={menu.icon} />}
                        {/* custom parent component: component passed from config as [name] props */}
                        <Name name={menu.name} {...menu?.nameComponentProps} />
                    </div>
                ) : (
                    <div
                        className={classnames('flex items-center justify-between sm:justify-start space-x-2 cursor-pointer text-sm px-4', {
                            'pb-3': _active && isMobile,
                        })}
                    >
                        <div className="space-x-4 flex items-center">
                            {menu?.icon && <Icon isIconSvg={menu?.isIconSvg} icon={menu.icon} />}
                            <Name name={menu.name} {...menu?.nameComponentProps} />
                        </div>
                        {isMobile && (!_active ? <ChevronDown size={18} /> : <ChevronUp size={18} />)}
                        {/* {!isHover || ( isMobile && !active  ) ? <ChevronDown size={18} /> : <ChevronUp size={18} />} */}
                        {!menu?.hideArrowIcon && !isMobile && (!isHover ? <ChevronDown size={18} /> : <ChevronUp size={18} />)}
                    </div>
                )}
                {hasChildren && (
                    <ul
                        className={`menu-${level} w-full mb:w-max bg-hover mb:bg-white mb:-mx-8 mb:absolute relative flex flex-col mb:py-4 mb:space-y-2 mb:rounded-b-xl mb:shadow-subMenu mb:top-full h-max mb:left-12 mb:min-w-[244px]`}
                    >
                        {menu.children.map((menu: any, idx: number) => renderMenu(menu, idx, true))}
                    </ul>
                )}
            </ItemMenu>
        )
    }

    return (
        <ul onMouseOver={handleOnMouseOver} onMouseOut={handleOnMouseOut} className="sidebar-menu flex flex-col mb:items-center mb:flex-row">
            {dataFilter.map((menu: any, index: number) => renderMenu(menu, index))}
        </ul>
    )
}

interface Item {
    isChild?: boolean
}

const ItemMenu = styled.li.attrs<Item>(({ isChild }) => ({
    className: classnames('cursor-pointer text-sm py-3 relative mb:hover:active-menu', {
        // 'mb:hover:text-red mb:py-6': !isChild,
        'mb:hover:text-red mb:py-2': !isChild,
        'mb:!py-[10px] pl-4 font-normal mb:text-txtPrimary mb:hover:bg-hover mb:hover:rounded-[3px]': isChild,
    }),
}))<Item>``
export default Menu
