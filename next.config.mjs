/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos'
      },
      {
        protocol: 'https',
        hostname: 's4.anilist.co'
      },
      {
        protocol: 'https',
        hostname: 's3.anilist.co'
      },
      {
        protocol: 'https',
        hostname: 's2.anilist.co'
      },
      {
        protocol: 'https',
        hostname: 's1.anilist.co'
      }
    ]
  }
};

export default nextConfig;


