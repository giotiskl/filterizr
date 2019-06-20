const path = require('path');

const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
};

module.exports = (env = {}) => {
  const IS_DEVELOPMENT = env.env === ENVIRONMENTS.DEVELOPMENT;
  const mode = IS_DEVELOPMENT
    ? ENVIRONMENTS.DEVELOPMENT
    : ENVIRONMENTS.PRODUCTION;
  const libraryTarget = IS_DEVELOPMENT ? 'var' : 'commonjs';

  return {
    entry: {
      filterizr: './src/index.ts',
      demo: './src/demoInit.js',
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
      library: 'filterizr',
      libraryTarget,
    },
  };
};
