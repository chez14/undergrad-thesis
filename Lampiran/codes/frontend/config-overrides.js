const { override, addBabelPlugins } = require('customize-cra');

module.exports = override(
    ...addBabelPlugins(["root-import", {
        rootPathPrefix: '~',
        rootPathSuffix: 'src',
    }])
)
