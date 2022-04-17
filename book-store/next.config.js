/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    apiServer: "http://localhost:5500"
  }
}

module.exports = nextConfig
