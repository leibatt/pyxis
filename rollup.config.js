import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';

export default [
{
  input: 'src/index.ts',
  external: ['fs', 'path', 'uuid', 'arquero', 'vega', 'ml-regression-multivariate-linear', 'isolation-forest', 'ml-distance-euclidean', 'ml-matrix', 'ml-array-mean'],
  output: {
    dir: 'build',
    sourcemap: true,
    format: 'cjs'
  },
  plugins: [
    typescript({
      tsconfig: 'tsconfig.cjs.json'
    }),
    commonjs({ transformMixedEsModules: true })
  ]
},
{
  input: 'src/index.umd.ts',
  external: ['apache-arrow','node-fetch', 'vega'],
  output: [
    {
      sourcemap: true,
      dir: 'umd',
      format: 'umd',
      name: 'pyxis',
      globals: {
        'apache-arrow': 'Arrow',
        'node-fetch': 'fetch',
        'vega': 'vega'
      }
    },
    {
      sourcemap: true,
      file: 'umd/index.umd.min.js',
      format: 'umd',
      name: 'pyxis',
      plugins: [ terser({ ecma: 2018 }) ],
      globals: {
        'apache-arrow': 'Arrow',
        'node-fetch': 'fetch',
        'vega': 'vega'
      }
    }
  ],
  plugins: [
    typescript({
      tsconfig: 'tsconfig.umd.json'
    }),
    json(),
    nodeResolve({ browser: true, extensions: ['.js', '.ts'] }),
    commonjs({ transformMixedEsModules: true }),
  ]
}
];

