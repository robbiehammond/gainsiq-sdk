import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    { file: 'dist/gainsiq-sdk.cjs.js', format: 'cjs', sourcemap: true },
    { file: 'dist/gainsiq-sdk.esm.js', format: 'esm', sourcemap: true }
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist',          // Put declarations in dist
      rootDir: 'src',                  // Root directory for source files
      removeComments: true,            // Strip comments
      sourceMap: true,                 // Enable source maps
      outputToFilesystem: true,        // Ensure files are written
    }),
    terser()
  ],
  external: ['tslib']
};