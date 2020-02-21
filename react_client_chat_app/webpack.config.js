
var path = require("path");

var DIST_DIR = path.resolve(__dirname, "dist");
var SRC_DIR = path.resolve(__dirname, "src");

var config = {
    entry: SRC_DIR + "/app/index.js",
    output: {
        path: DIST_DIR + "/app",
        filename: "bundle.js",
        publicPath: "/app/"
    },
    module: {
        rules: [
            {
                test: /\.js?/,
                include: SRC_DIR,
                loader: "babel-loader",
                query: {
                    presets: ["@babel/preset-env", "@babel/preset-react"],
//use below plugin only if we are using react with maven
//first run -:   npm install --save-dev @babel/plugin-proposal-class-properties
//it is used to enabled class properties
                    plugins: [
                        "@babel/plugin-proposal-class-properties"


]
                }
            }
        ]
    },
    devServer: {
        historyApiFallback: true,
        port: 3284 // <--- Add this line and choose your own port number
    }
};

module.exports = config;
