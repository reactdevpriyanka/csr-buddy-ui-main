/* eslint-disable unicorn/prefer-module */
module.exports = {
  basePath: '/app',
  productionBrowserSourceMaps: true,
  publicRuntimeConfig: {
    appVersion: process.env.APP_VERSION,
    chewyEnv: process.env.CHEWY_ENV,
    sfwUrl: process.env.SFW_URL,
  },
  webpack(config, { buildId, dev, isServer, defaultLoaders, webpack }) {
    const { module } = config;
    // Use "inline-react-svg" plugin to inline SVGs
    module.rules.push(
      {
        test: /\.svg$/,
        use: ["svg-react-loader"],
      },
      {
        test: /\.csv$/,
        loader: 'csv-loader',
        options: {
          dynamicTyping: true,
          header: true,
          skipEmptyLines: true,
        },
      }
    );
    return config;
  }
};
