const webpack = require("webpack");
module.exports = function override(config, env) {
    config.resolve.fallback = {
        url: require.resolve("url"),
        assert: require.resolve("assert"),
        buffer: require.resolve("buffer"),
    };
    config.plugins.push(
        new webpack.ProvidePlugin({
            Buffer: ["buffer", "Buffer"],
        }),
    );

    return config;
};
