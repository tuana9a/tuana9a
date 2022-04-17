/* eslint-disable import/no-extraneous-dependencies */
const path = require("path");
const dotenv = require("dotenv");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

dotenv.config();

module.exports = {
    entry: {
        index: ["./src/main/webapp/index.js", "./src/main/webapp/index.css"],
    },
    mode: "development",
    watch: true,
    watchOptions: {
        ignored: ["node_modules", "src/main/node/**/*"],
    },
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, process.env.STATIC),
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: "index.css" }),
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
