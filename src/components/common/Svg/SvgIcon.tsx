import colors from 'styles/colors'

export const RightArrow = ({ size = 16, color = 'white' }: any) => {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M1.99988 8.66685L11.7239 8.66685L8.19521 12.1955L9.13788 13.1382L14.2759 8.00018L9.13788 2.86218L8.19521 3.80485L11.7239 7.33352L1.99988 7.33352L1.99988 8.66685Z"
                fill={color}
            />
        </svg>
    )
}

export const SuccessCircleIcon = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M12 2C6.486 2 2 6.486 2 12C2 17.514 6.486 22 12 22C17.514 22 22 17.514 22 12C22 6.486 17.514 2 12 2ZM12 20C7.589 20 4 16.411 4 12C4 7.589 7.589 4 12 4C16.411 4 20 7.589 20 12C20 16.411 16.411 20 12 20Z"
                fill="white"
            />
            <path d="M9.99902 13.587L7.70002 11.292L6.28802 12.708L10.001 16.413L16.707 9.70703L15.293 8.29303L9.99902 13.587Z" fill="white" />
        </svg>
    )
}

export const ErrorIcon = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M12 5.99018L19.53 19.0002H4.47L12 5.99018ZM2.74 18.0002C1.97 19.3302 2.93 21.0002 4.47 21.0002H19.53C21.07 21.0002 22.03 19.3302 21.26 18.0002L13.73 4.99018C12.96 3.66018 11.04 3.66018 10.27 4.99018L2.74 18.0002ZM11 11.0002V13.0002C11 13.5502 11.45 14.0002 12 14.0002C12.55 14.0002 13 13.5502 13 13.0002V11.0002C13 10.4502 12.55 10.0002 12 10.0002C11.45 10.0002 11 10.4502 11 11.0002ZM11 16.0002H13V18.0002H11V16.0002Z"
                fill="white"
            />
        </svg>
    )
}

export const MenuIcon = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20V8H4V6ZM4 11H20V13H4V11ZM4 16H20V18H4V16Z" fill="#22313F" />
        </svg>
    )
}

export const NotificationsIcon = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V2.5H10.5V4.68C7.64 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16ZM16 17H8V11C8 8.52 9.51 6.5 12 6.5C14.49 6.5 16 8.52 16 11V17Z"
                fill="#22313F"
            />
        </svg>
    )
}

export const TendencyIcon = () => {
    return (
        <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.04069 3.5415V4.95817H11.7086L3.49902 13.1678L4.49777 14.1665L12.7074 5.95692V10.6248H14.124V3.5415H7.04069Z" fill="#52CC74" />
        </svg>
    )
}

export const SortIcon = ({ size = 14, color = '#C4C4C4', activeColor = colors.red.red, direction }: any) => {
    return (
        <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 3L9.59808 6H4.40192L7 3Z" fill={direction === 'asc' ? activeColor : color} />
            <path d="M7 11L4.40192 8L9.59808 8L7 11Z" fill={direction === 'desc' ? activeColor : color} />
        </svg>
    )
}

export const CalendarIcon = ({ size = 20, color = '#22313F' }: any) => {
    return (
        <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M2.49902 4.99984V6.6665V16.6665C2.49902 17.5857 3.24652 18.3332 4.16569 18.3332H15.8324C16.7515 18.3332 17.499 17.5857 17.499 16.6665V6.6665V4.99984C17.499 4.08067 16.7515 3.33317 15.8324 3.33317H14.1657V1.6665H12.499V3.33317H7.49902V1.6665H5.83236V3.33317H4.16569C3.24652 3.33317 2.49902 4.08067 2.49902 4.99984ZM15.834 16.6665H4.16569V6.6665H15.8324L15.834 16.6665Z"
                fill={color}
            />
        </svg>
    )
}

export const FilterIcon = ({ size = 24, color = '#22313F' }: any) => {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill={color} d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z" />
        </svg>
    )
}

export const AddCircleIcon = ({ size = 24, color = '#EB2B3E' }: any) => {
    return (
        <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M9.16668 4.66683H7.83334V7.3335H5.16668V8.66683H7.83334V11.3335H9.16668V8.66683H11.8333V7.3335H9.16668V4.66683ZM8.50001 1.3335C4.82001 1.3335 1.83334 4.32016 1.83334 8.00016C1.83334 11.6802 4.82001 14.6668 8.50001 14.6668C12.18 14.6668 15.1667 11.6802 15.1667 8.00016C15.1667 4.32016 12.18 1.3335 8.50001 1.3335ZM8.50001 13.3335C5.56001 13.3335 3.16668 10.9402 3.16668 8.00016C3.16668 5.06016 5.56001 2.66683 8.50001 2.66683C11.44 2.66683 13.8333 5.06016 13.8333 8.00016C13.8333 10.9402 11.44 13.3335 8.50001 13.3335Z"
                fill={color}
            />
        </svg>
    )
}

export const AlarmIcon = ({ size = 24, color = '#EB2B3E' }: any) => {
    return (
        <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M8.5 2.6665C5.24733 2.6665 2.5 5.41384 2.5 8.6665C2.5 11.9192 5.24733 14.6665 8.5 14.6665C11.7527 14.6665 14.5 11.9192 14.5 8.6665C14.5 5.41384 11.7527 2.6665 8.5 2.6665ZM8.5 13.3332C5.97067 13.3332 3.83333 11.1958 3.83333 8.6665C3.83333 6.13717 5.97067 3.99984 8.5 3.99984C11.0293 3.99984 13.1667 6.13717 13.1667 8.6665C13.1667 11.1958 11.0293 13.3332 8.5 13.3332Z"
                fill={color}
            />
            <path d="M9.16668 8.00016V5.3335H7.83334V8.00016V9.3335H9.16668H11.8333V8.00016H9.16668Z" fill={color} />
            <path d="M12.0226 2.47119L12.964 1.52703L14.9704 3.52763L14.0289 4.47179L12.0226 2.47119Z" fill={color} />
            <path d="M4.96527 2.47119L2.97173 4.47044L2.02757 3.52899L4.02111 1.52973L4.96527 2.47119Z" fill={color} />
        </svg>
    )
}
