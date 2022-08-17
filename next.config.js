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
    reactStrictMode: false,
    i18n,
    eslint: {
        ignoreDuringBuilds: true,
    },
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    // images: {
    //   domains: [
    //     'test.nami.exchange',
    //     'static.namifutures.com',
    //     'sgp1.digitaloceanspaces.com',
    //     'nami.io',
    //     'datav2.nami.exchange',
    //   ],
    // },
    distDir: process.env.BUILD_DIR || 'build',
})
module.exports = nextConfig
