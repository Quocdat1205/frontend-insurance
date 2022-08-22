import classnames from 'classnames'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { ChevronDown, ChevronUp } from 'react-feather'
import useWindowSize from 'hooks/useWindowSize'
import { screens } from 'utils/constants'

interface Menu {
    data: any[]
    onClick?: (menu: any) => void
}

const Menu = ({ data, onClick }: Menu) => {
    const { width } = useWindowSize()
    const isMobile = width && width < screens.drawer
    const [active, setActive] = useState<any>(null)

    const onToggleMenu = (e: any, menu: any) => {
        const _active = !menu.parentId && (active?.parentId === menu.menuId || active?.menuId === menu.menuId) ? null : menu
        e.stopPropagation()
        if (isMobile) setActive(_active)
        if (onClick) onClick(menu)
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
                    menu.name
                ) : (
                    <div
                        className={classnames('flex items-center justify-between sm:justify-start space-x-2 cursor-pointer text-sm ', {
                            'pb-3': _active,
                        })}
                    >
                        <span>{menu.name}</span> {!_active ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                    </div>
                )}
                {hasChildren && (
                    <ul className="bg-hover mb:bg-white -mx-8 mb:absolute relative flex flex-col mb:py-4 mb:space-y-2 mb:rounded-b-xl mb:shadow-subMenu mb:top-[calc(100%+1px)] h-max left-4 mb:min-w-[244px]">
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
        'mb:hover:text-red mx-4 mb:py-6': !isChild,
        'mb:!py-[10px] px-6 font-normal mb:text-txtPrimary mb:hover:bg-hover mb:hover:rounded-[3px]': isChild,
    }),
}))<Item>``
export default Menu