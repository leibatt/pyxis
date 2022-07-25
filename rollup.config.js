import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import nodePolyfills from 'rollup-plugin-polyfill-node';

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
    commonjs({transformMixedEsModules:true})
  ]
},
{
  input: 'src/index.ts',
  external: ['fs', 'path', 'uuid', 'arquero', 'vega', 'ml-regression-multivariate-linear', 'isolation-forest', 'ml-distance-euclidean', 'ml-matrix', 'ml-array-mean'],
  output: {
    sourcemap: true,
    dir: 'umd',
    format: 'umd',
    name: 'pyxis',
    globals: {
      arquero: 'aq',
      fs: 'fs',
      path: 'path',
      uuid: 'uuid',
      vega: 'vega'
    }
  },
  plugins: [
    typescript({outDir: 'umd'}),
    commonjs({transformMixedEsModules:true}),
    nodePolyfills({ include: null, sourceMap: true })
  ]
}];

