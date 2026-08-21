import { NextConfig } from "next";

import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "atiabzar.s3.ir-thr-at1.arvanstorage.ir",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "atihooshbonyanco.s3.ir-thr-at1.arvanstorage.ir",
        pathname: "/**",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
