import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';

export default [
{
  input: 'src/index.ts',
  output: {
    sourcemap: true,
    dir: 'output/es',
    format: 'es'
  },
  plugins: [
    typescript({outDir: 'output/es'}),
    commonjs({transformMixedEsModules:true})
  ]
},
{
  input: 'src/index.ts',
  output: {
    sourcemap: true,
    dir: 'output/cjs',
    format: 'cjs'
  },
  plugins: [
    typescript({outDir: 'output/cjs'}),
    commonjs({transformMixedEsModules:true})
  ]
}
];
