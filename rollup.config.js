import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';

export default [
{
  input: 'src/index.ts',
  external: ['fs', 'path', 'uuid', 'arquero', 'vega', 'ml-regression-multivariate-linear', 'isolation-forest', 'ml-distance-euclidean', 'ml-matrix', 'ml-array-mean'],
  output: {
    sourcemap: true,
    dir: 'build',
    format: 'cjs'
  },
  plugins: [
    typescript({outDir: 'build'}),
    commonjs({transformMixedEsModules:true}),
  ]
},
{
  input: 'src/index.umd.ts',
  external: ['apache-arrow','node-fetch'],
  output: {
    sourcemap: true,
    dir: 'umd',
    format: 'umd',
    name: 'pyxis',
    globals: {
      'apache-arrow': 'Arrow',
      'node-fetch': 'fetch'
    }
  },
  plugins: [
    typescript({outDir: 'umd'}),
    json(),
    nodePolyfills({ include: null, sourceMap: true }),
    nodeResolve({ browser: true, extensions: ['.js', '.ts'] }),
    commonjs({transformMixedEsModules:true}),
  ]
}];

