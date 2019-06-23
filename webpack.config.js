const path = require('path');

const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
};

module.exports = (env = {}) => {
  const IS_DEVELOPMENT = env.env === ENVIRONMENTS.DEVELOPMENT;
  const IS_BUILDING_VANILLA_VAR_VERSION = env.buildTarget === 'vanilla-var';
  const mode = IS_DEVELOPMENT
    ? ENVIRONMENTS.DEVELOPMENT
    : ENVIRONMENTS.PRODUCTION;

  const libraryTarget =
    IS_DEVELOPMENT || IS_BUILDING_VANILLA_VAR_VERSION ? 'var' : 'commonjs';

  const outputFileName = IS_BUILDING_VANILLA_VAR_VERSION
    ? 'vanilla.filterizr.min.js'
    : '[name].min.js';

  return {
    entry: {
      filterizr: './src/index.ts',
      'jquery.filterizr': './src/index.jquery.ts',
      ...(IS_BUILDING_VANILLA_VAR_VERSION && {
        'vanilla.filterizr': './src/index.ts',
      }),
    },
    ...(IS_DEVELOPMENT && {
      devtool: 'inline-source-map',
      devServer: {
        clientLogLevel: 'debug',
        contentBase: path.join(__dirname, 'demo'),
        inline: true,
        hot: true,
        open: true,
        progress: true,
      },
    }),
    mode,
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].min.js',
      library: 'Filterizr',
      libraryTarget,
      libraryExport: 'default',
    },
  };
};
