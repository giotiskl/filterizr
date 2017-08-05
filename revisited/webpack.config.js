var HtmlWebpackPlugin = require('html-webpack-plugin');
var ProvidePlugin = require('webpack').ProvidePlugin;

module.exports = {
  entry: [
    // set our app.js as the entry point
    './app/index',
  ],
  output: {
    path: __dirname,
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      // JavaScript loader
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        // run JS through Babel
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015'],
          }
        }
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Filterizr revisited",
      template: "showcase/index.html",
    }),
    new ProvidePlugin({
      // extracts jquery into the global namespace
      // under $/jQuery variable names
      $: 'jquery',
      jQuery: 'jquery',
    }),
  ],
  resolve: {
    extensions: ['.js'],
  }
}
