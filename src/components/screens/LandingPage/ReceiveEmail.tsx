import React, { useState } from 'react';
import Button from 'components/common/Button/Button';
import * as yup from 'yup';
import fetchApi from 'services/fetch-api';
import { API_SUBCRIBE } from 'services/api';

type Props = {};

export default function ReceiveEmail({ }: Props) {
    const [email, setEmail] = useState('');
    const [errMessage, setErrMessage] = useState('');

    // const emailSchemaValidate = yup.string().email();

    async function handleSubmit() {
        // try {
        //     await emailSchemaValidate.validate(email);
        //     const res = await fetchApi({
        //         url: API_SUBCRIBE,
        //         options: {
        //             method: 'POST'
        //         },
        //         params: {
        //             email
        //         }
        //     });
        //     console.log(res);
        // } catch (error) {
        //     setErrMessage(error.errors);
        // }
    }

    return (
        <section
            id="ReceiveEmail"
            className="bg_recieve_email w-full max-w-[1062px] mx-auto h-[320px] flex flex-col justify-center items-center ins_container"
        >
            <div className="text-5xl leading-10 text-redPrimary mb-2 font-medium">
                Nhận thông báo
            </div>
            <div className="mb-6 text-center">
                Trở thành người đầu tiên nhận được các tin tức và sự kiện quan trọng.
            </div>
            <div className="flex items-center gap-2 border border-divider rounded-[3px] py-2 px-3 w-full md:w-[500px] bg-white">
                <input
                    className="flex-1"
                    type="text"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                    placeholder="Nhập địa chỉ email"
                />
                <Button
                    variants="gradient"
                    className="text-sm w-[135px] h-[38px] hidden sm:block"
                    onClick={handleSubmit}
                >
                    Đăng ký ngay
                </Button>
            </div>
            <Button
                variants="gradient"
                className="text-sm w-[135px] h-[38px] sm:hidden mt-4"
                onClick={handleSubmit}
            >
                Đăng ký ngay
            </Button>
            {errMessage && <div>{errMessage}</div>}
        </section>
    );
}
