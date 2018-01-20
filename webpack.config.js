var HtmlWebpackPlugin = require('html-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var UglifyJsPlugin = require('webpack').optimize.UglifyJsPlugin;

module.exports = env => {
  let config = {
    entry: [
      // set our index.js as the entry point
      './src/index',
    ],
    output: {
      path: __dirname,
      filename: './dist/jquery.filterizr.min.js',
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
        title: "Filterizr revisited",
        template: "demo/index.html",
      }),
      // uglify plugin for JS
      new UglifyJsPlugin(),
    ],
    resolve: {
      extensions: ['.js'],
    }
  }

  if (env === 'analyze')
    config.plugins.push(new BundleAnalyzerPlugin());

  return config;
}
