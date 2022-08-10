import Link from 'next/link';
import React from 'react';
import ReceiveEmail from './ReceiveEmail';

type Props = {};

export default function Footer({}: Props) {
    // const renderItemsFooter = () => {

    // }
    return (
        <footer>
            <div className="my-[120px]">
                <ReceiveEmail />
            </div>

            <div className="bg_footer items-center justify-center gap-8 h-[134px] hidden md:flex ">
                <div className="text-[1.25rem] font-medium text-white">
                    Sản phẩm được bảo trợ bởi
                </div>
                <div className="flex">
                    <img className="!h-[68px]" src="/images/logo_foundation.png" alt="logo" />
                </div>
            </div>
            <div className="py-12 bg-white2 px-3 sm:px-10 flex flex-col gap-6">
                <div className="flex flex-col justify-between items-start lg:items-center lg:flex-row">
                    <img src="/images/logo_insurance.png" alt="logo" className="mb-6" />
                    <div className="block lg:flex items-center gap-8">
                        {itemFooter.map((menu, index) => (
                            <div key={index}>
                                <p className="font-medium">{menu.title}</p>
                                <div className="flex items-center gap-4">
                                    {menu.items.map((submenu, subIndex) => (
                                        <Link key={subIndex} href={submenu.url}>
                                            <div className="text-txtSecondary mt-2">
                                                {submenu.title}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="border border-divider"></div>
                <div className="text-xs leading-3 text-txtSecondary">
                    Copyright © 2021 UI8 LLC. All rights reserved
                </div>
            </div>
        </footer>
    );
}
const itemFooter = [
    {
        title: 'Tính năng',
        items: [
            {
                title: 'Mua bảo hiểm',
                url: '#'
            },
            {
                title: 'Mua nain',
                url: '#'
            }
        ]
    },
    {
        title: 'Tài liệu',
        items: [
            {
                title: 'White paper',
                url: '#'
            },
            {
                title: 'Câu hỏi thường gặp',
                url: '#'
            },
            {
                title: 'Điều khoản sử dụng',
                url: '#'
            }
        ]
    }
];
