const { resolve } = require('./utils');

module.exports = function (modules) {
    const plugins = [
        resolve('@babel/plugin-proposal-class-properties'),
        [
            resolve('@babel/plugin-transform-runtime'),
            {
                helpers: false,
            },
        ],
        [
            resolve('@babel/plugin-proposal-decorators'),
            {
                legacy: true,
            },
        ],
    ];

    return {
        presets: [
            resolve('@babel/preset-react'),
            [
                resolve('@babel/preset-env'),
                {
                    modules,
                    targets: {
                        browsers: [
                            'last 2 versions',
                            'Firefox ESR',
                            '> 1%',
                            'ie >= 9',
                            'iOS >= 8',
                            'Android >= 4',
                        ],
                    },
                },
            ]
        ],
        plugins,
    };
}
