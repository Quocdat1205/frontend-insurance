import colors from 'styles/colors'
import { IconSvg } from 'types/types'

export const RightArrow = ({ size = 16, color = 'white', className = '' }: any) => {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M1.99988 8.66685L11.7239 8.66685L8.19521 12.1955L9.13788 13.1382L14.2759 8.00018L9.13788 2.86218L8.19521 3.80485L11.7239 7.33352L1.99988 7.33352L1.99988 8.66685Z"
                fill={color}
            />
        </svg>
    )
}

export const LeftArrow = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
            <path fill="currentColor" d="M21 11H6.414l5.293-5.293l-1.414-1.414L2.586 12l7.707 7.707l1.414-1.414L6.414 13H21z" />
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

export const TendencyIcon = ({ color = '#52CC74', down = false }: any) => {
    return (
        <svg className={down ? 'rotate-90' : ''} width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.04069 3.5415V4.95817H11.7086L3.49902 13.1678L4.49777 14.1665L12.7074 5.95692V10.6248H14.124V3.5415H7.04069Z" fill={color} />
        </svg>
    )
}

export const CheckCircle = ({ size = 24 }) => {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M12 2C6.486 2 2 6.486 2 12C2 17.514 6.486 22 12 22C17.514 22 22 17.514 22 12C22 6.486 17.514 2 12 2ZM12 20C7.589 20 4 16.411 4 12C4 7.589 7.589 4 12 4C16.411 4 20 7.589 20 12C20 16.411 16.411 20 12 20Z"
                fill="#52CC74"
            />
            <path d="M9.999 13.587L7.7 11.292L6.288 12.708L10.001 16.413L16.707 9.70697L15.293 8.29297L9.999 13.587Z" fill="#52CC74" />
        </svg>
    )
}

export const ErrorMessage = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M8.05 11.5H3.95C3.8 11.5 3.7 11.45 3.6 11.35L0.65 8.4C0.55 8.35 0.5 8.2 0.5 8.05V3.95C0.5 3.8 0.55 3.7 0.65 3.6L3.6 0.65C3.65 0.55 3.8 0.5 3.95 0.5H8.1C8.25 0.5 8.35 0.55 8.45 0.65L11.4 3.6C11.45 3.65 11.5 3.8 11.5 3.95V8.1C11.5 8.25 11.45 8.35 11.35 8.45L8.4 11.4C8.35 11.45 8.2 11.5 8.05 11.5ZM4.15 10.5H7.9L10.55 7.85V4.15L7.85 1.5H4.15L1.5 4.15V7.9L4.15 10.5Z"
                fill="#DE350B"
            />
            <path d="M6 6.5C5.7 6.5 5.5 6.3 5.5 6V4C5.5 3.7 5.7 3.5 6 3.5C6.3 3.5 6.5 3.7 6.5 4V6C6.5 6.3 6.3 6.5 6 6.5Z" fill="#DE350B" />
            <path
                d="M6 8.5C5.85 8.5 5.75 8.45 5.65 8.35C5.55 8.25 5.5 8.15 5.5 8C5.5 7.95 5.5 7.85 5.55 7.8C5.6 7.75 5.6 7.7 5.65 7.65C5.8 7.5 6 7.45 6.2 7.55C6.25 7.55 6.25 7.55 6.3 7.6C6.3 7.6 6.35 7.65 6.4 7.65C6.45 7.7 6.5 7.75 6.5 7.8C6.5 7.85 6.5 7.95 6.5 8C6.5 8.05 6.5 8.15 6.45 8.2C6.4 8.25 6.4 8.3 6.35 8.35C6.25 8.45 6.15 8.5 6 8.5Z"
                fill="#DE350B"
            />
        </svg>
    )
}

export const InfoCircle = ({ size = 24, color = '#00ABF9' }: IconSvg) => {
    return (
        <svg width={size} height={size} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M6 1C3.243 1 1 3.243 1 6C1 8.757 3.243 11 6 11C8.757 11 11 8.757 11 6C11 3.243 8.757 1 6 1ZM6 10C3.7945 10 2 8.2055 2 6C2 3.7945 3.7945 2 6 2C8.2055 2 10 3.7945 10 6C10 8.2055 8.2055 10 6 10Z"
                fill={color}
            />
            <path d="M5.5 5.5H6.5V8.5H5.5V5.5ZM5.5 3.5H6.5V4.5H5.5V3.5Z" fill={color} />
        </svg>
    )
}

