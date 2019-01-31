const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')


module.exports = {
  entry: {
    app: './src/app.js'
  },
  output: {
    filename: '[name]-bundle.js',
    path: path.resolve(__dirname, 'public/js')
  },
  mode: 'production',
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          { loader: "html-loader" }
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
        
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              // enable CSS Modules
              modules: true,
              // customize generated class names
              localIdentName: '[local]_[hash:base64:8]'
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  plugins: [
    // make sure to include the plugin!
    new VueLoaderPlugin()
  ]
};
