const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/dist'),
    publicPath: '/dist/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
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
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 3000,
    historyApiFallback: true,
    proxy: [
      {
        context: ['/api'], // Define which paths to proxy
        target: 'http://localhost:5000', // Backend Flask server
        changeOrigin: true,
        secure: false,
      },
    ],
    client: {
      webSocketURL: {
        hostname: 'localhost',
        pathname: '/ws',
        port: 3000,
      },
    },
    hot: true,
  },
};
