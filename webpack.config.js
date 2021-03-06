const HtmlWebpackPlugin = require('html-webpack-plugin'); // Require  html-webpack-plugin plugin
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
require('dotenv').config();
// const DashboardPlugin = require('webpack-dashboard/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const ENV = process.env.APP_ENV;
const isTest = ENV === 'test'
const isProd = ENV === 'prod';

function setDevTool() { // function to set dev-tool depending on environment
    if (isTest) {
      return 'inline-source-map';
    } else if (isProd) {
      return 'source-map';
    } else {
      return 'eval-source-map';
    }
}

const config = {
  entry: __dirname + "/src/app/index.js", // webpack entry point. Module to start building dependency graph
  output: {
    path: __dirname + '/dist', // Folder to store generated bundle
    filename: 'bundle.js',  // Name of generated bundle after build
    publicPath: '/', // public URL of the output directory when referenced in a browser
    pathinfo: true
  },
  devtool: setDevTool(), //Set the devtool
  module: {
      rules: [
          {
            test: /\.js$/,
            use: 'babel-loader',
            exclude: [
              /node_modules/
            ]
        },
          {
              test: /\.html/,
              loader: 'raw-loader'
          },
          {
            test: /\.(sass|scss)$/,
            use: [{
                loader: "style-loader" // creates style nodes from JS strings
            }, {
                loader: "css-loader" // translates CSS into CommonJS
            }, {
                loader: "sass-loader" // compiles Sass to CSS
            }]
          }
      ]
  },
  plugins: [  // Array of plugins to apply to build chunk
      new HtmlWebpackPlugin({
          template: __dirname + "/src/public/index.html",
          inject: 'body'
      }),
      new ExtractTextPlugin("styles.css"), // extract css to a separate file called styles.css
      new webpack.DefinePlugin({
          API_KEY: JSON.stringify(process.env.API_KEY),
          APP_ENV: JSON.stringify(process.env.APP_ENV)
      }),
      // new DashboardPlugin()
  ],
  devServer: {  // configuration for webpack-dev-server
      contentBase: './src/public',  //source of static assets
      port: 7700, // port to run dev-server
  }
};

// Minify and copy assets in production
if(isProd) { // plugins to use in a production environment
    config.plugins.push(
        new UglifyJSPlugin(), // minify the chunk
        new CopyWebpackPlugin([{ // copy assets to public folder
          from: __dirname + '/src/public'
      }])
    );
};

module.exports = config;
