// /** @type {import('next').NextConfig} */
const withPlugins = require('next-compose-plugins');
const { i18n } = require('./next-i18next.config');
const withFonts = require('next-fonts');
const { ANALYZE } = process.env;
const path = require('path');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: ANALYZE === 'true',
});

const nextConfig = withPlugins([
  [withBundleAnalyzer],
  [withFonts],
], {
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
});
module.exports = nextConfig

