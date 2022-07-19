import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';

export default [
{
  input: 'src/index.ts',
  output: {
    sourcemap: true,
    dir: 'build',
    format: 'cjs'
  },
  plugins: [
    typescript({outDir: 'build'}),
    commonjs({transformMixedEsModules:true})
  ]
}
];
