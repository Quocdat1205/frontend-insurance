import Head from 'next/head'
import NextHead from 'next/head'
import Config from 'config/config'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'
import { seoConfigs } from 'utils/constants'

interface Meta {
    url?: string
    title?: string
    description?: string
    image?: string
    createdAt?: string
    updatedAt?: string
    icon?: string
    keywords?: string
}

interface Tag {
    name?: string
    content?: string
}

const Seo = ({ icon = '/favicon.png', ...props }: Meta) => {
    const {
        i18n: { language },
    } = useTranslation()
    const router = useRouter()

    const seoConfig = useMemo(() => {
        return seoConfigs.find((config: any) => {
            const regex = new RegExp(config.url)
            return regex.test(router.route)
        })[language]
    }, [language, router])

    return (
        <>
            <NextHead>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" type="image/x-icon" href={icon} />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            </NextHead>
            <Meta {...seoConfig} {...props} />
        </>
    )
}

const Meta = (props: Meta) => {
    const { title = 'Nami Insurance', description, keywords, image = Config.env.APP_URL + '/images/bg_featured.png' } = props

    const socialTags = (props: Meta) => {
        const { url = '', title, description, image = Config.env.APP_URL + '/images/bg_featured.png', createdAt, updatedAt } = props
        return [
            { name: 'twitter:card', content: 'summary' },
            { name: 'twitter:site', content: '@Nami' },
            { name: 'twitter:title', content: title },
            { name: 'twitter:description', content: description },
            { name: 'twitter:creator', content: '@Nami' },
            { name: 'twitter:image', content: image },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'og:title', content: title },
            { name: 'og:url', content: Config.env.APP_URL + url },
            { name: 'og:image', content: image },
            { name: 'og:site_name', content: 'Nami Insurance' },
            { name: 'og:description', content: description },
            { name: 'og:published_time', content: createdAt },
            { name: 'og:modified_time', content: updatedAt },
        ]
    }

    return (
        <Head>
            <title>{title}</title>
            <meta key="name" itemProp="name" content={title} />
            <meta key="description" name="description" content={description} />
            <meta key="image" itemProp="image" content={image} />
            {keywords && <meta key="keywords" name="keywords" content={keywords} />}
            {socialTags(props).map(({ name, content }: Tag) => (
                <meta key={name} name={name} content={content} />
            ))}
        </Head>
    )
}

export default Seo
