const nextTranslate = require('next-translate');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['image.tmdb.org', 'sun1-19.userapi.com', 'avatars.yandex.net', 'lh3.googleusercontent.com'],
  },
};

module.exports = nextTranslate(nextConfig);
