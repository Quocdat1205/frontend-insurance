import React, { useMemo } from 'react'
import Select from 'react-select'
import colors from 'styles/colors'

const customStyles = {
    control: (styles: any, { isDisabled }: any) => ({
        backgroundColor: colors.hover,
        display: 'flex',
        alignItems: 'center',
        minHeight: 48,
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
        backgroundColor: isSelected ? colors.active : colors.white.white,
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

interface Selectbox {
    label: string
    options: any[]
    placeholder?: string
    className?: string
    value?: any
    onChange?: (e: any) => void
    displayExpr: string
    valueExpr: string
}

const Selectbox = ({ className, label, options, placeholder = label, value, displayExpr, valueExpr, ...props }: Selectbox) => {

    const item = useMemo(() => {
        if (typeof value === 'string') {
            return options.find((rs: any) => valueExpr && rs[valueExpr] === value)
        }
        return value
    }, [value, valueExpr])

    return (
        <div className={`flex flex-col space-y-2 ${className}`}>
            <div className="text-sm">{label}</div>
            <Select
                {...props}
                value={item}
                placeholder={placeholder}
                styles={customStyles}
                options={options}
                getOptionLabel={(option: any) => option && displayExpr && option[displayExpr]}
                getOptionValue={(option: any) => option && valueExpr && option[valueExpr]}
            />
        </div>
    )
}

export default Selectbox
