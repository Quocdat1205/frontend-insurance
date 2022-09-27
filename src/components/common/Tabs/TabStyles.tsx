import classnames from 'classnames'
import styled from 'styled-components'
import colors from 'styles/colors'

export const TabStyled = styled.div.attrs({
    className: 'h-full flex items-center justify-between relative',
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
        transform: ${({ tab }) => `translate(${tab * 100}%,0)`};
        width: ${({ qty }) => `calc(100% / ${qty})`};
        transition: all 0.2s;
    }
`

export const ItemStyled = styled.div.attrs<any>(({ value }) => ({
    className: classnames('px-4 py-3 whitespace-nowrap text-center cursor-pointer w-full text-gray', `tab-item-${value}`),
}))<any>``
