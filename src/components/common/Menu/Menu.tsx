import classnames from 'classnames'
import React, {useMemo,useState } from 'react'
import styled from 'styled-components'
import { ChevronDown, ChevronUp } from 'react-feather'
import useWindowSize from 'hooks/useWindowSize'
import { screens } from 'utils/constants'
import { useTranslation } from 'next-i18next'

interface Menu {
    data: any[]
    onChange?: (menu: any) => void
}

const Menu = ({ data, onChange }: Menu) => {
    const { width } = useWindowSize()
    const { t } = useTranslation()
    const isMobile = width && width < screens.drawer
    const [active, setActive] = useState<any>(null)

    const onToggleMenu = (e: any, menu: any) => {
        const _active = !menu.parentId && (active?.parentId === menu.menuId || active?.menuId === menu.menuId) ? null : menu
        e.stopPropagation()
        if (isMobile) setActive(_active)
        if (onChange) onChange(menu)
    }

    const recursiveData = (menu: any[], parent: any = undefined, level: number = 0) => {
        if (!parent) {
            const listParents = menu.filter((rs: any) => !rs.parentId)
            listParents.forEach((parent) => {
                parent.level = 0
                parent.children = recursiveData(menu, parent.menuId, parent.level)
            })
            return listParents
        } else {
            let _children = menu.filter((item: any) => {
                return item.parentId === parent
            })
            if (_children.length > 0) {
                _children.forEach((child: any) => {
                    child.level = level + 1
                    child.children = recursiveData(menu, child.menuId, child.level)
                })
            }
            return _children
        }
    }

    const dataFilter = useMemo(() => {
        return recursiveData(data)
    }, [data])

    const renderMenu = (menu: any, index: number, child: boolean = false) => {
        const hasChildren = menu.children.length > 0
        const _active = active?.menuId === menu.menuId || active?.parentId === menu.menuId
        return (
            <ItemMenu
                key={index}
                onClick={(e) => onToggleMenu(e, menu)}
                className={classnames('', {
                    'sub-menu': hasChildren,
                    'active-menu': _active,
                })}
                isChild={child}
            >
                {!hasChildren ? (
                    <div className="flex items-center space-x-4 px-4">
                        {menu.icon && <img className="min-w-6 min-h-6 w-6 h-6" src={menu.icon} />}
                        <span>{t(menu.name)}</span>
                    </div>
                ) : (
                    <div
                        className={classnames('flex items-center justify-between sm:justify-start space-x-2 cursor-pointer text-sm px-4', {
                            'pb-3': _active,
                        })}
                    >
                        {menu.icon && <img className="min-w-6 min-h-6 w-6 h-6" src={menu.icon} />}
                        <span>{t(menu.name)}</span> {!_active ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                    </div>
                )}
                {hasChildren && (
                    <ul className="w-full sm:w-max bg-hover mb:bg-white sm:-mx-8 mb:absolute relative flex flex-col mb:py-4 mb:space-y-2 mb:rounded-b-xl mb:shadow-subMenu mb:top-full h-max sm:left-12 mb:min-w-[244px]">
                        {menu.children.map((menu: any, idx: number) => renderMenu(menu, idx, true))}
                    </ul>
                )}
            </ItemMenu>
        )
    }

    return <ul className="sidebar-menu flex flex-col mb:items-center mb:flex-row">{dataFilter.map((menu: any, index: number) => renderMenu(menu, index))}</ul>
}

interface Item {
    isChild?: boolean
}

const ItemMenu = styled.li.attrs<Item>(({ isChild }) => ({
    className: classnames('cursor-pointer text-sm py-3 relative mb:hover:active-menu', {
        'mb:hover:text-red mb:py-6': !isChild,
        'mb:!py-[10px] px-4 font-normal mb:text-txtPrimary mb:hover:bg-hover mb:hover:rounded-[3px]': isChild,
    }),
}))<Item>``
export default Menu
