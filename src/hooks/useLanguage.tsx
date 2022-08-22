import { useRouter } from 'next/router'

export const LANGUAGE_TAG = {
    VI: 'vi',
    EN: 'en',
}

const useLanguage = () => {
    const router = useRouter()
    const { locale: currentLocale } = router
    // Language toggle
    const onChangeLang = () => {
        const nextLang =
            currentLocale === LANGUAGE_TAG.VI
                ? LANGUAGE_TAG.EN
                : LANGUAGE_TAG.VI
        localStorage.setItem('local_lang', nextLang)
        router.push(router.asPath, router.asPath, { locale: nextLang })
    }

    return { currentLocale, onChangeLang }
}

export default useLanguage
