import classnames from 'classnames'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import React, { memo, useCallback, useMemo, useRef, useState } from 'react'
import { isMobile as mobile } from 'react-device-detect'
import { ChevronDown, ChevronUp } from 'react-feather'
import styled from 'styled-components'
import Modal from 'components/common/Modal/Modal'
import NotificationInsurance from 'components/layout/notifucationInsurance'
import ContactModal from 'components/screens/HomePage/ContactModal'
import EmailSubscriptionModal from 'components/screens/HomePage/EmailRegisterModal'
import useOutsideAlerter from 'hooks/useOutsideAlerter'
import useWindowSize from 'hooks/useWindowSize'
import { IconSvg } from 'types/types'
import { screens } from 'utils/constants'
import { isFunction } from 'utils/utils'

interface MenuItem {
    name?: any
    router?: string
    icon?: string | React.ReactNode | IconSvg | any
    // when the icon is a custom react node
    isIconSvg?: undefined | boolean
    isMobile?: boolean
    menuId: undefined | string
    parentId?: string | number
    // when the name is custom react node
    nameComponentProps?: any
    parent?: string | number
    // show arrow down when the menu has children
    hideArrowIcon?: boolean
    isDropdown?: boolean
    modalName?: undefined | string
}

interface Menu {
    data: MenuItem[]
    onChange?: (menu: any) => void
    cbOnMouseOver?: (state: any) => void
    cbOnMouseOut?: (state: any) => void
    isClickedMenu?: boolean
    handleClickOutside?: (isClick: boolean) => void
}

const Menu = ({ data, onChange, cbOnMouseOut, handleClickOutside, isClickedMenu = false }: Menu) => {
    const { width } = useWindowSize()
    const { t } = useTranslation()
    const isMobile = (width && width < screens.drawer) || mobile
    const [active, setActive] = useState<any>(null)
    const [isShowMenu, setIsShowMenu] = useState(false)
    const router = useRouter()
    const wrapperRef = useRef<any>(null)

    const onToggleMenu = (e: any, menu: any) => {
        const _active = !menu.parentId && (active?.parentId === menu.menuId || active?.menuId === menu.menuId) ? null : menu
        e.stopPropagation()
        setActive(_active)
        setIsShowMenu(!isShowMenu)
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

    const handleOutside = () => {
        setActive(false)
        if (handleClickOutside && isFunction(handleClickOutside)) {
            handleClickOutside(false)
        }
    }

    useOutsideAlerter(wrapperRef, handleOutside)

    const dataFilter = useMemo(() => recursiveData(data), [data])

    const renderMenu = (menu: any, index: number, child = false) => {
        const isActive = router.pathname === menu?.router
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
            return <img className="w-6 h-6 min-w-6 min-h-6" src={menu.icon} />
        }

        const Name = ({ name, ...nameProps }: any) => {
            if (typeof name === 'string' || name instanceof String) return <span>{t(name.toString())}</span>
            // custom name component
            const Component = name
            return (
                <>
                    <Component isClickedMenu={isClickedMenu} {...nameProps} />
                </>
            )
        }

        return (
            <ItemMenu
                key={index}
                onClick={(e) => onToggleMenu(e, menu)}
                className={classnames('', {
                    'sub-menu': hasChildren,
                    'active-menu': _active,
                })}
                isChild={child}
                isDropdown={menu?.isDropdown}
                active={isActive}
            >
                {!hasChildren ? (
                    <div className="flex items-center px-4 space-x-4">
                        {menu?.icon && <Icon isIconSvg={menu?.isIconSvg} icon={menu.icon} />}
                        {/* custom parent component: component passed from config as [name] props */}
                        <Name name={menu.name} {...menu?.nameComponentProps} />
                    </div>
                ) : (
                    <div
                        className={classnames('flex items-center justify-between mb:justify-start space-x-2 cursor-pointer text-sm px-4', {
                            'pb-3 mb:pb-0': _active && isMobile,
                        })}
                    >
                        <div className="flex items-center space-x-4">
                            {menu?.icon && <Icon isIconSvg={menu?.isIconSvg} icon={menu.icon} />}
                            <Name name={menu.name} {...menu?.nameComponentProps} />
                        </div>
                        {!menu?.hideArrowIcon && isMobile && (!_active ? <ChevronDown size={18} /> : <ChevronUp size={18} />)}
                        {/* {!isClickedMenu || ( isMobile && !active  ) ? <ChevronDown size={18} /> : <ChevronUp size={18} />} */}
                        {/* {!menu?.hideArrowIcon && !isMobile && (!isClickedMenu ? <ChevronDown size={18} /> : <ChevronUp size={18} />)} */}
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
        <ul
            ref={wrapperRef}
            className="flex flex-col sidebar-menu mb:items-center mb:flex-row"
        >
            {dataFilter.map((menu: any, index: number) => renderMenu(menu, index))}
        </ul>
    )
}

interface Item {
    isChild?: boolean
    isDropdown?: boolean
    active?: boolean
}

const ItemMenu = styled.li.attrs<Item>(({ isChild, isDropdown, active }) => ({
    className: classnames('cursor-pointer text-sm py-3 relative', {
        'mb:hover:text-red': !isChild && !isDropdown,
        'mb:py-3': !isChild,
        'mb:!py-[10px] pl-4 font-normal mb:text-txtPrimary mb:hover:bg-hover mb:hover:rounded-[3px]': isChild,
        'text-red': active,
    }),
}))<Item>``
export default memo(Menu)