export const lineYChart = () => {
    return (
        <svg width="2" height="240" viewBox="0 0 2 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="1" y1="3.5011e-08" x2="0.999987" y2="240" stroke="#B2B7BC" stroke-width="2" stroke-dasharray="0.74 3.72" />
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

export const SuccessIcon = () => {
    return (
        <svg width="82" height="82" viewBox="0 0 82 82" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M41 81.5C63.3675 81.5 81.5 63.3675 81.5 41C81.5 18.6325 63.3675 0.5 41 0.5C18.6325 0.5 0.5 18.6325 0.5 41C0.5 63.3675 18.6325 81.5 41 81.5Z"
                fill="url(#paint0_linear_1019_8538)"
            />
            <path
                d="M41 81.5C63.3675 81.5 81.5 63.3675 81.5 41C81.5 18.6325 63.3675 0.5 41 0.5C18.6325 0.5 0.5 18.6325 0.5 41C0.5 63.3675 18.6325 81.5 41 81.5Z"
                fill="url(#paint1_linear_1019_8538)"
                fillOpacity="0.5"
            />
            <path
                d="M41 81.5C63.3675 81.5 81.5 63.3675 81.5 41C81.5 18.6325 63.3675 0.5 41 0.5C18.6325 0.5 0.5 18.6325 0.5 41C0.5 63.3675 18.6325 81.5 41 81.5Z"
                stroke="url(#paint2_linear_1019_8538)"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M66.9933 29.6609L36.4628 59.5801L18.4326 42.4687L23.1725 37.4744L36.3861 50.0147L62.174 24.7432L66.9933 29.6609Z"
                fill="white"
            />
            <defs>
                <linearGradient id="paint0_linear_1019_8538" x1="12" y1="70" x2="73" y2="16" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" />
                    <stop offset="0.401042" stopColor="#61F98C" />
                    <stop offset="1" stopColor="#3AB83A" />
                </linearGradient>
                <linearGradient id="paint1_linear_1019_8538" x1="48" y1="34.5" x2="45" y2="-2.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3AB83A" />
                    <stop offset="1" stopColor="white" />
                </linearGradient>
                <linearGradient id="paint2_linear_1019_8538" x1="41" y1="1" x2="41" y2="81" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFEC3E" />
                    <stop offset="1" stopColor="#FFFAEC" />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const CheckBoxIcon = ({
    bgColor,
    dotColor,
    size,
    borderColor,
    checked,
    checkBgColor,
    checkDotColor,
    checkBorderColor,
    className,
    onClick,
    onChange,
}: any) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            onClick={onClick}
            onChange={onChange}
        >
            <path
                d="M12 23.5C5.64873 23.5 0.5 18.3513 0.5 12C0.5 5.64873 5.64873 0.5 12 0.5C18.3513 0.5 23.5 5.64873 23.5 12C23.5 18.3513 18.3513 23.5 12 23.5Z"
                fill={`${!checked ? bgColor : checkBgColor}`}
                stroke={`${!checked ? borderColor : checkBorderColor}`}
            />
            <rect x="6" y="6" width="12" height="12" rx="6" fill={`${!checked ? dotColor : checkDotColor}`} />
        </svg>
    )
}

export const ErrorCircleIcon = ({ size }: any) => {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M11.953 2C6.465 2 2 6.486 2 12C2 17.514 6.486 22 12 22C17.514 22 22 17.514 22 12C22 6.486 17.493 2 11.953 2ZM12 20C7.589 20 4 16.411 4 12C4 7.589 7.567 4 11.953 4C16.391 4 20 7.589 20 12C20 16.411 16.411 20 12 20Z"
                fill="#EB2B3E"
            />
            <path d="M11 7H13V14H11V7ZM11 15H13V17H11V15Z" fill="#EB2B3E" />
        </svg>
    )
}

export const ErrorTriggersIcon = () => {
    return (
        <svg width="20" height="20" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask0_1911_3818" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="12" height="12">
                <path
                    d="M8.05 11.5H3.95C3.8 11.5 3.7 11.45 3.6 11.35L0.65 8.4C0.55 8.35 0.5 8.2 0.5 8.05V3.95C0.5 3.8 0.55 3.7 0.65 3.6L3.6 0.65C3.65 0.55 3.8 0.5 3.95 0.5H8.1C8.25 0.5 8.35 0.55 8.45 0.65L11.4 3.6C11.45 3.65 11.5 3.8 11.5 3.95V8.1C11.5 8.25 11.45 8.35 11.35 8.45L8.4 11.4C8.35 11.45 8.2 11.5 8.05 11.5ZM4.15 10.5H7.9L10.55 7.85V4.15L7.85 1.5H4.15L1.5 4.15V7.9L4.15 10.5Z"
                    fill="#DE350B"
                />
                <path d="M6 6.5C5.7 6.5 5.5 6.3 5.5 6V4C5.5 3.7 5.7 3.5 6 3.5C6.3 3.5 6.5 3.7 6.5 4V6C6.5 6.3 6.3 6.5 6 6.5Z" fill="#DE350B" />
                <path
                    d="M6 8.5C5.85 8.5 5.75 8.45 5.65 8.35C5.55 8.25 5.5 8.15 5.5 8C5.5 7.95 5.5 7.85 5.55 7.8C5.6 7.75 5.6 7.7 5.65 7.65C5.8 7.5 6 7.45 6.2 7.55C6.25 7.55 6.25 7.55 6.3 7.6C6.3 7.6 6.35 7.65 6.4 7.65C6.45 7.7 6.5 7.75 6.5 7.8C6.5 7.85 6.5 7.95 6.5 8C6.5 8.05 6.5 8.15 6.45 8.2C6.4 8.25 6.4 8.3 6.35 8.35C6.25 8.45 6.15 8.5 6 8.5Z"
                    fill="#DE350B"
                />
            </mask>
            <g mask="url(#mask0_1911_3818)">
                <rect width="12" height="12" fill="#E5544B" />
            </g>
        </svg>
    )
}

export const StartIcon = ({ size }: any) => {
    return (
        <svg width={size} height={size} viewBox={`0 0 36 36`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0H36V18C36 27.9411 27.9411 36 18 36C8.05888 36 0 27.9411 0 18V0Z" fill="url(#paint0_linear_1019_5325)" />
            <path
                d="M18 8L20.2451 14.9098H27.5106L21.6327 19.1803L23.8779 26.0902L18 21.8197L12.1221 26.0902L14.3673 19.1803L8.48944 14.9098H15.7549L18 8Z"
                fill="white"
            />
            <defs>
                <linearGradient id="paint0_linear_1019_5325" x1="-2.62881e-07" y1="30.6" x2="42.526" y2="29.1823" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#CE0014" />
                    <stop offset="0.458333" stopColor="#E92828" />
                    <stop offset="1" stopColor="#FF5F6D" />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const XMark = () => {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M10.192 0.344238L5.94897 4.58624L1.70697 0.344238L0.292969 1.75824L4.53497 6.00024L0.292969 10.2422L1.70697 11.6562L5.94897 7.41424L10.192 11.6562L11.606 10.2422L7.36397 6.00024L11.606 1.75824L10.192 0.344238Z"
                fill="#22313F"
            />
        </svg>
    )
}

export const Dot = (color: any, className: any) => {
    return (
        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <rect x="0.143066" y="0.143066" width="5.71429" height="5.71429" rx="2.85714" fill={color} />
        </svg>
    )
}

export const Loading = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            style={{ margin: 'auto', background: 'none', display: 'black', shapeRendering: 'auto' }}
            width="200px"
            height="200px"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid"
        >
            <rect x="17.5" y="30" width="15" height="40" fill="#00c8bc">
                <animate
                    attributeName="y"
                    repeatCount="indefinite"
                    dur="1s"
                    calcMode="spline"
                    keyTimes="0;0.5;1"
                    values="18;30;30"
                    keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
                    begin="-0.2s"
                ></animate>
                <animate
                    attributeName="height"
                    repeatCount="indefinite"
                    dur="1s"
                    calcMode="spline"
                    keyTimes="0;0.5;1"
                    values="64;40;40"
                    keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
                    begin="-0.2s"
                ></animate>
            </rect>
            <rect x="42.5" y="30" width="15" height="40" fill="#00c8bc">
                <animate
                    attributeName="y"
                    repeatCount="indefinite"
                    dur="1s"
                    calcMode="spline"
                    keyTimes="0;0.5;1"
                    values="20.999999999999996;30;30"
                    keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
                    begin="-0.1s"
                ></animate>
                <animate
                    attributeName="height"
                    repeatCount="indefinite"
                    dur="1s"
                    calcMode="spline"
                    keyTimes="0;0.5;1"
                    values="58.00000000000001;40;40"
                    keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
                    begin="-0.1s"
                ></animate>
            </rect>
            <rect x="67.5" y="30" width="15" height="40" fill="#00c8bc">
                <animate
                    attributeName="y"
                    repeatCount="indefinite"
                    dur="1s"
                    calcMode="spline"
                    keyTimes="0;0.5;1"
                    values="20.999999999999996;30;30"
                    keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
                ></animate>
                <animate
                    attributeName="height"
                    repeatCount="indefinite"
                    dur="1s"
                    calcMode="spline"
                    keyTimes="0;0.5;1"
                    values="58.00000000000001;40;40"
                    keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
                ></animate>
            </rect>
        </svg>
    )
}

export const BxDollarCircle = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M12 2C6.486 2 2 6.486 2 12C2 17.514 6.486 22 12 22C17.514 22 22 17.514 22 12C22 6.486 17.514 2 12 2ZM12 20C7.589 20 4 16.411 4 12C4 7.589 7.589 4 12 4C16.411 4 20 7.589 20 12C20 16.411 16.411 20 12 20Z"
                fill="#22313F"
            />
            <path
                d="M12 10.9997C10 10.9997 10 10.3737 10 9.99972C10 9.51572 10.701 8.99972 12 8.99972C13.185 8.99972 13.386 9.63772 13.4 10.0177L14.4 9.99972H15.4C15.4 8.97372 14.734 7.53072 13 7.12072V6.01172H11V7.08472C9.029 7.41572 8 8.71172 8 9.99972C8 11.1197 8.52 12.9997 12 12.9997C14 12.9997 14 13.6757 14 13.9997C14 14.4147 13.38 14.9997 12 14.9997C10.159 14.9997 10.011 14.1427 10 13.9997H8C8 14.9177 8.661 16.5527 11 16.9197V17.9997H13V16.9147C14.971 16.5837 16 15.2877 16 13.9997C16 12.8797 15.48 10.9997 12 10.9997Z"
                fill="#22313F"
            />
        </svg>
    )
}

