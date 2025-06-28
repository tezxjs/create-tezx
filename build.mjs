import { build } from 'esbuild';

const commonOptions = {
    entryPoints: ['src/index.ts'],
    bundle: true,
    minify: true,
    platform: 'node',           // 🔧 THIS IS IMPORTANT
    target: 'node18',           // 🔧 or node20 or your version
    sourcemap: false,
    external: ['node:*'],       // 🔧 optional: skip bundling node: modules
};

build({
    ...commonOptions,
    format: 'cjs',
    outfile: 'dist/index.cjs',
});

build({
    ...commonOptions,
    format: 'esm',
    outfile: 'create-tezx/bin',
});
