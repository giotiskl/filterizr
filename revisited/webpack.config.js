var HtmlWebpackPlugin = require('html-webpack-plugin');
var ProvidePlugin = require('webpack').ProvidePlugin;
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var UglifyJsPlugin = require('webpack').optimize.UglifyJsPlugin;

module.exports = {
  entry: [
    // set our app.js as the entry point
    './app/index',
  ],
  output: {
    path: __dirname,
    filename: './dist/filterizr.min.js',
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
      template: "showcase/index.html",
    }),
    // uglify plugin for JS
    new UglifyJsPlugin(),
    new BundleAnalyzerPlugin(),
  ],
  resolve: {
    extensions: ['.js'],
  }
}
