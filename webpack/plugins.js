var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');

var path = require('path');

module.exports = function (production) {
    var plugins = [
        new ExtractTextPlugin('timeline.css', {
            allChunks: true
        }),
    ];

    if (!production) {
        plugins.push(new HtmlWebpackPlugin({
            template: path.join(__dirname, '../demo/index.html'),
            hash: true
        }));
        plugins.push(new webpack.HotModuleReplacementPlugin());
    }

    return plugins;
};
