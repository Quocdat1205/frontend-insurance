import Head from 'next/head'

import Config from 'config/config'

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

const socialTags = (props: Meta) => {
    const { url, title, description, image, createdAt, updatedAt } = props
    return [
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:site', content: '@Nami' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:creator', content: '@Nami' },
        { name: 'twitter:image:src', content: image },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'og:title', content: title },
        { name: 'og:url', content: Config.env.APP_URL + url },
        { name: 'og:image', content: image },
        { name: 'og:site_name', content: 'Nami Exchange' },
        { name: 'og:description', content: description },
        { name: 'og:published_time', content: createdAt },
        { name: 'og:modified_time', content: updatedAt },
    ]
}

function Meta(props: Meta) {
    const {
        title = 'Nami Insurance',
        description,
        keywords,
        image,
        icon = '/favicon.png',
    } = props
    return (
        <Head>
            <title>{title}</title>
            <meta key="name" itemProp="name" content={title} />
            <meta key="description" name="description" content={description} />
            <meta key="image" itemProp="image" content={image} />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
            />
            {/* <link rel="manifest" href="/site.webmanifest" key="site-manifest" /> */}
            <link rel="icon" type="image/x-icon" href={icon} />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

            {keywords && (
                <meta key="keywords" name="keywords" content={keywords} />
            )}
            {socialTags(props).map(({ name, content }: Tag) => (
                <meta key={name} name={name} content={content} />
            ))}
        </Head>
    )
}

export default Meta