export const BxLineChartDown = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 3H3V21H21V19H5V3Z" fill="#22313F" />
            <path d="M13 12.586L8.70697 8.29297L7.29297 9.70697L13 15.414L16 12.414L20.293 16.707L21.707 15.293L16 9.58597L13 12.586Z" fill="#22313F" />
        </svg>
    )
}

export const BxCaledarCheck = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M19 4H17V2H15V4H9V2H7V4H5C3.897 4 3 4.897 3 6V8V20C3 21.103 3.897 22 5 22H19C20.103 22 21 21.103 21 20V8V6C21 4.897 20.103 4 19 4ZM19.002 20H5V8H19L19.002 20Z"
                fill="#22313F"
            />
            <path d="M11 17.414L16.707 11.707L15.293 10.293L11 14.586L8.70697 12.293L7.29297 13.707L11 17.414Z" fill="#22313F" />
        </svg>
    )
}

export const CopyIcon = ({ size = 12, color = '#B2B7BC' }: IconSvg) => {
    return (
        <svg width={size} height={size} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_2352_5508)">
                <path
                    d="M8 0.5H2C1.45 0.5 1 0.95 1 1.5V8.5H2V1.5H8V0.5ZM9.5 2.5H4C3.45 2.5 3 2.95 3 3.5V10.5C3 11.05 3.45 11.5 4 11.5H9.5C10.05 11.5 10.5 11.05 10.5 10.5V3.5C10.5 2.95 10.05 2.5 9.5 2.5ZM9.5 10.5H4V3.5H9.5V10.5Z"
                    fill={color}
                />
            </g>
            <defs>
                <clipPath id="clip0_2352_5508">
                    <rect width={size} height={size} fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
}

