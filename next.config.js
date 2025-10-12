/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/.well-known/farcaster.json',
        destination: 'https://api.farcaster.xyz/miniapps/hosted-manifest/0199d723-a778-77f2-c001-53f571b66db2',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
