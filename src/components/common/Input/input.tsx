import React from 'react';
import cx from 'classnames';

export type InputProps = {
    type: 'text' | 'number' | 'password' | 'email' | 'checkbox' | 'submit';
    inputName: string;
    idInput: string;
    value: any;
    placeholder: string;
    onChange: any;
    className: string;
    checked: boolean;
    disabled: boolean;
};

export const Input = ({
     inputName,
     idInput,
     value,
     type,
     placeholder,
     onChange,
     className,
     checked,
     disabled = false,
     }: Partial<InputProps>) => {
    return (
        <React.Fragment>
            <input
                className={cx([
                    className,
                    'px-3 py-3 placeholder-gray-400 rounded text-sm shadow focus:outline-none  ease-linear transition-all duration-150',
                ])}
                name={inputName}
                id={idInput}
                value={value}
                type={type}
                placeholder={placeholder}
                onChange={onChange}
                checked={checked}
                disabled={disabled}
            />
        </React.Fragment>
    );
};
