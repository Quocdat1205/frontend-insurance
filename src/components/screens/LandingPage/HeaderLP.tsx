import Link from 'next/link';
import Button from 'components/common/Button/Button';
import { RightArrow } from 'components/common/Svg/SvgIcon';
import SwapLanguageBtn from 'components/screens/LandingPage/SwapLanguageBtn';
import useLanguage from 'hooks/useLanguage';
import useWeb3Wallet from 'hooks/useWeb3Wallet';

const HeaderLP = () => {
    const [currentLocale, onChangeLang] = useLanguage();
    const wallet = useWeb3Wallet();
    const { account, activate } = wallet;
    function handleConnectWallet() {
        activate('metaMask');
    }

    return (
        <header className="flex items-center justify-between px-3 md:px-10 h-[70px] border-b border-divider">
            <div className="flex items-center">
                <Link href="/">
                    <img
                        src="/images/logo_insurance.png"
                        className="w-[75px] h-[36px]"
                        alt="logo"
                    />
                </Link>
            </div>
            <div className="hidden md:flex items-center gap-6 h-full">
                <div className="items-center font-medium gap-6 ml-12 hidden md:flex">
                    <Link href="#" className="text-sm leading-[14px] font-medium">
                        White paper
                    </Link>
                    <Link href="#" className="flex items-center text-sm leading-[14px] font-medium">
                        FAQ
                    </Link>
                    <Link href="#" className="flex items-center text-sm leading-[14px] font-medium">
                        Contact
                    </Link>
                </div>
                <SwapLanguageBtn />
                <Button
                    variants="gradient"
                    className="text-sm leading-[14px] py-[13px] px-6 gap-2"
                    onClick={handleConnectWallet}
                >
                    Truy cập ứng dụng
                    <RightArrow />
                </Button>
            </div>
        </header>
    );
};

export default HeaderLP;
