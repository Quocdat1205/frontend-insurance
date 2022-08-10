import React from 'react';
import useLanguage from 'hooks/useLanguage';
import { LANGUAGE_TAG } from 'utils/constants';

type Props = {};

export default function SwapLanguageBtn({}: Props) {
    const [currentLocale, onChangeLang] = useLanguage();
    const renderLanguageBtn = (language) => {
        if (currentLocale === language)
            return (
                <div className="text-sm font-medium p-[6px] leading-4 rounded uppercase bg-gradient text-white">
                    {language}
                </div>
            );
        else return <div className="text-sm font-medium mx-[6px] uppercase">{language}</div>;
    };
    return (
        <div
            className="flex items-center border border-redPrimary p-1 rounded-[3px] gap-1 cursor-pointer"
            onClick={onChangeLang as React.MouseEventHandler<HTMLDivElement>}
        >
            {renderLanguageBtn(LANGUAGE_TAG.VI)}
            {renderLanguageBtn(LANGUAGE_TAG.EN)}
        </div>
    );
}
