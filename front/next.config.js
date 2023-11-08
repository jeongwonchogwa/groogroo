/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        // Be as specific as possible to prevent malicious usage.
        // 추후 pathname에 수정이 필요할 수도?
        protocol: "https",
        hostname: "groogroo.s3.ap-northeast-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
