var HtmlWebpackPlugin = require('html-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var UglifyJsPlugin = require('webpack').optimize.UglifyJsPlugin;
var DefinePlugin = require('webpack').DefinePlugin;

module.exports = env => {
  const withjquery = env.withjquery;
  env = env.env;

  let config = {
    entry: [
      // set our index.js as the entry point
      './src/index',
    ],
    output: {
      path: __dirname,
      filename: `./dist/jquery.filterizr${withjquery === 'true' ? '-with-jquery' : ''}.min.js`,
    },
    module: {
      loaders: [
        // JavaScript loader
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          // run JS through Babel
          use: {
            loader: 'babel-loader'
          }
        },
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: `Filterizr demo - ${withjquery === 'true' ? 'with' : 'without'} jQuery in bundle`,
        template: `demo/index${withjquery === 'true' ? '' : '-without-jquery-in-bundle'}.html`,
      }),
      // uglify plugin for JS
      new UglifyJsPlugin(),
      // Expose whether jQuery should be imported or not
      new DefinePlugin({
        FILTERIZR_ENV: JSON.stringify(env),
        IMPORT_JQUERY: JSON.stringify(withjquery === 'true'),
      }),
    ],
    resolve: {
      extensions: ['.js'],
    }
  }

  if (env === 'analyze') {
    // When the env is analyze, generate bundle analysis
    config.plugins.push(new BundleAnalyzerPlugin());
  }

  return config;
}
