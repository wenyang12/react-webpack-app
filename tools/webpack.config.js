/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import webpack from 'webpack';
import merge from 'lodash.merge';
import AssetsPlugin from 'assets-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const DEBUG = !process.argv.includes('--release');
const VERBOSE = process.argv.includes('--verbose');
const AUTOPREFIXER_BROWSERS = [
  'Android 2.3',
  'Android >= 4',
  'Chrome >= 35',
  'Firefox >= 31',
  'Explorer >= 9',
  'iOS >= 7',
  'Opera >= 12',
  'Safari >= 7.1',
];
const GLOBALS = {
  'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
  __DEV__: DEBUG,
};


// get production environment:fte fte2 www
var args = process.argv;
var envArg = args.find(function(arg) {
    return arg.indexOf('--env') >= 0;   // --fsceshi
});

const ENV = (envArg && envArg.split('=')[1]) || 'www';
const APP = 'ithelpdesk';
const BUILD = 'build';
const PUBLICPATH = `//${ENV}.fspage.com/h5/${APP}/${BUILD}/`;

//
// Common configuration chunk to be used for both
// client-side (index.js) and server-side (server.js) bundles
// -----------------------------------------------------------------------------

const config = {
  output: {
    publicPath: DEBUG ? '/' : PUBLICPATH,
    sourcePrefix: '  ',
  },

  cache: DEBUG,
  debug: DEBUG,

  stats: {
    colors: true,
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE,
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
  ],

  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.json']
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, '../node_modules/react-routing/src'),
          path.resolve(__dirname, '../src'),
        ],
        loader: 'babel-loader',
      },
      DEBUG ?
      {
        test: /\.less$/,
        loaders: [
          'style-loader',
          'css-loader?' + (DEBUG ? 'sourceMap&' : 'minimize&') +
          'localIdentName=[name]_[local]_[hash:base64:3]',
          'postcss-loader',
          'less-loader',
        ],
      } : {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style-loader', [
          'css-loader?' + (DEBUG ? 'sourceMap&' : 'minimize&') +
          'localIdentName=[name]_[local]_[hash:base64:3]',
          'postcss-loader',
          'less-loader?compress=false',
        ].join('!')),
      },
      {
        test: /\.scss$/,
        loaders: [
          'isomorphic-style-loader',
          'css-loader?' + (DEBUG ? 'sourceMap&' : 'minimize&') +
          'modules&localIdentName=[name]_[local]_[hash:base64:3]',
          'postcss-loader',
        ],
      }, {
        test: /\.json$/,
        loader: 'json-loader',
      }, {
        test: /\.txt$/,
        loader: 'raw-loader',
      }, {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url-loader?limit=20000',
      }, {
        test: /\.(eot|ttf|wav|mp3)$/,
        loader: 'file-loader',
      },
    ],
  },

  postcss: function plugins(bundler) {
    return [
      require('postcss-px2rem')({ remUnit: 75 }),
      require('postcss-import')({ addDependencyTo: bundler }),
      require('precss')(),
      require('autoprefixer')({ browsers: AUTOPREFIXER_BROWSERS }),
    ];
  },
};


// 生成manifest.appcache插件
function AppCachePlugin(options) {
    options = options || {};
    this.cache = options.cache;
    this.network = options.network || ['*'];
    this.fallback = options.fallback;
    this.output = options.output || 'manifest.appcache';
}
AppCachePlugin.prototype.apply = function(compiler) {
    var that = this;
    var publicPath = (compiler.options.output || {}).publicPath || '';
    compiler.plugin('emit', function(compilation, callback) {
        var assets = [];

        for (var asset in compilation.assets) {
            assets.push(publicPath + encodeURI(asset));
        }

        var getDate = function() {
            var now = new Date();
            var getValue = function(value) {
                return value < 10 ? '0' + value : value;
            };
            var part1 = [now.getFullYear(), getValue(now.getMonth() + 1), getValue(now.getDate())].join('-');
            var part2 = [getValue(now.getHours()), getValue(now.getMinutes()), getValue(now.getSeconds())].join(':');
            return part1 + ' ' + part2;
        };

        var comment = compilation.hash + ' ' + getDate();
        var getManifestBody = function() {
            return [assets.join('\n') + '\n', 
                that.cache && that.cache.length ? 'CACHE:\n' + that.cache.join('\n') + '\n' : null,
                that.network && that.network.length ? 'NETWORK:\n' + that.network.join('\n') + '\n' : null,
                that.fallback && that.fallback.length ? 'FALLBACK:\n' + that.fallback.join('\n') + '\n' : null
            ].filter(function(v) {
                return v && v.length;
            }).join('\n');
        };

        compilation.assets[that.output] = {
            size: function() {
                return Buffer.byteLength(this.source(), 'utf8');
            },
            source: function() {
                return ['CACHE MANIFEST', '# ' + comment, '', getManifestBody()].join('\n');
            }
        }
        callback();
    });
};

//
// Configuration for the client-side bundle (index.js)
// -----------------------------------------------------------------------------

const clientConfig = merge({}, config, {
  entry: {
    main: ['./src/Index.js']
  },
  output: {
    path: path.join(__dirname, '../build'),
    filename: DEBUG ? '[name].js?[hash]' : '[name].[hash].js',
  },

  // Choose a developer tool to enhance debugging
  // http://webpack.github.io/docs/configuration.html#devtool
  devtool: DEBUG ? 'cheap-module-eval-source-map' : false,
  plugins: [
    new ExtractTextPlugin(DEBUG ? '[name].css?[contenthash]' : '[name].[contenthash].css'),
    new HtmlWebpackPlugin({
      title: 'IT服务助手',
      template: 'entries/index.html',
      inject: 'body',
      filename: 'index.html',
      jsapi: '//www.fxiaoke.com/open/jsapi/1.0.0/jsapi.min.js',
      files: {
        adaptiveScrtipt: [(DEBUG ? '' : PUBLICPATH) + 'adaptor.js'],
      },
      chunks: ['main'],
    }),
    new webpack.DefinePlugin(GLOBALS),
    new AppCachePlugin({
      output: 'manifest.appcache'
    }),
    ...(!DEBUG ? [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        compress: {
          screw_ie8: true,
          warnings: VERBOSE
        },
        output: {
          comments: false
        }
      }),
      new webpack.optimize.AggressiveMergingPlugin(),
    ] : [
      new AssetsPlugin({
        path: path.join(__dirname, '../build/public'),
        filename: 'assets.js',
        processOutput: x => `module.exports = ${JSON.stringify(x)};`,
      }),
    ]),
  ],
});

//
// Configuration for the server-side bundle (server.js)
// -----------------------------------------------------------------------------

const serverConfig = merge({}, config, {
  entry: './src/server.js',
  output: {
    path: './build/public',
    filename: 'server.js',
    libraryTarget: 'commonjs2',
  },
  target: 'node',
  externals: [
    /^\.\/assets$/,
    function filter(context, request, cb) {
      const isExternal =
        request.match(/^[@a-z][a-z\/\.\-0-9]*$/i) &&
        !request.match(/^react-routing/) &&
        !context.match(/[\\/]react-routing/);
      cb(null, Boolean(isExternal));
    },
  ],
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin(GLOBALS),
    new webpack.BannerPlugin('require("source-map-support").install();',
      { raw: true, entryOnly: false }),
  ],
});

export default [clientConfig, serverConfig];
