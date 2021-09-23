/* webpack.config.js */
const path = require('path');
var webpack = require('webpack');

var apiServer='null';

module.exports = env => {
  
  return {
  // Tell webpack to begin building its 
  // dependency graph from this file.
  mode: env.BUILDENV === 'production' ? 'production': 'development',
  ...(env.BUILDENV !== 'production' && {devtool: 'inline-source-map'}),
  devServer: {
    static: './public',
    host: 'dev-server',
    port: 3000
  },
  entry: path.join(__dirname, 'src', 'index.tsx'),
  // And to place the output in the `build` directory
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js'
  },
  module: {
    rules:
    [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'ts-loader'
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        use: 'url-loader'
      },
      {
        test: /\.css$/,
        use: 'url-loader'
      }

    ]
  },
  plugins: [
    new webpack.DefinePlugin(
      {
        REACT_APP_MOCK: env.BUILDENV === 'devMock' ? 'true' : 'false',
        REACT_APP_PORT: env.BUILDENV === 'devLive' ? '"80"' : (env.BUILDENV === 'devLiveM' ? '"8080"' : 'null') ,
        REACT_APP_API_SERVER: apiServer
      }
    )
  ],
  resolve: {
    extensions: [ '.tsx', '.ts', '.js'],
  },
  externals: {
    'react': 'React',
    'react-dom' : 'ReactDOM'
  }
 };
}
