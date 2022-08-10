import Link from 'next/link';
import Button from 'components/common/Button/Button';
import {CarretDown} from 'components/common/Svg/SvgIcon';
import SwapLanguageBtn from 'components/screens/LandingPage/SwapLanguageBtn';
import useLanguage from 'hooks/useLanguage';
import useWeb3Wallet from 'hooks/useWeb3Wallet';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { loginAction } from 'redux/auth/authActions';

const Header = () => {
    const [currentLocale, onChangeLang] = useLanguage();
    const wallet = useWeb3Wallet();
    const dispatch = useAppDispatch();
    const token = useAppSelector((state) => state.auth);
    const { account: walletAddress, activate, connector, contractCaller } = wallet;
    // console.log(contractCaller);
    function handleConnectWallet() {
        activate('metaMask');
    }

    async function handleLogin() {
        dispatch(loginAction({ walletAddress, contractCaller }));
    }

    function renderBtnLogin() {
        if (walletAddress)
            return (
                <div className="flex items-center gap-2 bg-white3 px-1 py-2 rounded-[5px]">
                    <img src="/images/cryptocurrency.png" className="w-6 h-6" />
                    <div className="text-sm leading-[14px] font-semibold">{connector?.name}</div>
                    <div className="text-sm leading-[14px] font-semibold px-4 py-1 bg-white rounded-[5px]">
                        {`${walletAddress.slice(0, 5)}...${walletAddress.slice(-4)}`}
                    </div>
                </div>
            );
        else
            return (
                <Button
                    variants="gradient"
                    className="text-sm leading-[14px] w-[107px] h-[38px]"
                    onClick={handleConnectWallet}
                >
                    ketnoivi
                </Button>
            );
    }
    return (
        <header className="flex items-center justify-between px-3 md:px-10 h-[70px] border-b border-divider">
            <div className="flex items-center">
                <img src="/images/logo_insurance.png" className="w-[75px] h-[36px]" alt="logo" />
                <div className="items-center font-medium gap-6 ml-12 hidden md:flex">
                    <Link href="#">
                        <div className="text-sm leading-[14px] font-medium">Trang chủ</div>
                    </Link>
                    <div className="flex items-center text-sm leading-[14px] font-medium">
                        Mua bảo hiểm
                        <CarretDown className="ml-[14px]" />
                    </div>
                </div>
            </div>
            <div className="hidden md:flex items-center gap-6 h-full">
                <SwapLanguageBtn />
                {renderBtnLogin()}
            </div>
        </header>
    );
};

export default Header;
