const path = require("path");

module.exports = {
    mode: "development",
    entry: "./public/index.js",
    output: {
        path: path.join(__dirname, "./public"),
        filename: "bundle.js",
        publicPath: "/public/"
    },
    module: {
        rules: [
            {
                test: "/.js$/",
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                }
            }
        ]
    }
};
