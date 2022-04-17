const path = require("path");
const dotenv = require("dotenv");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

dotenv.config();

module.exports = {
    entry: {
        index: ["./src/main/webapp/index.js", "./src/main/webapp/index.css"],
    },
    mode: "production",
    output: {
        filename: "index.[contenthash].js",
        path: path.resolve(__dirname, process.env.STATIC),
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: "index.[contenthash].css" }),
        new HtmlWebpackPlugin({ template: "./src/main/webapp/index.html" }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.html$/,
                use: ["html-loader"],
            },
        ],
    },
};