export const DownArrow = ({ size = 12, color = '#000', className = '' }: IconSvg) => {
    return (
        <svg className={className} width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.70703 7.70703L6.00003 3.41403L10.293 7.70703L11.707 6.29303L6.00003 0.586031L0.293031 6.29303L1.70703 7.70703Z" fill="#B2B7BC" />
        </svg>
    )
}

const HistoryIcon = ({ size = 12, color = '#B2B7BC' }: IconSvg) => {
    return (
        <svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M10.8335 0.414062C6.69183 0.414062 3.3335 3.7724 3.3335 7.91406H0.833496L4.07516 11.1557L4.1335 11.2724L7.50016 7.91406H5.00016C5.00016 4.68906 7.6085 2.08073 10.8335 2.08073C14.0585 2.08073 16.6668 4.68906 16.6668 7.91406C16.6668 11.1391 14.0585 13.7474 10.8335 13.7474C9.22516 13.7474 7.76683 13.0891 6.71683 12.0307L5.5335 13.2141C6.89183 14.5724 8.7585 15.4141 10.8335 15.4141C14.9752 15.4141 18.3335 12.0557 18.3335 7.91406C18.3335 3.7724 14.9752 0.414062 10.8335 0.414062ZM10.0002 4.58073V8.7474L13.5418 10.8474L14.1835 9.78073L11.2502 8.03906V4.58073H10.0002Z"
                fill="#EB2B3E"
            />
        </svg>
    )
}

