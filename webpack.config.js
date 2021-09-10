const Webpack = require('webpack');
const Path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InjectHtmlPlugin = require('inject-html-webpack-plugin');
const config = require('./config.json');
const spnode = require("sp-pnp-node");
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');

const isProduction = process.argv.indexOf('-p') >= 0;

var appconfig = require('./config/app.json')
const isTest = appconfig.isTest;
const subfolder = appconfig.folder;
const appdir = subfolder


const siteUrl = isTest ? appconfig.devUrl : appconfig.url;

const outPath = Path.join(__dirname, `./dist/${subfolder}`);
const sourcePath = Path.join(__dirname, './src');



module.exports = {
  context: sourcePath,
  optimization: {
    splitChunks: {
      name: false,
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: -10
        }
      }
    },
    runtimeChunk: true
  },
  entry: {
    // main:'./admin.tsx',
    cer:'./cer.tsx',
    // admin:'admin.tsx',
    vendor: [
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'redux',
      'es6-promise',
      'whatwg-fetch',
      'jquery',
      'bootstrap-loader',
      'bootstrap',
      // 'office-ui-fabric-react',
      'react-select',
      'canvas-datagrid'
    ],
  
  },
  output: {
    path: outPath,
    publicPath:`${siteUrl}/SiteAssets/${appdir}`,
    filename: '[chunkhash].bundle.js',
  },
  target: 'web',
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    // Fix webpack's default behavior to not load packages with jsnext:main module
    // https://github.com/Microsoft/TypeScript/issues/11677
    mainFields: ['browser', 'main']
  },
  module: {
    rules: [
      // .ts, .tsx
      {
        test: /\.tsx?$/,
        // use: isProduction ?
        //   'awesome-typescript-loader?module=es6' : [
        //     'react-hot-loader/webpack',
        //     'awesome-typescript-loader'
        //   ]
        use:  [
            'react-hot-loader/webpack',
            'awesome-typescript-loader'
          ]
      },
      // css
      // css
      {
        test: /\.css$/,
        use: [
          // isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'style-loader',
          {
            loader: 'css-loader',
            query: {
              modules: true,
              sourceMap: !isProduction,
              importLoaders: 1,
              localIdentName: isProduction ? '[hash:base64:5]' : '[local]__[hash:base64:5]'
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                require('postcss-import')({
                  addDependencyTo: Webpack
                }),
                require('postcss-url')(),
                require('postcss-cssnext')(),
                require('postcss-reporter')(),
                require('postcss-browser-reporter')({
                  disabled: isProduction
                })
              ]
            }
          }
        ]
      },
      {
        test: /\.html$/,
        // use: 'html-loader'
        use: [ {
          loader: 'html-loader',
          options: {
            minimize: false
          }
        }]
      },
      {
        test: /\.png$/,
        use: 'url-loader?limit=10000'
      },
      {
        test: /\.jpg$/,
        use: 'file-loader'
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'postcss', 'sass']
      },
      {
        test: /bootstrap\/dist\/js\/umd\//,
        loader: 'imports?jQuery=jquery'
      }
    ],
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': isProduction === true ? JSON.stringify('production') : JSON.stringify('development')
    }),
    new WebpackCleanupPlugin(),
    // new Webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   filename: 'vendor.bundle.js',
    //   minChunks: Infinity
    // }),
    new Webpack.optimize.AggressiveMergingPlugin(),
    // new ExtractTextPlugin({
    //   filename: 'styles.css',
    //   disable: !isProduction
    // }),
    new MiniCssExtractPlugin({
      filename: '[contenthash].css',
      // disable: !isProduction
      disable:true
    }),
    new HtmlWebpackPlugin({
      chunks:["cer","vendor"],
      minify:false,
      inject: 'body',
      template: './template/cer.html', //if main
      filename: 'CER.aspx' //only
    }),
    new HtmlWebpackPlugin({
      chunks:["main","vendor"],
      minify:false,
      // minify:{
      //   collapseWhitespace: false,
      //   removeComments: false,
      //   removeRedundantAttributes: false,
      //   removeScriptTypeAttributes: false,
      //   removeStyleLinkTypeAttributes: false,
      //   useShortDoctype: false
      // },
      inject: 'body',
      // template: require('html-webpack-template'),

      template: './template/main.html', //if main
      filename: 'AdminApp.aspx' //only
      // template:'./template/ptc.html',
      // filename:'ptcnext.html'
      // template: './template/homepage.html',
      // filename: 'homepage.html'

      // inject: 'body'
    }),
    new ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery'
    })
  ],
  devServer: {
    contentBase: sourcePath,
    hot: true,
    inline: true,
    historyApiFallback: {
      disableDotRule: true
    },
    stats: 'minimal'
  },
  node: {
    // workaround for webpack-dev-server issue
    // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
    fs: 'empty',
    net: 'empty'
  }
};
