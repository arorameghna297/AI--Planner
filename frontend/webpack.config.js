const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // <-- 1. NEW: Import the plugin

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  
  // v-- 2. NEW: Add the entire plugins section --v
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // This tells webpack to use your existing HTML file as a template
    }),
  ],
  // ^-- End of new section --^

  devServer: {
    static: path.join(__dirname, 'public'),
    historyApiFallback: true,
    port: 3000,
    open: true,
    proxy: {
      '/api': 'http://localhost:5001',
    },
  },
};