const UserIcon = ({ size = 12, color = '#B2B7BC' }: IconSvg) => {
    return (
        <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M10 2.58081C7.7025 2.58081 5.83333 4.44998 5.83333 6.74748C5.83333 9.04498 7.7025 10.9141 10 10.9141C12.2975 10.9141 14.1667 9.04498 14.1667 6.74748C14.1667 4.44998 12.2975 2.58081 10 2.58081ZM10 9.24748C8.62167 9.24748 7.5 8.12581 7.5 6.74748C7.5 5.36914 8.62167 4.24748 10 4.24748C11.3783 4.24748 12.5 5.36914 12.5 6.74748C12.5 8.12581 11.3783 9.24748 10 9.24748ZM17.5 18.4141V17.5808C17.5 14.365 14.8825 11.7475 11.6667 11.7475H8.33333C5.11667 11.7475 2.5 14.365 2.5 17.5808V18.4141H4.16667V17.5808C4.16667 15.2833 6.03583 13.4141 8.33333 13.4141H11.6667C13.9642 13.4141 15.8333 15.2833 15.8333 17.5808V18.4141H17.5Z"
                fill="#EB2B3E"
            />
        </svg>
    )
}

const EmailIcon = ({ size = 12, color = '#B2B7BC' }: IconSvg) => {
    return (
        <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M15.6665 0.247314H2.33317C1.4165 0.247314 0.674837 0.997314 0.674837 1.91398L0.666504 11.914C0.666504 12.8306 1.4165 13.5806 2.33317 13.5806H15.6665C16.5832 13.5806 17.3332 12.8306 17.3332 11.914V1.91398C17.3332 0.997314 16.5832 0.247314 15.6665 0.247314ZM15.6665 11.914H2.33317V3.58065L8.99984 7.74731L15.6665 3.58065V11.914ZM8.99984 6.08065L2.33317 1.91398H15.6665L8.99984 6.08065Z"
                fill="#EB2B3E"
            />
        </svg>
    )
}

const DisconnectIcon = ({ size = 12, color = '#B2B7BC' }: IconSvg) => (
    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.3332 11.7475V10.0808H5.83317V7.58081L1.6665 10.9141L5.83317 14.2475V11.7475H13.3332Z" fill="#EB2B3E" />
        <path
            d="M16.6667 3.41406H9.16667C8.2475 3.41406 7.5 4.16156 7.5 5.08073V8.41406H9.16667V5.08073H16.6667V16.7474H9.16667V13.4141H7.5V16.7474C7.5 17.6666 8.2475 18.4141 9.16667 18.4141H16.6667C17.5858 18.4141 18.3333 17.6666 18.3333 16.7474V5.08073C18.3333 4.16156 17.5858 3.41406 16.6667 3.41406Z"
            fill="#EB2B3E"
        />
    </svg>
)

const ReplayIcon = ({ size = 24, color = '#EB2B3E' }: IconSvg) => (
    <svg width={size} height={size} viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_3159_9845)">
            <path
                d="M12.5 5V1L7.5 6L12.5 11V7C15.81 7 18.5 9.69 18.5 13C18.5 16.31 15.81 19 12.5 19C9.19 19 6.5 16.31 6.5 13H4.5C4.5 17.42 8.08 21 12.5 21C16.92 21 20.5 17.42 20.5 13C20.5 8.58 16.92 5 12.5 5Z"
                fill={color}
            />
        </g>
        <defs>
            <clipPath id="clip0_3159_9845">
                <rect width={size} height={size} fill="white" transform="translate(0.5)" />
            </clipPath>
        </defs>
    </svg>
)

const TriggerErrorIconCircle = ({ size = 12, color = '#B2B7BC' }: IconSvg) => {
    return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.953 2C6.465 2 2 6.486 2 12C2 17.514 6.486 22 12 22C17.514 22 22 17.514 22 12C22 6.486 17.493 2 11.953 2ZM12 20C7.589 20 4 16.411 4 12C4 7.589 7.567 4 11.953 4C16.391 4 20 7.589 20 12C20 16.411 16.411 20 12 20Z" fill="#EB2B3E"/>
        <path d="M11 7H13V14H11V7ZM11 15H13V17H11V15Z" fill="#EB2B3E"/>
    </svg>
}

export {
    HistoryIcon,
    UserIcon,
    EmailIcon,
    DisconnectIcon,
    TriggerErrorIconCircle,
    ReplayIcon
}
