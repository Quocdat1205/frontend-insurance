import React, { useMemo } from 'react'
import Select, { ClearIndicatorProps } from 'react-select'
import colors from 'styles/colors'
import { isMobile } from 'react-device-detect'
import { X } from 'react-feather'

const customStyles = {
    control: (styles: any, { isDisabled }: any) => ({
        backgroundColor: colors.hover,
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        borderRadius: 3,
        padding: '0 16px',
    }),
    valueContainer: (style: any) => ({
        ...style,
        padding: 0,
    }),
    indicatorSeparator: () => ({
        display: 'none',
    }),
    placeholder: (style: any) => ({
        ...style,
        color: colors.gray.gray,
    }),
    input: (style: any) => ({
        ...style,
        margin: 0,
        padding: 0,
    }),
    menu: (provided: any, state: any) => ({
        ...provided,
        color: state.selectProps.menuColor,
        width: '98%',
        left: '50%',
        transform: 'translate(-50%, 0)',
    }),
    singleValue: (provided: any, { isDisabled }: any) => ({
        ...provided,
        opacity: isDisabled ? 0.5 : 1,
        transition: 'opacity 300ms',
        margin: 0,
    }),
    dropdownIndicator: (style: any, state: any) => ({
        ...style,
        color: colors.txtPrimary,
        transition: 'all .2s ease',
        padding: 0,
        transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : null,
    }),
    option: (styles: any, { isDisabled, isSelected }: any) => ({
        ...styles,
        color: isDisabled ? colors.divider : colors.txtPrimary,
        cursor: isDisabled ? 'not-allowed' : 'default',
        backgroundColor: isSelected ? colors.gray[1] : colors.white.white,
        paddingLeft: '1rem',
        paddingRight: '1rem',
        ':hover': {
            ...styles[':hover'],
            backgroundColor: isDisabled ? colors.white.white : colors.hover,
        },
        ':active': {
            ...styles[':active'],
            backgroundColor: colors.hover,
        },
    }),
}

const ClearIndicator = (props: ClearIndicatorProps<null, true>) => {
    const {
        children = <X size={16} />,
        innerProps: { ref, ...restInnerProps },
    } = props
    return (
        <div className="flex items-center justify-center h-full px-1" ref={ref} {...restInnerProps}>
            {children}
        </div>
    )
}

interface Selectbox {
    label: string
    options: any[]
    placeholder?: string
    className?: string
    value?: any
    onChange?: (value: any, item: any) => void
    displayExpr: string
    valueExpr: string
    formatOptionLabel?: any
    labelClassName?: string
    isClearable?: boolean
}

const Selectbox = ({
    className,
    label,
    options,
    placeholder = label,
    onChange,
    value,
    displayExpr,
    valueExpr,
    labelClassName,
    isClearable = false,
    ...props
}: Selectbox) => {
    const item = useMemo(() => {
        if (typeof value === 'string') {
            return options.find((rs: any) => valueExpr && rs[valueExpr] === value)
        }
        return value
    }, [value, valueExpr])

    const _onChange = (e: any) => {
        if (onChange) onChange(e?.[valueExpr], e)
    }

    return (
        <div className={`flex flex-col space-y-2 ${className}`}>
            <div className={`text-xs sm:text-sm text-txtSecondary ${labelClassName}`}>{label}</div>
            <Select
                {...props}
                value={item}
                onChange={_onChange}
                placeholder={placeholder}
                styles={customStyles}
                options={options}
                className="h-[2.75rem] sm:h-[3rem]"
                getOptionLabel={(option: any) => option && displayExpr && option[displayExpr]}
                getOptionValue={(option: any) => option && valueExpr && option[valueExpr]}
                maxMenuHeight={isMobile ? 168 : 500}
                isClearable={isClearable}
                components={{ ClearIndicator }}
            />
        </div>
    )
}

export default Selectbox
