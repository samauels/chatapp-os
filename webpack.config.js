const path = require('path');

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
      }
    ]
  }
};
