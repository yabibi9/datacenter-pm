const path = require('path');

module.exports = {
  entry: './src/index.js',  // Main entry point
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/dist'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,  // For JavaScript and JSX
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,  // Handle CSS files
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],  // Resolve these extensions
  },
  devServer: {
    static: path.join(__dirname, 'public'),  // Serve from 'public'
    compress: true,  // Enable gzip compression
    port: 3000,  // Port to run dev server
  },
};
