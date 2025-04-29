import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'popup/popup.js',
  output: {
    file: 'popup/popup.bundle.js',
    format: 'esm'
  },
  plugins: [
    resolve(),
    commonjs(),
    terser()
  ]
};
