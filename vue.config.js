const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    lintOnSave: false,
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@', resolve('src'))
    },
    configureWebpack: {
        module: {
            rules: [
                // {
                //     test: require.resolve('three/examples/jsm/controls/PointerLockControls'),
                //     use: 'imports-loader?THREE=three',
                // },
                // {
                //     test: require.resolve('three/examples/jsm/controls/PointerLockControls'),
                //     use: 'exports-loader?THREE.PointerLockControls'
                // }
            ]
        }
    }

}
// vue.config.js
module.exports = {
    transpileDependencies: [
        'vue-echarts',
        'resize-detector'
    ]
}