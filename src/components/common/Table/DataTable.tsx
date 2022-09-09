import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTable, useSortBy, useResizeColumns } from 'react-table'
import { SortIcon } from 'components/common/Svg/SvgIcon'
import colors from 'styles/colors'
import { ChevronRight, ChevronLeft } from 'react-feather'
import Pagination from 'rc-pagination'
import Skeleton from 'components/common/Skeleton/Skeleton'
interface Table {
    columns: any[]
    data: any[]
    total?: number
    skip?: number
    limit?: number
    loading?: boolean
    onChangePage?: (page: number) => void
}
const DataGrid = ({ columns, data, total = 0, skip = 0, limit = 10, onChangePage, loading }: Table) => {
    const table = useRef<any>(null)
    const container = useRef<any>(null)
    const mouseDown = useRef(false)
    const startX = useRef<any>(null)
    const scrollLeft = useRef<any>(null)
    const startY = useRef<any>(null)
    const scrollTop = useRef<any>(null)
    const handleClick = useRef(true)
    const [currentPage, setCurrentPage] = useState(1)

    const startDragging = (e: any) => {
        container.current.classList.add('cursor-grabbing')
        mouseDown.current = true
        startX.current = e.pageX - table.current.offsetLeft
        scrollLeft.current = table.current.scrollLeft

        startY.current = e.pageY - table.current.offsetTop
        scrollTop.current = table.current.scrollTop
        handleClick.current = true
    }

    const stopDragging = (event: any) => {
        container.current.classList.remove('cursor-grabbing')
        mouseDown.current = false
    }

    const onDrag = (e: any) => {
        e.preventDefault()
        if (!mouseDown.current) return
        const x = e.pageX - table.current.offsetLeft
        const scroll = x - startX.current
        table.current.scrollLeft = scrollLeft.current - scroll

        const y = e.pageY - table.current.offsetTop
        const scrollY = y - startY.current
        table.current.scrollTop = scrollTop.current - scrollY
        handleClick.current = false
    }

    useEffect(() => {
        if (container.current) {
            container.current.addEventListener('mousemove', onDrag)
            container.current.addEventListener('mousedown', startDragging, false)
            container.current.addEventListener('mouseup', stopDragging, false)
            container.current.addEventListener('mouseleave', stopDragging, false)
        }
        return () => {
            if (container.current) {
                container.current.removeEventListener('mousemove', onDrag)
                container.current.removeEventListener('mousedown', startDragging, false)
                container.current.removeEventListener('mouseup', stopDragging, false)
                container.current.removeEventListener('mouseleave', stopDragging, false)
            }
        }
    }, [container.current])

    const _onChangePage = (page: number) => {
        setCurrentPage(page)
        if (onChangePage) onChangePage(page)
    }

    const totalPage = useMemo(() => {
        return Math.ceil(total / limit)
    }, [total, limit])

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
        {
            columns,
            data,
        },
        useSortBy,
        useResizeColumns,
    )

    return (
        <>
            <div ref={table} className="overflow-auto">
                <table className="w-full" {...getTableProps()}>
                    <thead className="">
                        {headerGroups.map((headerGroup) => (
                            <tr className="text-sm font-semibold text-txtSecondary flex flex-nowrap" {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column: any) => {
                                    return (
                                        <th
                                            className="px-2 py-4 select-none flex items-center space-x-1"
                                            {...column.getHeaderProps(column.getSortByToggleProps())}
                                            {...column.getHeaderProps({ style: { minWidth: column.minWidth, width: column.width } })}
                                        >
                                            <span className="whitespace-nowrap">{column.render('Header')}</span>
                                            {/* {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''} */}
                                            <SortIcon
                                                color={colors.txtSecondary}
                                                activeColor={column.isSorted ? colors.red.red : colors.txtSecondary}
                                                direction={column.isSortedDesc ? 'desc' : 'asc'}
                                            />
                                            {/* <div {...column.getResizerProps()} className={`resizer ${column.isResizing ? 'isResizing' : ''}`} /> */}
                                        </th>
                                    )
                                })}
                            </tr>
                        ))}
                    </thead>

                    <tbody ref={container} className="m-auto flex flex-col" {...getTableBodyProps()}>
                        {rows.map((row, i) => {
                            prepareRow(row)
                            return (
                                <tr className="flex items-center" {...row.getRowProps()}>
                                    {row.cells.map((cell) => {
                                        return (
                                            <td
                                                className="px-2 border-t border-divider min-h-[54px] flex items-center "
                                                {...cell.getCellProps({ style: { minWidth: cell.column.minWidth, width: cell.column.width } })}
                                            >
                                                {loading ? <Skeleton className="min-h-[2rem]" /> : cell.render('Cell')}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            {totalPage > 1 && (
                <div className="paging mt-6 flex items-center justify-center">
                    <Pagination
                        prevIcon={(e: any) => <ChevronLeft color={e.disabled ? colors.divider : colors.txtPrimary} size={18} />}
                        nextIcon={(e: any) => <ChevronRight color={e.disabled ? colors.divider : colors.txtPrimary} size={18} />}
                        jumpPrevIcon={() => <div>...</div>}
                        jumpNextIcon={() => <div>...</div>}
                        current={currentPage}
                        total={total}
                        showLessItems={totalPage >= 10}
                        pageSize={limit}
                        onChange={_onChangePage}
                        showTitle={false}
                    />
                </div>
            )}
        </>
    )
}

const DataTable = ({ columns, data, total = 0, skip = 0, limit = 10, onChangePage, loading }: Table) => {
    const loader = useMemo(() => {
        const arr: any[] = []
        for (let i = 1; i <= limit; i++) {
            arr.push(i)
        }
        return arr
    }, [limit])

    return <DataGrid data={loading ? loader : data} total={total} limit={limit} skip={skip} columns={columns} loading={loading} onChangePage={onChangePage} />
}

export default DataTable
