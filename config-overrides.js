const webpack = require("webpack");
const path = require("path");

function resolve(dir) {
    return path.join(__dirname, ".", dir);
}

module.exports = function override(config, env) {
    config.experiments = {
        asyncWebAssembly: true,
    };
    config.module.rules.unshift({
        test: /\.m?js$/,
        resolve: {
            fullySpecified: false, // disable the behavior
        },
    });
    config.resolve.alias = {
        ...config.resolve.alias,
        "@": resolve("./src"),
    };
    config.resolve.fallback = {
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        assert: require.resolve("assert"),
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        os: require.resolve("os-browserify"),
        url: require.resolve("url"),
        // constants: require.resolve("constants-browserify"),
        constants: false,
        fs: false,
        path: false,
        tls: false,
        zlib: false,
        net: false,
        readline: false,
    };
    config.plugins.push(
        new webpack.ProvidePlugin({
            process: "process/browser",
            Buffer: ["buffer", "Buffer"],
        }),
    );
    config.cache = {
        type: "filesystem",
        version: "1",
    };

    return config;
};
