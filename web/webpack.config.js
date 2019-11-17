const path = require("path");

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist",
    port: 3000,
    proxy: { "/api/**": { target: "http://localhost:5000", secure: false } }
  },
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"]
      }
    ]
  }
};
