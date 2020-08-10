/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { buildOptimizer } from '@angular-devkit/build-optimizer';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import sourcemaps from 'rollup-plugin-sourcemaps';

const isDevelopment = process.env.NODE_ENV === 'development';

const buildOptimizerPlugin = {
    name: 'rollup-plugin-angular-build-optimizer',
    transform(code, id) {
        const options = {
            content: code,
            inputFilePath: id,
            emitSourceMap: isDevelopment
        };
        const optimized = buildOptimizer(options);
        if (isDevelopment) {
            return { code: optimized.content, map: optimized.sourceMap };
        } else {
            return optimized.content;
        }
    }
};

const additionalPlugins = [];
if (isDevelopment) {
    additionalPlugins.push(sourcemaps());
}

export default [
    {
        input: 'build/ngc-out/main.js',
        output: {
            file: 'build/dist/main.js',
            format: 'iife',
            sourcemap: isDevelopment && 'inline'
        },
        plugins: [
            replace({
                'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`
            }),
            ...additionalPlugins,
            resolve(),
            buildOptimizerPlugin
        ],
        treeshake: true,
        watch: {
            clearScreen: false
        }
    },
    {
        input: 'src/polyfills.js',
        output: {
            file: 'build/dist/polyfills.js',
            format: 'iife',
            sourcemap: isDevelopment && 'inline'
        },
        plugins: [ resolve() ],
        treeshake: true,
        watch: {
            clearScreen: false
        }
    }
];