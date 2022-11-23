const nextTranslate = require('next-translate');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['image.tmdb.org', 'sun1-19.userapi.com', 'avatars.yandex.net', 'lh3.googleusercontent.com'],
    deviceSizes: [320, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    unoptimized: true,
  },
};

module.exports = nextTranslate(nextConfig);
