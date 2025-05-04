
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      { // Add nolatech.ai for logo and background images
        protocol: 'https',
        hostname: 'nolatech.ai',
        port: '',
        pathname: '/assets/img/**',
      },
    ],
  },
};

export default nextConfig;
