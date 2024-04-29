const path = require('path');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

const webpack = require('webpack');
module.exports = function override(config) {
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
        'crypto': require.resolve('crypto-browserify'),
        'stream': require.resolve('stream-browserify'),
        'assert': require.resolve('assert'),
        'http': require.resolve('stream-http'),
        'https': require.resolve('https-browserify'),
        'os': require.resolve('os-browserify'),
        'url': require.resolve('url'),
        'fs': require.resolve('browserify-fs'),
        'path': require.resolve('path-browserify'),
        'querystring': require.resolve('querystring-browser'),
        'tls': require.resolve('tls-browserify'),
        'net': require.resolve('net-browserify'),
        'zlib': require.resolve('browserify-zlib')
    });
    config.resolve.fallback = fallback;
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer']
        })
    ]);

    config.resolve.plugins.forEach(plugin => {
        if (plugin instanceof ModuleScopePlugin) {
            plugin.allowedFiles.add(path.resolve('./_shared/index.ts'));
            plugin.allowedFiles.add(path.resolve('./node_modules/path-browserify/index.js'));
            plugin.allowedFiles.add(path.resolve('./node_modules/crypto-browserify/index.js'));
            plugin.allowedFiles.add(path.resolve('./node_modules/browserify-fs/index.js'));
        }
    });

    return config;
}
