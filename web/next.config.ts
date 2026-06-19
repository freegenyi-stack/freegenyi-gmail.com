import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { DefinePlugin } from "webpack";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const interactiveServer = (process.env.H5P_SERVER_URL || "http://127.0.0.1:8088")
  .replace(/\/$/, "")
  .replace(/^http:\/\/localhost(?=[:/]|$)/i, "http://127.0.0.1");

const gluestackPackages = [
  "@gluestack-ui/themed",
  "@gluestack-ui/config",
  "@gluestack-ui/accordion",
  "@gluestack-ui/actionsheet",
  "@gluestack-ui/alert",
  "@gluestack-ui/alert-dialog",
  "@gluestack-ui/avatar",
  "@gluestack-ui/button",
  "@gluestack-ui/checkbox",
  "@gluestack-ui/divider",
  "@gluestack-ui/fab",
  "@gluestack-ui/form-control",
  "@gluestack-ui/hooks",
  "@gluestack-ui/icon",
  "@gluestack-ui/image",
  "@gluestack-ui/input",
  "@gluestack-ui/link",
  "@gluestack-ui/menu",
  "@gluestack-ui/modal",
  "@gluestack-ui/overlay",
  "@gluestack-ui/popover",
  "@gluestack-ui/pressable",
  "@gluestack-ui/progress",
  "@gluestack-ui/provider",
  "@gluestack-ui/radio",
  "@gluestack-ui/react-native-aria",
  "@gluestack-ui/select",
  "@gluestack-ui/slider",
  "@gluestack-ui/spinner",
  "@gluestack-ui/switch",
  "@gluestack-ui/tabs",
  "@gluestack-ui/textarea",
  "@gluestack-ui/toast",
  "@gluestack-ui/tooltip",
  "@gluestack-ui/transitions",
  "@gluestack-ui/utils",
  "@gluestack-style/react",
  "@gluestack-style/animation-resolver",
  "@gluestack-style/legend-motion-animation-driver",
  "@expo/html-elements",
  "react-native",
  "react-native-web",
  "react-native-svg",
];

const nextConfig: NextConfig = {
  /** pdfkit charge ses métriques AFM via __dirname — ne pas bundler côté serveur */
  serverExternalPackages: ["pdfkit", "fontkit", "linebreak", "png-js"],
  async rewrites() {
    return [
      {
        source: "/ix/:path*",
        destination: `${interactiveServer}/ix/:path*`,
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: [
    "@edrlab/thorium-web",
    "@readium/navigator",
    "@readium/shared",
    "@readium/css",
    "@readium/navigator-html-injectables",
    "openpolotno",
    "@excalidraw/excalidraw",
    ...gluestackPackages,
  ],
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "react-native$": "react-native-web",
    };
    config.resolve.extensions = [
      ".web.js",
      ".web.jsx",
      ".web.ts",
      ".web.tsx",
      ...config.resolve.extensions,
    ];
    config.plugins.push(
      new DefinePlugin({
        __DEV__: JSON.stringify(process.env.NODE_ENV !== "production"),
      })
    );
    return config;
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "12mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      }
    ],
  },
};

export default withNextIntl(nextConfig);
