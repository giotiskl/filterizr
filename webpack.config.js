const path = require('path');

const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
};

module.exports = (env = {}) => {
  const IS_DEVELOPMENT = env.env === ENVIRONMENTS.DEVELOPMENT;
  const IS_BUILDING_VAR_VERSIONS = env.buildTarget === 'var';
  const mode = IS_DEVELOPMENT
    ? ENVIRONMENTS.DEVELOPMENT
    : ENVIRONMENTS.PRODUCTION;

  const library = IS_DEVELOPMENT || IS_BUILDING_VAR_VERSIONS ? 'Filterizr' : '';
  const libraryTarget =
    IS_DEVELOPMENT || IS_BUILDING_VAR_VERSIONS ? 'var' : 'umd';

  return {
    entry: {
      ...((!IS_BUILDING_VAR_VERSIONS || IS_DEVELOPMENT) && {
        filterizr: './src/index.ts',
      }),
      ...((IS_BUILDING_VAR_VERSIONS || IS_DEVELOPMENT) && {
        'jquery.filterizr': './src/index.jquery.ts',
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
      library,
      libraryTarget,
      libraryExport: 'default',
    },
  };
};
