// /** @type {import('next').NextConfig} */
const path = require('path')

const { ANALYZE } = process.env

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: ANALYZE === 'true',
})
const withPlugins = require('next-compose-plugins')
const withFonts = require('next-fonts')

const { i18n } = require('./next-i18next.config')

const nextConfig = withPlugins([[withBundleAnalyzer], [withFonts]], {
    dimensions: false,
    reactStrictMode: false,
    i18n,
    eslint: {
        ignoreDuringBuilds: true,
    },
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    images: {
        domains: ['blog.nami.today', 'datav2.nami.exchange'],
    },
    distDir: process.env.BUILD_DIR || 'build',
    styledComponents: true,
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ['@svgr/webpack'],
        })

        return config
    },
})
module.exports = nextConfig
