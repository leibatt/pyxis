import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.ts',
  output: {
    sourcemap: true,
    dir: 'output',
    format: 'cjs'
  },
  plugins: [
    typescript({outDir: 'output'}),
    commonjs({transformMixedEsModules:true})
  ]
};
