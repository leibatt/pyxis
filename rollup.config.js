import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';

export default [{
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
}];

